'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple floating particles
function Particles() {
  const points = useMemo(() => {
    const arr = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#FFD700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Floating Cake (simplified)
function FloatingCake({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Bottom tier */}
      <mesh castShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.3, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>
      {/* Middle tier */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.45, 0.55, 0.25, 32]} />
        <meshStandardMaterial color="#D2691E" roughness={0.5} />
      </mesh>
      {/* Top tier */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.25, 32]} />
        <meshStandardMaterial color="#FFE4B5" roughness={0.4} />
      </mesh>
      {/* Candle */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.3} />
      </mesh>
      {/* Flame */}
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#FF6B35" />
      </mesh>
    </group>
  );
}

// Floating Bone
function FloatingBone({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Center */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.7} />
      </mesh>
      {/* Ends */}
      <mesh castShadow position={[-0.35, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0.35, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Floating Paw
function FloatingPaw({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main pad */}
      <mesh castShadow>
        <sphereGeometry args={[0.3, 24, 24]} scale={[1, 0.5, 0.8]} />
        <meshStandardMaterial color="#FF6B6B" roughness={0.4} />
      </mesh>
      {/* Toe pads */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          castShadow
          position={[
            Math.cos((i - 1) * 0.7) * 0.25,
            0.2,
            Math.sin((i - 1) * 0.7) * 0.2,
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} scale={[1, 0.6, 1]} />
          <meshStandardMaterial color="#FF6B6B" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Coffee Cup
function FloatingCup({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Cup */}
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.5, 24]} />
        <meshStandardMaterial color="#FFF8DC" roughness={0.3} />
      </mesh>
      {/* Handle */}
      <mesh castShadow position={[0.25, 0, 0]}>
        <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#FFF8DC" roughness={0.3} />
      </mesh>
      {/* Coffee */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 24]} />
        <meshStandardMaterial color="#4B3621" roughness={0.2} />
      </mesh>
    </group>
  );
}

// Main Scene
function Scene() {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} color="#FFE4B5" />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#FF69B4" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#FFD700" />

      {/* Floating Objects */}
      <FloatingCake position={[-2.5, 0.5, -2]} />
      <FloatingBone position={[3, 0, -1]} />
      <FloatingPaw position={[-2, -1, 1]} />
      <FloatingCup position={[2.5, 1, 1]} />
      <FloatingBone position={[0, -1.5, -3]} />

      {/* Particles */}
      <Particles />
    </>
  );
}

// Canvas Component
export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
