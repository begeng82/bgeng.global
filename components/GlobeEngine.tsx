"use client";
import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  const globeGroup = useRef<THREE.Group>(null);
  const cloudMesh = useRef<THREE.Mesh>(null);
  
  // Deteksi Ukuran Layar untuk Skala Bumi
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const globeScale = isMobile ? 1.5 : 2.2;

  const { data: geoData } = useSWR("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", fetcher, { refreshInterval: 15000 });

  // TEXTURE 8K (Mirror Source)
  const [map, night, clouds, spec] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeGroup.current) globeGroup.current.rotation.y = t * 0.008;
    if (cloudMesh.current) cloudMesh.current.rotation.y = t * 0.012;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 8 : 6]} />
      <OrbitControls enableDamping dampingFactor={0.03} minDistance={2} maxDistance={12} />
      <Stars radius={300} depth={60} count={20000} factor={7} fade speed={1} />
      
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={2.5} color="#4facfe" />
      <spotLight position={[-10, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#fff" />

      <group ref={globeGroup}>
        {/* INTI BUMI DETAIL */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[globeScale, 128, 128]} />
          <meshStandardMaterial 
            map={map} 
            emissiveMap={night} 
            emissive={new THREE.Color("#fff7ad")} 
            emissiveIntensity={0.8}
            roughnessMap={spec}
            metalness={0.2}
          />
        </mesh>

        {/* ATMOSFER AWAN TEBAL */}
        <mesh ref={cloudMesh} scale={1.02}>
          <sphereGeometry args={[globeScale, 128, 128]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* EFEK GLOW RADIUS */}
        <mesh scale={1.15}>
          <sphereGeometry args={[globeScale, 128, 128]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>

        {/* DATA MARKER (REAL-TIME) */}
        {activeLayers.includes('geologi') && geoData?.features?.map((f: any) => {
          const [lng, lat] = f.geometry.coordinates;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          const r = globeScale + 0.05;
          const pos = [-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)] as [number, number, number];

          return (
            <group key={f.id} position={pos}>
              <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
                <mesh>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshBasicMaterial color={f.properties.mag > 5 ? "#ff0000" : "#00f2ff"} />
                </mesh>
                <Html distanceFactor={isMobile ? 15 : 10}>
                  <div className="bg-black/90 border border-white/20 p-2 rounded backdrop-blur-xl text-[10px] text-white whitespace-nowrap shadow-[0_0_15px_rgba(0,242,255,0.3)] font-mono uppercase">
                    <span className="text-cyan-400 font-black">{f.properties.mag} SR</span> | {f.properties.place.split(',')[1] || f.properties.place}
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
