"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import axios from "axios";

// --- GLOBAL REAL-TIME DATA FETCHING ---
export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  const globeRef = useRef<THREE.Group>(null);
  const [liveData, setLiveData] = useState<any[]>([]);

  // 1. AMBIL DATA NYATA (Gempa Bumi & Aktivitas Geologi)
  const fetchGlobalData = async () => {
    try {
      // Data nyata dari USGS (United States Geological Survey)
      const res = await axios.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson");
      const mapping = res.data.features.map((f: any) => ({
        id: f.id,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        mag: f.properties.mag,
        place: f.properties.place,
        type: 'geologi',
        severity: f.properties.mag > 5 ? 'high' : 'medium'
      }));
      setLiveData(mapping);
    } catch (e) { console.error("Data Sync Error", e); }
  };

  useEffect(() => {
    fetchGlobalData();
    const timer = setInterval(fetchGlobalData, 600000); // Sync tiap 10 menit
    return () => clearInterval(timer);
  }, []);

  // 2. LOAD HIGH-END TEXTURES
  const [dayMap, nightMap, cloudMap, specMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(({ clock }) => {
    if (globeRef.current) globeRef.current.rotation.y = clock.getElapsedTime() * 0.015;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.1} maxDistance={10} />
      <Stars radius={200} depth={50} count={15000} factor={6} fade speed={1} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 5, 10]} intensity={2.5} color="#ffffff" />
      <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={1} color="#3b82f6" />

      <group ref={globeRef}>
        {/* BUMI UTAMA */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial 
            map={dayMap} 
            emissiveMap={nightMap} 
            emissive={new THREE.Color("#fff7ad")} 
            emissiveIntensity={0.8}
            roughnessMap={specMap}
            metalness={0.15}
          />
        </mesh>

        {/* LAPISAN AWAN DINAMIS */}
        <mesh scale={1.02}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={cloudMap} transparent opacity={0.4} depthWrite={false} />
        </mesh>

        {/* ATMOSFER GLOW */}
        <mesh scale={1.12}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#4facfe" transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>

        {/* RENDERING LIVE DATA MARKERS */}
        {activeLayers.includes('geologi') && liveData.map((point) => {
          const phi = (90 - point.lat) * (Math.PI / 180);
          const theta = (point.lng + 180) * (Math.PI / 180);
          const x = -(2.05 * Math.sin(phi) * Math.cos(theta));
          const y = 2.05 * Math.cos(phi);
          const z = 2.05 * Math.sin(phi) * Math.sin(theta);

          return (
            <group key={point.id} position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[0.025, 16, 16]} />
                <meshBasicMaterial color={point.severity === 'high' ? '#ff0000' : '#ff8800'} />
              </mesh>
              <Html distanceFactor={8} center>
                <div className="group relative pointer-events-auto cursor-help">
                  <div className={`w-3 h-3 rounded-full animate-ping shadow-lg ${point.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'}`} />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/95 border border-white/20 p-3 rounded-lg backdrop-blur-xl w-56 shadow-2xl z-50">
                    <p className="text-[10px] font-black text-orange-400 mb-1 border-b border-white/10 italic tracking-widest uppercase">DATA_AKTIVITAS_NYATA</p>
                    <p className="text-[12px] text-white font-bold leading-tight">{point.mag} SR - {point.place}</p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter italic">Sumber: USGS_LIVE_API</p>
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
