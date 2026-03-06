"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  // PAKAI <any> BIAR TIDAK ERROR ROTATION SAAT BUILD
  const globeRef = useRef<any>(null);
  const cloudRef = useRef<any>(null);

  const { data: geoData } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    fetcher, { refreshInterval: 10000 }
  );

  const [map, night, clouds] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) globeRef.current.rotation.y = t * 0.005;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.008;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <OrbitControls enableDamping minDistance={2.3} maxDistance={10} />
      <Stars radius={300} count={12000} factor={7} fade />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />

      <group ref={globeRef}>
        {/* BUMI UTAMA */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={map} emissiveMap={night} emissive={new THREE.Color("#fff7ad")} emissiveIntensity={0.7} />
        </mesh>

        {/* LAPISAN AWAN */}
        <mesh ref={cloudRef} scale={1.015}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* EFEK ATMOSFER PENDARAN BIRU */}
        <mesh scale={1.1}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>

        {/* MARKER GEMPA REAL-TIME */}
        {activeLayers.includes('geologi') && geoData?.features?.map((f: any, i: number) => {
          const [lng, lat] = f.geometry.coordinates;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          const pos: [number, number, number] = [
            -(2.03 * Math.sin(phi) * Math.cos(theta)), 
            2.03 * Math.cos(phi), 
            2.03 * Math.sin(phi) * Math.sin(theta)
          ];

          return (
            <group key={i} position={pos}>
              <mesh>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color={f.properties.mag > 5 ? "#ff0000" : "#00f2ff"} />
              </mesh>
              <Html distanceFactor={10} center>
                <div className="bg-black/90 border border-cyan-500/50 p-2 rounded text-[9px] text-white whitespace-nowrap backdrop-blur-md">
                   {f.properties.mag} SR - {f.properties.place}
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </>
  );
}
