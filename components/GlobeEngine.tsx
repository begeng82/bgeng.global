"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Stars, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function GlobeEngine() {
  const mesh = useRef<THREE.Mesh>(null);
  const atmosphere = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) mesh.current.rotation.y = t * 0.15;
    if (atmosphere.current) {
      atmosphere.current.rotation.y = -t * 0.1;
      atmosphere.current.scale.setScalar(1.1 + Math.sin(t * 0.5) * 0.05);
    }
  });

  return (
    <>
      <Stars radius={150} depth={50} count={10000} factor={6} fade />
      {/* Fix: Pakai intensitas yang diterima TypeScript */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={150} color="#00f2ff" />
      
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <group>
          <mesh ref={mesh}>
            <Sphere args={[2.5, 64, 64]}>
              <meshStandardMaterial color="#000814" wireframe emissive="#00f2ff" emissiveIntensity={0.8} />
            </Sphere>
          </mesh>
          <mesh ref={atmosphere}>
            <Sphere args={[2.6, 64, 64]}>
              <MeshDistortMaterial color="#00f2ff" speed={4} distort={0.2} transparent opacity={0.1} />
            </Sphere>
          </mesh>
        </group>
      </Float>
    </>
  );
}
