"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

interface GlobeVisualizationProps {
  supplyChainData: Array<{
    country: string;
    emission: number;
    riskLevel: string;
    facilities: number;
  }>;
}

function Globe({ supplyChainData }: GlobeVisualizationProps) {
  const globeRef = useRef<THREE.Mesh>(null);
  const pointsGroupRef = useRef<THREE.Group>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Convert country names to coordinates (simplified)
  const getCountryCoordinates = (country: string) => {
    const coordinates: { [key: string]: [number, number] } = {
      "United States": [40.0, -100.0],
      China: [35.0, 105.0],
      Vietnam: [16.0, 106.0],
      Mexico: [23.0, -102.0],
      Germany: [51.0, 10.0],
      India: [20.0, 78.0],
      Brazil: [-10.0, -55.0],
    };
    return coordinates[country] || [0, 0];
  };

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.1;
    }
  });

  // Convert lat/long to 3D position
  const latLongToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  return (
    <>
      <OrbitControls enableZoom={true} enablePan={true} />
      <Stars radius={100} depth={50} count={5000} factor={4} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />

      {/* Globe Sphere */}
      <Sphere ref={globeRef} args={[5, 32, 32]}>
        <meshPhongMaterial
          color="#1e3a8a"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Supply Chain Points */}
      <group ref={pointsGroupRef}>
        {supplyChainData.map((country, index) => {
          const [lat, lon] = getCountryCoordinates(country.country);
          const position = latLongToVector3(lat, lon, 5.1);
          const riskColor =
            country.riskLevel === "high"
              ? "#ef4444"
              : country.riskLevel === "medium"
              ? "#f59e0b"
              : "#10b981";

          return (
            <mesh
              key={index}
              position={position}
              onPointerOver={() => setHoveredPoint(index)}
              onPointerOut={() => setHoveredPoint(null)}
            >
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color={riskColor} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export function GlobeVisualization({
  supplyChainData,
}: GlobeVisualizationProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">
            Loading 3D Visualization...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 bg-black rounded-lg">
      <div className="text-white text-xs p-2 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
        Supply Chain Visualization - Red: High Risk, Yellow: Medium, Green: Low
      </div>
      <div className="h-full w-full">
        <iframe src="/globe.html" className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
}
