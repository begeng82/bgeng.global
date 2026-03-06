"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobeEngine() {
  const globeRef = useRef<any>(null);
  const cloudRef = useRef<any>(null);

  // Data Lifetime Gempa Dunia
  const { data: geoData } = useSWR(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    fetcher, { refreshInterval: 5000 } // Update tiap 5 detik
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
    if (globeRef.current) globeRef.current.rotation.y = t * 0.004;
    if (cloudRef.current) cloudRef.current.rotation.y = t * 0.007;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.5} maxDistance={15} />
      <Stars radius={300} depth={60} count={15000} factor={6} fade />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={3} color="#4facfe" />
      <spotLight position={[-10, 5, 5]} intensity={1} color="#ffffff" angle={0.5} />

      <group ref={globeRef}>
        {/* BUMI DETAIL TINGGI */}
        <mesh>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial 
            map={map} 
            normalMap={normal}
            specularMap={spec}
            emissiveMap={night} 
            emissive={new THREE.Color("#ffd27d")} 
            emissiveIntensity={0.8}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>

        {/* CLOUDS DYNAMIC */}
        <mesh ref={cloudRef} scale={1.02}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* ATMOSPHERE GLOW */}
        <mesh scale={1.15}>
          <sphereGeometry args={[2, 128, 128]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>

        {/* LIFETIME DATA MARKERS */}
        {geoData?.features?.slice(0, 30).map((f: any, i: number) => {
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
              <Float speed={4} rotationIntensity={1} floatIntensity={1}>
                <mesh>
                  <sphereGeometry args={[0.035, 16, 16]} />
                  <meshBasicMaterial color={f.properties.mag > 5 ? "#ff0000" : "#00f2ff"} />
                </mesh>
                <Html distanceFactor={8} center>
                  <div className="group relative pointer-events-auto">
                    <div className="w-4 h-4 rounded-full bg-cyan-400/20 animate-ping absolute -inset-0" />
                    <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 border border-cyan-500/50 p-3 rounded-xl backdrop-blur-xl w-40">
                      <p className="text-[10px] font-bold text-white leading-tight">{f.properties.place}</p>
                      <p className="text-[9px] text-cyan-400 font-mono mt-1 underline italic">{f.properties.mag} MAGNITUDE</p>
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
