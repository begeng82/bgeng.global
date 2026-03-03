"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import axios from "axios";

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  const globeRef = useRef<THREE.Group>(null);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);

  // FETCH DATA NYATA (Gempa Bumi & Berita Dunia via API Gratis)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data Gempa Bumi Nyata dari USGS (Update tiap menit)
        const res = await axios.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson");
        const seismicPoints = res.data.features.map((f: any) => ({
          id: f.id,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          info: `${f.properties.mag} SR - ${f.properties.place}`,
          type: 'alam',
          color: '#ff4400'
        }));

        // Simulasi Titik Berita Global (GDELT Style)
        const newsPoints = [
          { id: 'n1', lat: 34.05, lng: -118.24, info: "Update Ekonomi Pasifik", type: 'ekonomi', color: '#00ff88' },
          { id: 'n2', lat: 51.50, lng: -0.12, info: "Diplomasi Uni Eropa", type: 'politik', color: '#3b82f6' },
          { id: 'n3', lat: 35.67, lng: 139.65, info: "Riset Teknologi AI Tokyo", type: 'teknologi', color: '#a855f7' },
        ];

        setRealTimeData([...seismicPoints, ...newsPoints]);
      } catch (err) {
        console.error("Gagal sinkronisasi data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Sinkronisasi ulang tiap 60 detik
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
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.2} maxDistance={10} />
      <Stars radius={150} depth={50} count={10000} factor={5} fade />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[15, 10, 10]} intensity={2} color="#ffffff" />

      <group ref={globeRef}>
        {/* Lapisan Bumi Malam (City Lights) */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={map} emissiveMap={night} emissive={new THREE.Color("#ffff88")} emissiveIntensity={0.6} />
        </mesh>

        {/* Lapisan Awan Bergerak */}
        <mesh scale={1.015}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} depthWrite={false} />
        </mesh>

        {/* Titik Data Real-Time */}
        {realTimeData.filter(d => activeLayers.includes(d.type)).map((point) => {
          const phi = (90 - point.lat) * (Math.PI / 180);
          const theta = (point.lng + 180) * (Math.PI / 180);
          const x = -(2.05 * Math.sin(phi) * Math.cos(theta));
          const y = 2.05 * Math.cos(phi);
          const z = 2.05 * Math.sin(phi) * Math.sin(theta);

          return (
            <group key={point.id} position={[x, y, z]}>
              <Html distanceFactor={10}>
                <div className="group relative flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full animate-ping shadow-xl`} style={{ backgroundColor: point.color }} />
                  <div className="hidden group-hover:block absolute top-6 bg-black/95 border border-white/20 p-3 rounded-lg backdrop-blur-md w-44 shadow-2xl z-50">
                    <p className="text-[10px] font-black text-blue-400 border-b border-white/10 mb-1 tracking-tighter uppercase">INFORMASI_NYATA</p>
                    <p className="text-[11px] text-white leading-tight font-bold">{point.info}</p>
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
