"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";

const GLOBAL_EVENTS = [
  { id: 1, lat: 48.37, lng: 31.16, type: "conflict", name: "Ukraine Sector", detail: "Frontline activity high." },
  { id: 2, lat: 31.04, lng: 34.85, type: "conflict", name: "Gaza-Israel Border", detail: "Surveillance active." },
  { id: 3, lat: 35.67, lng: 139.6, type: "economic", name: "Tokyo Exchange", detail: "Market volatility detected." },
  { id: 4, lat: -6.20, lng: 106.8, type: "base", name: "Jakarta HQ", detail: "System Node ID-JKT-082." }
];

const TYPE_COLORS: Record<string, string> = {
  conflict: "#ff4444",
  economic: "#00ff88",
  base: "#00f2ff",
  weather: "#ffffff"
};

function get3DPos(lat: number, lng: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  const globeRef = useRef<THREE.Group>(null);
  const colorMap = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

  useFrame((state) => {
    if (globeRef.current) globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  const visibleEvents = GLOBAL_EVENTS.filter(e => activeLayers.includes(e.type));

  return (
    <>
      <OrbitControls enableZoom={true} minDistance={2.2} maxDistance={8} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />

      <group ref={globeRef}>
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={colorMap} roughness={0.7} />
        </mesh>

        {visibleEvents.map((event) => {
          const pos = get3DPos(event.lat, event.lng, 2.02);
          const color = TYPE_COLORS[event.type] || "#fff";
          return (
            <group key={event.id} position={pos}>
              <mesh>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color={color} />
              </mesh>
              <Html distanceFactor={10}>
                <div className="group relative">
                    <div className="w-2 h-2 rounded-full animate-ping" style={{backgroundColor: color}} />
                    <div className="absolute left-4 top-0 hidden group-hover:block bg-black/90 border border-white/20 p-2 text-[10px] w-32 backdrop-blur-md rounded">
                        <p className="font-bold uppercase" style={{color}}>{event.type}</p>
                        <p className="text-white">{event.name}</p>
                    </div>
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </>
  );
}
