"use client";
import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Stars, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// --- DATABASE SIMULASI (Bisa diganti dengan API asli nantinya) ---
const HOTSPOTS = [
  { id: 1, lat: 48.3794, lng: 31.1656, type: "conflict", name: "Eastern Europe Zone" },
  { id: 2, lat: 31.0461, lng: 34.8516, type: "conflict", name: "Middle East Sector" },
  { id: 3, lat: 14.0583, lng: 115.9000, type: "hotspot", name: "South China Sea" },
  { id: 4, lat: 37.5665, lng: 126.9780, type: "base", name: "USFK Command" },
  { id: 5, lat: 25.0330, lng: 121.5654, type: "hotspot", name: "Taiwan Strait" },
  { id: 6, lat: -6.2000, lng: 106.8166, type: "base", name: "BGENG HQ Node" },
];

// Rumus Matematika Konversi Lat/Lng ke 3D Vector
function get3DCoordinates(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  const globeRef = useRef<THREE.Mesh>(null);

  // Load Tekstur Satelit (Gunakan tekstur gelap agar pin bersinar)
  const [colorMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
  ]);

  // Filter data berdasarkan tombol yang nyala di UI
  const visibleData = HOTSPOTS.filter(spot => activeLayers.includes(spot.type));

  return (
    <>
      <OrbitControls enableZoom={true} minDistance={2.5} maxDistance={8} />
      <Stars radius={300} depth={60} count={10000} factor={4} saturation={0} fade />
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f2ff" />

      <group>
        <mesh ref={globeRef}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={colorMap} roughness={0.8} />
        </mesh>

        {/* RENDER TITIK KOORDINAT */}
        {visibleData.map((spot) => {
          const pos = get3DCoordinates(spot.lat, spot.lng, 2.02);
          const color = spot.type === 'conflict' ? '#ff0044' : spot.type === 'base' ? '#00f2ff' : '#ffaa00';
          
          return (
            <group key={spot.id} position={pos}>
              {/* Titik Cahaya */}
              <mesh>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color={color} />
              </mesh>
              {/* Animasi Radar / Ping */}
              <mesh>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.4} />
              </mesh>
              {/* Label HTML yang nempel di 3D */}
              <Html distanceFactor={15} center>
                <div className="bg-black/80 border border-white/20 p-1 text-[8px] font-mono text-white whitespace-nowrap backdrop-blur-sm pointer-events-none">
                  <span style={{ color }}>●</span> {spot.name}
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </>
  );
}
