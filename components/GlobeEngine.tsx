"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function GlobeContent() {
  const globeRef = useRef<any>(null);
  const cloudRef = useRef<any>(null);

  // Data Gempa Lifetime (Update tiap 5 detik)
  const { data } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    fetcher, { refreshInterval: 5000 }
  );

  // Load Tekstur HD
  const [map, night, clouds, normal, spec] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) globeRef.current.rotation.y = t * 0.005;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.007;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls enableDamping minDistance={2.5} maxDistance={15} />
      <Stars radius={300} count={15000} factor={7} fade />
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={2.5} color="#00f2ff" />

      <group ref={globeRef}>
        <mesh>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial 
            map={map} 
            normalMap={normal}
            roughnessMap={spec}
            emissiveMap={night} 
            emissive={new THREE.Color("#ffd27d")} 
            emissiveIntensity={1.8}
          />
        </mesh>
        <mesh ref={cloudRef} scale={1.02}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
        {/* Atmosphere Outer Glow */}
        <mesh scale={1.15}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.1} side={THREE.BackSide} />
        </mesh>

        {data?.features?.slice(0, 40).map((f: any, i: number) => {
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
                 <sphereGeometry args={[0.04, 16, 16]} />
                 <meshBasicMaterial color={f.properties.mag > 5 ? "#ff0000" : "#00f2ff"} />
               </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
}

// WRAPPER UNTUK CEK CLIENT SIDE
export default function GlobeEngine() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <GlobeContent />;
}
