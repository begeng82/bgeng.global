"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import axios from "axios";

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  const globeRef = useRef<THREE.Group>(null);
  const [realTimeEvents, setRealTimeEvents] = useState<any[]>([]);

  // 1. Ambil Data Nyata (Gempa Bumi Dunia 24 Jam Terakhir)
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const res = await axios.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson");
        const points = res.data.features.map((feat: any) => ({
          id: feat.id,
          lat: feat.geometry.coordinates[1],
          lng: feat.geometry.coordinates[0],
          mag: feat.properties.mag,
          place: feat.properties.place,
          time: new Date(feat.properties.time).toLocaleTimeString(),
          type: 'alam'
        }));
        setRealTimeEvents(points);
      } catch (err) {
        console.error("Gagal mengambil data real-time", err);
      }
    };
    fetchRealData();
    const interval = setInterval(fetchRealData, 300000); // Update tiap 5 menit
    return () => clearInterval(interval);
  }, []);

  const [map, night, clouds] = useLoader(THREE.TextureLoader, [
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
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.2} maxDistance={12} />
      <Stars radius={200} depth={50} count={20000} factor={7} fade />
      
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />

      <group ref={globeRef}>
        {/* Bumi & Atmosfer */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={map} emissiveMap={night} emissive={new THREE.Color("#fff7ad")} emissiveIntensity={0.7} />
        </mesh>
        <mesh scale={1.015}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} depthWrite={false} />
        </mesh>

        {/* Render Titik Data Nyata (Gempa/Kejadian Alam) */}
        {activeLayers.includes('alam') && realTimeEvents.map((event) => {
          const phi = (90 - event.lat) * (Math.PI / 180);
          const theta = (event.lng + 180) * (Math.PI / 180);
          const x = -(2.05 * Math.sin(phi) * Math.cos(theta));
          const y = 2.05 * Math.cos(phi);
          const z = 2.05 * Math.sin(phi) * Math.sin(theta);

          return (
            <group key={event.id} position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial color="#ff5500" />
              </mesh>
              <Html distanceFactor={10}>
                <div className="group relative -translate-x-1/2 -translate-y-full">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                  <div className="hidden group-hover:block absolute bottom-4 bg-black/90 border border-orange-500/50 p-3 rounded-lg backdrop-blur-md w-48 shadow-2xl z-50">
                    <p className="text-[10px] font-black text-orange-400 border-b border-orange-500/20 mb-1 italic uppercase">Aktivitas Seismik Nyata</p>
                    <p className="text-[11px] text-white font-bold mb-1">{event.mag} SR - {event.place}</p>
                    <p className="text-[9px] text-slate-400">Waktu: {event.time}</p>
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
