'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  supplyChainData: Array<{
    country: string;
    emission: number;
    riskLevel: string;
    facilities: number;
  }>;
}

// Country coordinates (simplified)
const COUNTRY_COORDINATES: { [key: string]: [number, number] } = {
  'United States': [39.8283, -98.5795],
  China: [35.8617, 104.1954],
  Vietnam: [14.0583, 108.2772],
  Mexico: [23.6345, -102.5528],
  Germany: [51.1657, 10.4515],
  India: [20.5937, 78.9629],
  Brazil: [-14.235, -51.9253],
};

function latLongToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function GlobePoints({ data }: { data: GlobeProps['supplyChainData'] }) {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(data.length * 3);
    const colors = new Float32Array(data.length * 3);
    const sizes = new Float32Array(data.length);

    data.forEach((item, i) => {
      const coords = COUNTRY_COORDINATES[item.country];
      if (coords) {
        const [lat, lon] = coords;
        const position = latLongToVector3(lat, lon, 5);
        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;

        // Color based on risk level
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

        // Size based on emission (normalized)
        sizes[i] = Math.min(0.3 + (item.emission / 50000) * 0.7, 1.0);
      }
    });

    return { positions, colors, sizes };
  }, [data]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial size={0.2} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

export function ThreeGlobe({ supplyChainData }: GlobeProps) {
  return (
    <div className="h-64 w-full bg-gray-900 rounded-lg relative">
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

      <div className="h-full w-full">
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }} gl={{ antialias: true }}>
          <color attach="background" args={['#111827']} />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          {/* Globe */}
          <mesh>
            <sphereGeometry args={[5, 32, 32]} />
            <meshPhongMaterial color="#1e40af" transparent opacity={0.6} shininess={100} />
          </mesh>

          {/* Supply Chain Points */}
          <GlobePoints data={supplyChainData} />

          {/* Stars */}
          <Stars radius={100} depth={50} count={5000} factor={4} />

          {/* Controls */}
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

// Canvas component for client-side only rendering
import dynamic from 'next/dynamic';
const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
  ssr: false,
});
