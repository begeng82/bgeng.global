"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  // Benerin typing di sini supaya gak error build
  const globeRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  const { data: earthquake } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson",
    fetcher, { refreshInterval: 60000 }
  );

  const [map, night, clouds] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
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
      <Stars radius={200} depth={60} count={15000} factor={7} fade />
      
      <ambientLight intensity={0.5} /> {/* Benerin prop intensity */}
      <pointLight position={[10, 10, 10]} intensity={1.5} />

      <group ref={globeRef}>
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={map} emissiveMap={night} emissive={new THREE.Color("#fff7ad")} emissiveIntensity={0.5} />
        </mesh>

        <mesh ref={cloudRef} scale={1.015}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.3} depthWrite={false} />
        </mesh>

        {activeLayers.includes('geologi') && earthquake?.features?.map((f: any) => {
          const [lng, lat] = f.geometry.coordinates;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          const pos = [-(2.05 * Math.sin(phi) * Math.cos(theta)), 2.05 * Math.cos(phi), 2.05 * Math.sin(phi) * Math.sin(theta)] as [number, number, number];

          return (
            <group key={f.id} position={pos}>
              <mesh>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color="#ff4400" />
              </mesh>
              <Html distanceFactor={10}>
                <div className="bg-black/90 text-[9px] p-2 rounded border border-red-500/50 backdrop-blur-md text-white whitespace-nowrap">
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
