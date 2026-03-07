"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera, useTexture } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine() {
  const globeRef = useRef<any>(null);
  const cloudRef = useRef<any>(null);

  // DATA LIFETIME USGS: Update tiap 5 detik
  const { data } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    fetcher, { refreshInterval: 5000 }
  );

  // TEKSTUR HD
  const [map, night, clouds, normal, spec] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) globeRef.current.rotation.y = t * 0.003;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.004;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} />
      <OrbitControls enableDamping minDistance={2.5} maxDistance={15} />
      <Stars radius={300} count={20000} factor={7} fade />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00f2ff" />

      <group ref={globeRef}>
        {/* Core Earth */}
        <mesh>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial 
            map={map} 
            normalMap={normal}
            roughnessMap={spec}
            emissiveMap={night} 
            emissive={new THREE.Color("#ffd27d")} 
            emissiveIntensity={1.5}
          />
        </mesh>
        
        {/* Clouds */}
        <mesh ref={cloudRef} scale={1.025}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Atmosphere Glow */}
        <mesh scale={1.15}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>

        {/* Realtime Seismic Markers */}
        {data?.features?.slice(0, 50).map((f: any, i: number) => {
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
               <Html distanceFactor={10}>
                  <div className="bg-black/60 border border-cyan-500/30 px-1 py-0.5 rounded text-[8px] text-cyan-400 opacity-0 hover:opacity-100 transition-opacity">
                    M{f.properties.mag} - {f.properties.place}
                  </div>
               </Html>
            </group>
          );
        })}
      </group>
    </>
  );
}
