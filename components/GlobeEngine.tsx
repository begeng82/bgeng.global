"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera, useTexture, Line } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Fungsi konversi Lat/Lon ke 3D Vector
const getPos = (lat: number, lng: number, radius = 2.03) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

export default function GlobeEngine() {
  const globeRef = useRef<any>(null);
  const radarRef = useRef<any>(null);

  // DATA LIFETIME USGS
  const { data } = useSWR("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson", fetcher, { refreshInterval: 5000 });

  // TEKSTUR HD 4K
  const [map, night, normal] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'
  ]);

  // Simulasi Garis Lintasan (Missile/Cyber Attacks)
  const arcs = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 15; i++) {
      const start = getPos(Math.random() * 120 - 60, Math.random() * 360 - 180);
      const end = getPos(Math.random() * 120 - 60, Math.random() * 360 - 180);
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(2.5); // Lengkungan
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      lines.push(curve.getPoints(50));
    }
    return lines;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) globeRef.current.rotation.y = t * 0.05; // Rotasi pelan
    if (radarRef.current) {
      radarRef.current.rotation.y = t * 2; // Radar putar cepat
      radarRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 6]} />
      <OrbitControls enableDamping minDistance={2.2} maxDistance={10} autoRotate autoRotateSpeed={0.5} />
      <Stars radius={300} count={30000} factor={6} fade />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={2} color="#00f2ff" />

      <group ref={globeRef}>
        {/* Core Earth */}
        <mesh>
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial 
            map={map} normalMap={normal}
            emissiveMap={night} emissive={new THREE.Color("#00f2ff")} emissiveIntensity={2.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Radar Shield Sphere */}
        <mesh ref={radarRef} scale={1.08}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.05} />
        </mesh>

        {/* Cyber Attack Arcs */}
        {arcs.map((points, i) => (
          <Line key={`arc-${i}`} points={points} color={i % 3 === 0 ? "#ff003c" : "#00f2ff"} lineWidth={1.5} transparent opacity={0.6} />
        ))}

        {/* Realtime Seismic Markers */}
        {data?.features?.slice(0, 30).map((f: any, i: number) => {
          const pos = getPos(f.geometry.coordinates[1], f.geometry.coordinates[0]);
          const isCritical = f.properties.mag > 5.5;
          return (
            <mesh key={`marker-${i}`} position={pos}>
               <sphereGeometry args={[isCritical ? 0.05 : 0.02, 16, 16]} />
               <meshBasicMaterial color={isCritical ? "#ff003c" : "#ffb000"} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}
