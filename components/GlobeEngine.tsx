"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  // Gunakan Group untuk globe utama agar tidak error TypeScript
  const globeGroupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // DATA NYATA 1: Gempa Bumi (USGS)
  const { data: geoData } = useSWR("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", fetcher, { refreshInterval: 30000 });

  const [map, night, clouds] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeGroupRef.current) globeGroupRef.current.rotation.y = t * 0.01;
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.012;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.1} maxDistance={10} />
      <Stars radius={200} depth={50} count={10000} factor={6} fade speed={1} />
      
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />

      <group ref={globeGroupRef}>
        {/* BOLA DUNIA */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={map} emissiveMap={night} emissive={new THREE.Color("#fff7ad")} emissiveIntensity={0.6} />
        </mesh>

        {/* AWAN HIDUP */}
        <mesh ref={cloudsRef} scale={1.015}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} depthWrite={false} />
        </mesh>

        {/* TITIK DATA REAL-TIME */}
        {activeLayers.includes('geologi') && geoData?.features?.map((f: any) => {
          const [lng, lat] = f.geometry.coordinates;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          const x = -(2.05 * Math.sin(phi) * Math.cos(theta));
          const y = 2.05 * Math.cos(phi);
          const z = 2.05 * Math.sin(phi) * Math.sin(theta);

          return (
            <group key={f.id} position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial color={f.properties.mag > 5 ? "#ff0000" : "#ff8800"} />
              </mesh>
              <Html distanceFactor={8}>
                <div className="group relative -translate-x-1/2 -translate-y-full">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                  <div className="hidden group-hover:block absolute bottom-4 bg-black/95 border border-blue-500 p-3 rounded-lg backdrop-blur-xl w-48 shadow-2xl z-50">
                    <p className="text-[10px] font-black text-blue-400 border-b border-white/10 mb-1">EVENT_DETECTION</p>
                    <p className="text-[11px] text-white font-bold">{f.properties.mag} SR - {f.properties.place}</p>
                    <p className="text-[8px] text-slate-500 mt-1 uppercase italic">Source: USGS_LIVE</p>
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
