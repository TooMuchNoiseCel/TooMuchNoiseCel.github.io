'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const RAD = Math.PI / 180;
const PI = Math.PI;
const MODEL_URL = '/models/moto-helmet.glb';

function HelmetModel({ roll, pitch }: { roll: number; pitch: number }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);

  // Clonamos la escena cacheada: si React la desmonta no se liberan
  // las geometrías/materiales del modelo original.
  const model = useMemo(() => scene.clone(true), [scene]);

  // Sigue la orientación real del sensor (roll/pitch del MPU6050).
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, roll * RAD, 6, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pitch * RAD, 6, delta);
  });

  return (
    <group ref={group} rotation={[0.02, -0.35, 0]}>
      <primitive object={model} dispose={null} />
    </group>
  );
}

export default function HelmetViewer({ roll, pitch }: { roll: number; pitch: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 4.7], fov: 34 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={2.3} />
      <directionalLight position={[-4, -1, -5]} intensity={1.1} color="#93c5fd" />

      {/* Entorno local (sin red): reflejos para la pintura y el visor */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={3} position={[0, 4, 4]} scale={[8, 8, 1]} />
        <Lightformer intensity={2} position={[-5, 1, -2]} scale={[6, 6, 1]} color="#bae6fd" />
        <Lightformer intensity={1.4} position={[4, -2, 2]} scale={[6, 4, 1]} color="#fecdd3" />
      </Environment>

      <HelmetModel roll={roll} pitch={pitch} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.9}
        minPolarAngle={PI / 4}
        maxPolarAngle={(3 * PI) / 4}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
