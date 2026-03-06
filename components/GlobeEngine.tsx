"use client";
// @ts-nocheck
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine({ activeLayers }) {
  const globeRef = useRef();
  const cloudRef = useRef();

  // Ambil Data Gempa Live (Streaming tiap 10 detik)
  const { data: geoData } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    fetcher, { refreshInterval: 10000 }
  );

  const [map, night, clouds, spec] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) globeRef.current.rotation.y = t * 0.005;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.008;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6.5]} fov={45} />
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.4} maxDistance={12} />
      <Stars radius={300} depth={60} count={20000} factor={7} fade speed={1} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#4facfe" />
      <spotLight position={[-10, 5, 5]} angle={0.3} penumbra={1} intensity={1.5} />

      <group ref={globeRef}>
        {/* BODY BUMI */}
        <mesh>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial 
            map={map} 
            emissiveMap={night} 
            emissive={new THREE.Color("#ffd27d")} 
            emissiveIntensity={0.8}
            roughnessMap={spec}
            metalness={0.15}
          />
        </mesh>

        {/* CLOUD LAYER */}
        <mesh ref={cloudRef} scale={1.015}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        {/* ATMOSPHERE GLOW */}
        <mesh scale={1.15}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.07} side={THREE.BackSide} />
        </mesh>

        {/* REAL-TIME MARKERS */}
        {activeLayers.includes('geologi') && geoData?.features?.map((f) => {
          const [lng, lat] = f.geometry.coordinates;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          const pos = [-(2.03 * Math.sin(phi) * Math.cos(theta)), 2.03 * Math.cos(phi), 2.03 * Math.sin(phi) * Math.sin(theta)];

          return (
            <group key={f.id} position={pos}>
              <Float speed={5} rotationIntensity={1} floatIntensity={1}>
                <mesh>
                  <sphereGeometry args={[0.03, 16, 16]} />
                  <meshBasicMaterial color={f.properties.mag > 5 ? "#ff0000" : "#00f2ff"} />
                </mesh>
                <Html distanceFactor={10} center>
                  <div className="group relative -translate-y-4">
                    <div className={`w-3 h-3 rounded-full animate-ping ${f.properties.mag > 5 ? 'bg-red-500' : 'bg-cyan-400'}`} />
                    <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/95 border border-cyan-500/50 p-4 rounded-2xl backdrop-blur-2xl w-48 shadow-2xl z-50">
                      <p className="text-[10px] font-black text-cyan-400 mb-1 tracking-tighter italic underline">SIGNAL_REPORT</p>
                      <p className="text-[12px] text-white font-bold">{f.properties.mag} SR - {f.properties.place}</p>
                      <p className="text-[8px] text-slate-500 mt-1 uppercase font-mono italic">Source: USGS_LIVE_FEED</p>
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
