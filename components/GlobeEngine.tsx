"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine() {
  // Pakai <any> untuk bypass proteksi TypeScript yang terlalu ketat saat build
  const globeRef = useRef<any>(null);
  const cloudRef = useRef<any>(null);

  const { data: geoData } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    fetcher, { refreshInterval: 5000 }
  );

  const [map, night, clouds, normal, rough] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) globeRef.current.rotation.y = t * 0.004;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.007;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} />
      <OrbitControls enableDamping minDistance={2.5} maxDistance={12} />
      <Stars radius={300} count={12000} factor={7} fade />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2.5} />

      <group ref={globeRef}>
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          {/* FIX: specularMap diubah ke roughnessMap untuk menghindari Type Error */}
          <meshStandardMaterial 
            map={map} 
            normalMap={normal}
            roughnessMap={rough}
            emissiveMap={night} 
            emissive={new THREE.Color("#ffd27d")} 
            emissiveIntensity={0.8}
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>

        <mesh ref={cloudRef} scale={1.02}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.3} />
        </mesh>

        {/* EFEK ATMOSFER */}
        <mesh scale={1.1}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>

        {/* MARKER GEMPA */}
        {geoData?.features?.slice(0, 20).map((f: any, i: number) => {
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
                <meshBasicMaterial color={f.properties.mag > 5 ? "red" : "#00f2ff"} />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
}
