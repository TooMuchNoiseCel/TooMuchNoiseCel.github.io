'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Quat } from '@/lib/telemetria';

function Rocket({ quaternion }: { quaternion: Quat }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Quaternion());

  // La orientación viene de integrar el giroscopio real (applyGyro).
  useFrame((_, delta) => {
    if (!group.current) return;
    target.current.set(...quaternion);
    group.current.quaternion.slerp(target.current, 1 - Math.exp(-8 * delta));
  });

  return (
    <group ref={group} scale={0.8} position={[0, -0.25, 0]}>
      {/* Cuerpo */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.34, 0.4, 2.1, 40]} />
        <meshStandardMaterial color="#d7dee8" metalness={0.55} roughness={0.35} />
      </mesh>

      {/* Franja de color (guiño al cilindro del dashboard real) */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.352, 0.352, 0.16, 40]} />
        <meshStandardMaterial color="#5a9bdc" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Ojiva */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.34, 0.8, 40]} />
        <meshStandardMaterial color="#ef4444" metalness={0.35} roughness={0.45} />
      </mesh>

      {/* Tobera */}
      <mesh position={[0, -1.12, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 0.24, 24]} />
        <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* Aletas */}
      {[0, 1, 2, 3].map((index) => (
        <group key={index} rotation={[0, (index * Math.PI) / 2, 0]}>
          <mesh position={[0.48, -0.82, 0]}>
            <boxGeometry args={[0.42, 0.5, 0.035]} />
            <meshStandardMaterial color="#5a9bdc" metalness={0.45} roughness={0.45} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function RocketViewer({ quaternion }: { quaternion: Quat }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 32 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={2.1} />
      <directionalLight position={[-5, -2, -3]} intensity={0.8} color="#a3e635" />
      <Rocket quaternion={quaternion} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.9}
      />
    </Canvas>
  );
}
