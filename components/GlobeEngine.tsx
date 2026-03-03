"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import axios from "axios";

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  const globeRef = useRef<THREE.Group>(null);
  const [events, setEvents] = useState<any[]>([]);

  // AMBIL DATA REAL-TIME TANPA JEDA (Gempa & Kejadian Dunia)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson");
        const mapped = res.data.features.slice(0, 30).map((f: any) => ({
          id: f.id,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          title: f.properties.place,
          val: f.properties.mag,
          type: 'geologi'
        }));
        setEvents(mapped);
      } catch (e) { console.log("Sync Error"); }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-sync tiap 30 detik
    return () => clearInterval(interval);
  }, []);

  const [day, night, clouds] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  ]);

  useFrame(({ clock }) => {
    if (globeRef.current) globeRef.current.rotation.y = clock.getElapsedTime() * 0.01;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.2} maxDistance={10} />
      <Stars radius={150} depth={50} count={10000} factor={4} fade />
      
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#fff" />

      <group ref={globeRef}>
        {/* Lapisan Bumi Satelit */}
        <mesh castShadow>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={day} emissiveMap={night} emissive={new THREE.Color("#fff7ad")} emissiveIntensity={0.6} roughness={0.7} />
        </mesh>

        {/* Lapisan Atmosfer Awan */}
        <mesh scale={1.02}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.35} depthWrite={false} />
        </mesh>

        {/* Marker Kejadian Nyata */}
        {activeLayers.includes('geologi') && events.map((ev) => {
          const phi = (90 - ev.lat) * (Math.PI / 180);
          const theta = (ev.lng + 180) * (Math.PI / 180);
          const x = -(2.05 * Math.sin(phi) * Math.cos(theta));
          const y = 2.05 * Math.cos(phi);
          const z = 2.05 * Math.sin(phi) * Math.sin(theta);

          return (
            <group key={ev.id} position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial color="#00f2ff" />
              </mesh>
              <Html distanceFactor={10} center>
                <div className="group relative flex flex-col items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping shadow-[0_0_10px_cyan]" />
                  <div className="absolute bottom-4 hidden group-hover:block bg-black/95 border border-cyan-500/50 p-2 rounded text-[10px] w-40 backdrop-blur-md">
                    <p className="font-bold text-cyan-400">INFO_NYATA</p>
                    <p className="text-white leading-tight">{ev.title}</p>
                    <p className="text-slate-400 mt-1">{ev.val} SR</p>
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
