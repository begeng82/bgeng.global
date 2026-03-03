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
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.1;
      mesh.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (atmosphere.current) {
      atmosphere.current.rotation.y = -t * 0.05;
      atmosphere.current.scale.setScalar(1.15 + Math.sin(t * 0.5) * 0.02);
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={8000} factor={4} saturation={1} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={200} color="#00f2ff" />
      <pointLight position={[-10, -10, -10]} intensity={100} color="#0044ff" />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group scale={1.2}>
          <mesh ref={mesh}>
            <Sphere args={[2.5, 64, 64]}>
              <meshStandardMaterial 
                color="#000b1a" 
                wireframe 
                emissive="#00f2ff" 
                emissiveIntensity={1.2} 
                transparent
                opacity={0.8}
              />
            </Sphere>
          </mesh>
          <mesh ref={atmosphere}>
            <Sphere args={[2.6, 64, 64]}>
              <MeshDistortMaterial 
                color="#00f2ff" 
                speed={3} 
                distort={0.3} 
                transparent 
                opacity={0.08} 
              />
            </Sphere>
          </mesh>
        </group>
      </Float>
    </>
  );
}
