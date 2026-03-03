"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// --- DATABASE INFORMASI DUNIA (SIMULASI) ---
const GLOBAL_INTEL = [
  { id: '1', lat: 48.37, lng: 31.16, cat: 'konflik', title: 'ZONE_UKRAINA', desc: 'Aktivitas artileri meningkat di sektor timur.' },
  { id: '2', lat: 31.26, lng: 34.80, cat: 'konflik', title: 'PERBATASAN_GAZA', desc: 'Pemantauan udara aktif 24/7.' },
  { id: '3', lat: 35.67, lng: 139.65, cat: 'ekonomi', title: 'BURSA_TOKYO', desc: 'Indeks teknologi turun 3.2%.' },
  { id: '4', lat: 40.71, lng: -74.00, cat: 'infrastruktur', title: 'NODE_NEWYORK', desc: 'Degradasi jaringan kabel bawah laut.' },
  { id: '5', lat: -6.20, lng: 106.81, cat: 'militer', title: 'HQ_JAKARTA', desc: 'Node pusat BGENG GLOBAL aman.' },
  { id: '6', lat: 21.30, lng: -157.85, cat: 'militer', title: 'BASE_PEARL_HARBOR', desc: 'Pergerakan armada ke Pasifik Barat.' },
  { id: '7', lat: 55.75, lng: 37.61, cat: 'politik', title: 'KREMLIN_MOSCOW', desc: 'Perubahan kebijakan ekspor energi.' },
];

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  const globeRef = useRef<THREE.Group>(null);
  
  // Load Tekstur 4K (Satelit, Lampu Malam, Awan, Spekular)
  const [map, night, clouds] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  ]);

  useFrame(({ clock }) => {
    if (globeRef.current) globeRef.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2.3} maxDistance={10} />
      <Stars radius={200} depth={50} count={15000} factor={6} fade />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff" />

      <group ref={globeRef}>
        {/* Bola Bumi Utama */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={map} emissiveMap={night} emissive={new THREE.Color("#fff7ad")} emissiveIntensity={0.6} />
        </mesh>

        {/* Lapisan Awan Terpisah */}
        <mesh scale={1.02}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} depthWrite={false} />
        </mesh>

        {/* Atmosfer (Glow Biru) */}
        <mesh scale={1.1}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>

        {/* Render Marker Informasi Global */}
        {GLOBAL_INTEL.filter(d => activeLayers.includes(d.cat)).map((data) => {
          const phi = (90 - data.lat) * (Math.PI / 180);
          const theta = (data.lng + 180) * (Math.PI / 180);
          const x = -(2.05 * Math.sin(phi) * Math.cos(theta));
          const y = 2.05 * Math.cos(phi);
          const z = 2.05 * Math.sin(phi) * Math.sin(theta);

          return (
            <group key={data.id} position={[x, y, z]}>
              <Html distanceFactor={8} center>
                <div className="group relative cursor-pointer flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 border-white animate-pulse shadow-[0_0_10px_white]
                    ${data.cat === 'konflik' ? 'bg-red-600' : 'bg-cyan-500'}`} />
                  
                  {/* Tooltip Informasi Detail */}
                  <div className="absolute bottom-6 hidden group-hover:block w-48 bg-black/95 border border-white/20 p-3 rounded-lg backdrop-blur-xl z-50 shadow-2xl">
                    <p className="text-[10px] font-black text-blue-400 mb-1 border-b border-white/10">{data.title}</p>
                    <p className="text-[9px] text-white leading-relaxed">{data.desc}</p>
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
