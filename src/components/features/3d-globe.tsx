'use client';

// This file renders an interactive, rotating 3D globe with supply-chain dots using
// React Three Fiber (R3F). The dots are colored by risk level, and the scene
// includes orbit controls and a starfield background. Rendering is client-only.

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  // Input data to plot on the globe
  supplyChainData: Array<{
    country: string; // Country name (must exist in COUNTRY_COORDINATES)
    emission: number; // Example metric (not used in this viz yet)
    riskLevel: string; // 'low' | 'medium' | 'high' (controls point color)
    facilities: number; // Example metric (not used in this viz yet)
  }>;
}

// Minimal country-to-lat/lon lookup used to place points on the globe surface.
// Add more entries as needed for your dataset.
const COUNTRY_COORDINATES: { [key: string]: [number, number] } = {
  'United States': [39.8283, -98.5795],
  China: [35.8617, 104.1954],
  Vietnam: [14.0583, 108.2772],
  Mexico: [23.6345, -102.5528],
  Germany: [51.1657, 10.4515],
  India: [20.5937, 78.9629],
  Brazil: [-14.235, -51.9253],
};

/**
 * Convert latitude/longitude to a THREE.Vector3 on a sphere.
 *
 * @param lat Latitude in degrees (positive north)
 * @param lon Longitude in degrees (positive east)
 * @param radius Sphere radius
 * @returns Vector3 positioned on the sphere surface
 */
function latLongToVector3(lat: number, lon: number, radius: number) {
  // Spherical → Cartesian conversion (Y-up coordinate system)
  const phi = (90 - lat) * (Math.PI / 180); // polar angle from +Y
  const theta = (lon + 180) * (Math.PI / 180); // azimuthal angle from -X

  // Cartesian coordinates on sphere
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Renders colored points on the globe based on the provided data.
 * Uses BufferGeometry for performance and animates slow rotation.
 */
function GlobePoints({ data }: { data: GlobeProps['supplyChainData'] }) {
  // Reference to the Points object so we can animate its rotation each frame
  const pointsRef = useRef<THREE.Points>(null);

  // Rotate the points cloud slowly over time for a subtle auto-rotate effect
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  // Compute positions & colors once per data change. We build flat Float32Array
  // buffers because BufferGeometry expects typed arrays.
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(data.length * 3); // x,y,z per point
    const colors = new Float32Array(data.length * 3); // r,g,b per point

    data.forEach((item, i) => {
      const coords = COUNTRY_COORDINATES[item.country];
      if (coords) {
        const [lat, lon] = coords;
        // Place each point on the globe of radius 5 (matches sphereGeometry below)
        const position = latLongToVector3(lat, lon, 5);

        // Write xyz into the position buffer
        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;

        // Color by risk level (red=high, amber=medium, green=low)
        const color = new THREE.Color(
          item.riskLevel === 'high'
            ? '#ef4444'
            : item.riskLevel === 'medium'
              ? '#f59e0b'
              : '#10b981',
        );

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      // If a country is missing from COUNTRY_COORDINATES, we simply skip it.
    });

    return { positions, colors };
  }, [data]);

  // Create a BufferGeometry from the computed attribute arrays. We memoize so
  // that we only rebuild when the attribute arrays change.
  const geometry = useMemo(() => {
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return bufferGeometry;
  }, [positions, colors]);

  // Cleanup GPU resources on unmount to prevent memory leaks.
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      {/* sizeAttenuation makes points shrink with distance for depth perception */}
      <pointsMaterial size={0.3} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

/**
 * High-level wrapper that composes the scene: globe, data points, stars, and controls.
 * Note: <Canvas> is dynamically imported with SSR disabled at the bottom of this file.
 */
export function ThreeGlobe({ supplyChainData }: GlobeProps) {
  return (
    <div className="h-64 w-full bg-gray-900 rounded-lg relative">
      {/* Legend overlay (absolute-positioned on top of the canvas) */}
      <div className="absolute top-3 left-3 z-10 text-white text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Low Risk</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>High Risk</span>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="h-full w-full">
        {/*
          Canvas is loaded dynamically (ssr:false) so this component only renders on the client.
          We set a modest FOV and position the camera back a bit to fit the 5-unit radius globe.
        */}
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }} gl={{ antialias: true }}>
          {/* Scene background color (Tailwind slate-900) */}
          <color attach="background" args={['#111827']} />

          {/* Basic lighting: ambient for base fill, point for specular highlights */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          {/* Globe surface (semi-transparent) */}
          <mesh>
            {/* radius=5; segments provide a smooth sphere without being too heavy */}
            <sphereGeometry args={[5, 32, 32]} />
            <meshPhongMaterial color="#1e40af" transparent opacity={0.6} shininess={100} />
          </mesh>

          {/* Supply-chain data points */}
          <GlobePoints data={supplyChainData} />

          {/* Starfield for depth and ambience */}
          <Stars radius={100} depth={50} count={5000} factor={4} />

          {/* Orbit controls for rotate/zoom (no pan). autoRotate adds subtle motion. */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={8}
            maxDistance={20}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </div>
  );
}

// --- Dynamic Canvas import for Next.js ---
// We import Canvas with SSR disabled because three.js depends on browser APIs
// (e.g., WebGL) that don't exist on the server. The const is defined *after*
// ThreeGlobe, but that's fine: by the time ThreeGlobe is executed/rendered,
// the module has finished evaluating and Canvas has been initialized.
import dynamic from 'next/dynamic';
const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
  ssr: false,
});
