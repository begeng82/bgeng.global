"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  const globeRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  // DATA 1: Gempa Bumi Nyata (Update tiap 1 menit)
  const { data: earthquake } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson",
    fetcher, { refreshInterval: 60000 }
  );

  // LOAD TEXTURE 4K
  const [map, night, clouds, spec] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) globeRef.current.rotation.y = t * 0.01;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.015;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.2} maxDistance={10} />
      <Stars radius={200} depth={60} count={15000} factor={7} fade speed={1} />
      
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#fff" />
      <spotLight position={[-10, -5, -10]} intensity={1} color="#3b82f6" />

      <group ref={globeRef}>
        {/* BOLA BUMI */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={map} emissiveMap={night} emissive={new THREE.Color("#fff7ad")} emissiveIntensity={0.7} roughnessMap={spec} />
        </mesh>

        {/* AWAN BERGERAK */}
        <mesh ref={cloudRef} scale={1.015}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} depthWrite={false} />
        </mesh>

        {/* EFEK GLOW ATMOSFER */}
        <mesh scale={1.1}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#4facfe" transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>

        {/* RENDER TITIK GEMPA NYATA */}
        {activeLayers.includes('geologi') && earthquake?.features?.map((f: any) => {
          const [lng, lat] = f.geometry.coordinates;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          const pos = [-(2.05 * Math.sin(phi) * Math.cos(theta)), 2.05 * Math.cos(phi), 2.05 * Math.sin(phi) * Math.sin(theta)] as [number, number, number];

          return (
            <group key={f.id} position={pos}>
              <Float speed={5} rotationIntensity={1} floatIntensity={2}>
                <mesh>
                  <sphereGeometry args={[0.03, 16, 16]} />
                  <meshBasicMaterial color={f.properties.mag > 6 ? "#ff0000" : "#ffaa00"} />
                </mesh>
                <Html distanceFactor={10} center>
                  <div className="group relative cursor-crosshair">
                    <div className="w-4 h-4 rounded-full animate-ping bg-red-500" />
                    <div className="absolute bottom-6 hidden group-hover:block bg-black/95 border border-red-500/50 p-3 rounded-lg backdrop-blur-xl w-52 shadow-2xl z-50 font-mono">
                      <p className="text-[9px] font-black text-red-500 mb-1 tracking-widest uppercase">⚠️ ALERT_GEOLOGI</p>
                      <p className="text-[11px] text-white font-bold">{f.properties.mag} SR - {f.properties.place}</p>
                      <p className="text-[8px] text-slate-500 mt-1 uppercase italic font-mono">Live_Data: USGS_GOV</p>
                    </div>
                  </div>
                </Html>
              </Float>
            </group>
          );
        })}
      </group>
    </>
  );
}
