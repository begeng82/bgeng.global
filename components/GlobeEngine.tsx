"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  // Pakai 'any' untuk ref biar Vercel nggak error pas build TypeScript
  const groupRef = useRef<any>(null);
  const cloudRef = useRef<any>(null);

  // DATA REAL-TIME NYATA (Update tiap 10 detik)
  const { data: earthquake } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    fetcher, { refreshInterval: 10000 }
  );

  // TEXTURE BUMI HIGH-RES
  const [map, night, clouds, spec] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.005;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.008;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.1} maxDistance={10} />
      <Stars radius={300} depth={50} count={20000} factor={7} fade speed={1} />
      
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <spotLight position={[-10, 5, 5]} angle={0.2} intensity={1} color="#3b82f6" />

      <group ref={groupRef}>
        {/* INTI BUMI */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial 
            map={map} 
            emissiveMap={night} 
            emissive={new THREE.Color("#fff7ad")} 
            emissiveIntensity={0.6}
            roughnessMap={spec}
            metalness={0.1}
          />
        </mesh>

        {/* LAPISAN AWAN REALISTIK */}
        <mesh ref={cloudRef} scale={1.015}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* ATMOSFER GLOW BLUE */}
        <mesh scale={1.12}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#4facfe" transparent opacity={0.07} side={THREE.BackSide} />
        </mesh>

        {/* RENDERING TITIK KEJADIAN DUNIA NYATA */}
        {activeLayers.includes('geologi') && earthquake?.features?.map((f: any) => {
          const [lng, lat] = f.geometry.coordinates;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          const pos = [-(2.05 * Math.sin(phi) * Math.cos(theta)), 2.05 * Math.cos(phi), 2.05 * Math.sin(phi) * Math.sin(theta)] as [number, number, number];

          return (
            <group key={f.id} position={pos}>
              <mesh>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color={f.properties.mag > 5 ? "#ff2200" : "#00d4ff"} />
              </mesh>
              <Html distanceFactor={10} center>
                <div className="group relative">
                  <div className={`w-3 h-3 rounded-full animate-ping ${f.properties.mag > 5 ? 'bg-red-500' : 'bg-cyan-400'}`} />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/95 border border-white/20 p-3 rounded-xl backdrop-blur-xl w-48 shadow-2xl z-50">
                    <p className="text-[10px] font-black text-blue-400 mb-1 border-b border-white/10 italic">WORLD_EVENT_SYNC</p>
                    <p className="text-[11px] text-white font-bold">{f.properties.mag} SR - {f.properties.place}</p>
                    <p className="text-[8px] text-slate-500 mt-1 uppercase italic font-mono">Status: LIVE_DETECTION</p>
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
