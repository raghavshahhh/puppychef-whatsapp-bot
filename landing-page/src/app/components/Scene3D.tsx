'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Cake 3D Model
function Cake({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Cake Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.4, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>
      {/* Cake Middle */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.7, 0.8, 0.35, 32]} />
        <meshStandardMaterial color="#D2691E" roughness={0.5} />
      </mesh>
      {/* Cake Top */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.3, 32]} />
        <meshStandardMaterial color="#FFE4B5" roughness={0.4} />
      </mesh>
      {/* Frosting */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <torusGeometry args={[0.5, 0.08, 16, 32]} />
        <meshStandardMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={0.2} />
      </mesh>
      {/* Candle */}
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.3} />
      </mesh>
      {/* Flame */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#FF6B35" />
      </mesh>
    </group>
  );
}

// Treat/Bone 3D Model
function Bone({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Bone Center */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.7} />
      </mesh>
      {/* Bone Ends */}
      <mesh castShadow receiveShadow position={[-0.45, 0, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.45, 0, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.45, 0.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.45, 0.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Paw Print 3D Model
function Paw({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Main Pad */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.35, 24, 24]} scale={[1, 0.6, 1]} />
        <meshStandardMaterial color="#FF6B6B" roughness={0.4} />
      </mesh>
      {/* Toe Pads */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          castShadow
          receiveShadow
          position={[
            Math.cos((i - 1) * 0.8) * 0.35,
            0.25,
            Math.sin((i - 1) * 0.8) * 0.25,
          ]}
        >
          <sphereGeometry args={[0.12, 16, 16]} scale={[1, 0.8, 1]} />
          <meshStandardMaterial color="#FF6B6B" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Coffee Cup 3D Model
function CoffeeCup({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Cup */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.25, 0.6, 24]} />
        <meshStandardMaterial color="#FFF8DC" roughness={0.3} />
      </mesh>
      {/* Coffee Liquid */}
      <mesh position={[0, 0.25, 0]}>
        <circleGeometry args={[0.25, 24]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#4B3621" roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh castShadow position={[0.32, 0, 0]}>
        <torusGeometry args={[0.12, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#FFF8DC" roughness={0.3} />
      </mesh>
      {/* Steam particles */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 2 + Date.now() * 0.001) * 0.1,
            0.5 + i * 0.15 + Math.sin(Date.now() * 0.002 + i) * 0.05,
            Math.cos(i * 2 + Date.now() * 0.001) * 0.1,
          ]}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3 - i * 0.08} />
        </mesh>
      ))}
    </group>
  );
}

// Floating Particles
function Particles() {
  const points = useMemo(() => {
    const arr = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={150}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#FFD700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main Scene
function Scene() {
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.4} color="#FFE4B5" />

      {/* Directional Light (Main) */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
      />

      {/* Rim Light */}
      <pointLight position={[-5, 5, -5]} intensity={0.8} color="#FF69B4" />

      {/* Gold Accent Light */}
      <pointLight position={[5, -5, 5]} intensity={0.5} color="#FFD700" />

      {/* Floating Objects */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <Cake position={[-3, 1, -2]} rotation={[0.2, 0.5, 0]} />
      </Float>

      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
        <Bone position={[3.5, 0.5, -1]} />
      </Float>

      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.6}>
        <Paw position={[-2.5, -1, 1]} />
      </Float>

      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
        <CoffeeCup position={[2, 1.5, 1]} />
      </Float>

      <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.45}>
        <Bone position={[0, -1.5, -3]} rotation={[0, Math.PI / 4, Math.PI / 6]} />
      </Float>

      {/* Particles */}
      <Particles />

      {/* Ground Shadow */}
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={10}
      />

      {/* Environment for reflections */}
      <Environment preset="night" />
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
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
