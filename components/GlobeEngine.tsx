"use client";
import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";

// DATA SIMULASI GLOBAL (Berita, Konflik, Ekonomi, Cuaca, dll)
const GLOBAL_EVENTS = [
  { id: 1, lat: 48.3794, lng: 31.1656, type: "conflict", name: "Eastern Europe Conflict", detail: "Heavy artillery movement reported." },
  { id: 2, lat: 31.0461, lng: 34.8516, type: "conflict", name: "Middle East Tension", detail: "Airspace restrictions in effect." },
  { id: 3, lat: 35.6762, lng: 139.6503, type: "economic", name: "Nikkei Index Drop", detail: "Tech stocks fall by 4.2%." },
  { id: 4, lat: 25.0330, lng: 121.5654, type: "hotspot", name: "Taiwan Strait", detail: "Naval drills observed." },
  { id: 5, lat: 28.3949, lng: 84.1240, type: "natural", name: "Magnitude 6.2 EQ", detail: "Seismic activity in Himalayan region." },
  { id: 6, lat: 51.5072, lng: -0.1276, type: "economic", name: "BoE Rate Decision", detail: "Interest rates held steady." },
  { id: 7, lat: 25.7617, lng: -80.1918, type: "weather", name: "Hurricane Warning", detail: "Category 3 storm approaching coast." },
  { id: 8, lat: 33.9391, lng: 67.7099, type: "military", name: "Troop Redeployment", detail: "Central Asia border movement." },
  { id: 9, lat: 40.7128, lng: -74.0060, type: "outage", name: "Major Comm Outage", detail: "Fiber optic cut affecting east coast." },
  { id: 10, lat: 50.8503, lng: 4.3517, type: "sanctions", name: "EU Sanctions Package", detail: "New trade restrictions announced." }
];

// Konfigurasi Warna Marker
const TYPE_COLORS: Record<string, string> = {
  conflict: "#ef4444", // Merah
  military: "#f97316", // Orange
  hotspot: "#eab308",  // Kuning
  economic: "#10b981", // Hijau
  weather: "#0ea5e9",  // Biru Muda
  natural: "#8b5cf6",  // Ungu
  outage: "#f43f5e",   // Rose
  sanctions: "#64748b" // Abu-abu
};

function get3DCoordinates(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function GlobeEngine({ activeLayers }: { activeLayers: string[] }) {
  const globeRef = useRef<THREE.Mesh>(null);

  // Load High-Res Earth Texture
  const [colorMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
  ]);

  const visibleEvents = GLOBAL_EVENTS.filter(event => activeLayers.includes(event.type));

  useFrame((state) => {
    // Putaran otomatis lambat
    if (globeRef.current) globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <>
      <OrbitControls enableZoom={true} minDistance={2.5} maxDistance={10} enablePan={false} />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      {/* Backlight biru elegan */}
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#1e40af" />

      <group ref={globeRef}>
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={colorMap} roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Render Markers */}
        {visibleEvents.map((event) => {
          const pos = get3DCoordinates(event.lat, event.lng, 2.01);
          const color = TYPE_COLORS[event.type] || "#ffffff";
          
          return (
            <group key={event.id} position={pos}>
              {/* Dot Center */}
              <mesh>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial color={color} />
              </mesh>
              {/* Glow Effect */}
              <mesh>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
              </mesh>
              {/* Label Info - Muncul saat bumi diputar menghadap kamera */}
              <Html distanceFactor={15} center>
                <div className="group relative cursor-pointer">
                  {/* Pin Indicator */}
                  <div className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: color }}>
                    <div className="w-full h-full rounded-full animate-ping-slow" style={{ backgroundColor: color }} />
                  </div>
                  
                  {/* Tooltip Content (Muncul saat di-hover) */}
                  <div className="absolute left-4 top-0 hidden group-hover:block bg-[#0f172a]/90 backdrop-blur-md border border-slate-700 p-3 rounded-md w-48 shadow-2xl z-50">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{event.type}</p>
                    <p className="text-sm font-semibold text-white mb-1 leading-tight">{event.name}</p>
                    <p className="text-xs text-slate-300 leading-snug">{event.detail}</p>
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
