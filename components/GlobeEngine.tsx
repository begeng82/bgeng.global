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

  // DATA LIVE: Gempa Bumi Global (Update tiap 10 detik)
  const { data: geoData } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    fetcher, { refreshInterval: 10000 }
  );

  // TEXTURE ASSET (NASA Blue Marble Style)
  const [map, night, clouds, spec] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) globeRef.current.rotation.y = t * 0.006;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.009;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.5} maxDistance={15} />
      <Stars radius={300} depth={60} count={25000} factor={7} fade speed={1} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2.5} color="#fff" />
      <spotLight position={[-10, 5, 10]} angle={0.5} penumbra={1} intensity={2} color="#3b82f6" />

      <group ref={globeRef}>
        {/* TERRAFORM: Lapisan Daratan & Lampu Malam */}
        <mesh>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial 
            map={map} 
            emissiveMap={night} 
            emissive={new THREE.Color("#ffd27d")} 
            emissiveIntensity={0.8}
            roughnessMap={spec}
            metalness={0.2}
          />
        </mesh>

        {/* ATMOSFER: Awan Bergerak */}
        <mesh ref={cloudRef} scale={1.018}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        {/* GLOW: Efek Pendaran Cahaya Biru Planet */}
        <mesh scale={1.12}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshBasicMaterial color="#4facfe" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>

        {/* MARKER: Lokasi Kejadian Nyata */}
        {activeLayers.includes('geologi') && geoData?.features?.map((f) => {
          const [lng, lat] = f.geometry.coordinates;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          const pos = [-(2.03 * Math.sin(phi) * Math.cos(theta)), 2.03 * Math.cos(phi), 2.03 * Math.sin(phi) * Math.sin(theta)];

          return (
            <group key={f.id} position={pos}>
              <Float speed={4} rotationIntensity={1} floatIntensity={1}>
                <mesh>
                  <sphereGeometry args={[0.035, 16, 16]} />
                  <meshBasicMaterial color={f.properties.mag > 5 ? "#ff0000" : "#00f2ff"} />
                </mesh>
                <Html distanceFactor={10}>
                  <div className="group relative -translate-y-6">
                    <div className={`w-3 h-3 rounded-full animate-ping ${f.properties.mag > 5 ? 'bg-red-600' : 'bg-cyan-500'}`} />
                    <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/95 border border-cyan-500/40 p-4 rounded-2xl backdrop-blur-2xl w-60 shadow-[0_0_40px_rgba(0,0,0,0.8)] z-50">
                      <p className="text-[10px] font-black text-cyan-500 mb-1 border-b border-white/10 pb-1 italic">INTEL_REPORT_0x44</p>
                      <p className="text-[13px] text-white font-bold leading-tight">{f.properties.mag} SR - {f.properties.place}</p>
                      <p className="text-[9px] text-slate-500 mt-2 font-mono uppercase tracking-tighter italic">Live_Sync: USGS_SAT_01</p>
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