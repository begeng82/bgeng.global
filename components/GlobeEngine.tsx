"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine() {
  const globeRef = useRef<any>(null);
  const cloudRef = useRef<any>(null);

  // LIFETIME DATA: Update USGS Tiap 5 Detik
  const { data: seismic } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    fetcher, { refreshInterval: 5000 }
  );

  const [map, night, clouds, normal, spec] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) globeRef.current.rotation.y = t * 0.003;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.005;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} />
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.4} maxDistance={15} />
      <Stars radius={300} count={20000} factor={7} fade />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={3} color="#4facfe" />

      <group ref={globeRef}>
        {/* CORE EARTH - HIGH DETAIL */}
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

        {/* DYNAMIC CLOUDS LAYER */}
        <mesh ref={cloudRef} scale={1.025}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* ATMOSPHERE SCATTERING GLOW */}
        <mesh scale={1.15}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>

        {/* REAL-TIME MARKERS */}
        {seismic?.features?.slice(0, 50).map((f: any, i: number) => {
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
                 <meshBasicMaterial color={f.properties.mag > 5 ? "#ff3333" : "#00f2ff"} />
               </mesh>
               <Html distanceFactor={10}>
                  <div className="p-1 bg-black/60 border border-white/20 text-[6px] text-white opacity-0 hover:opacity-100 transition-opacity">
                    M{f.properties.mag}
                  </div>
               </Html>
            </group>
          );
        })}
      </group>
    </>
  );
}
