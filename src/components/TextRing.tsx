'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';

const params = {
  fontSize: 0.1,
  wordRepeats: 2,
  playTicker: true,
  tickerSpeed: 0.5,
  scaleTarget: 45,
  scaleDelayFactor: 0.5,
  positionAmplitude: 0.08,
  positionDelayFactor: 0.2,
  animateRotationZ: true,
  rotationZSpeed: 0.03,
};

function drawCircleAroundPoint(origin: THREE.Vector3, rotation: THREE.Euler, armLength: number, step: number, numPoints: number, frequency: number): THREE.Vector3 {
  const angleStep = (Math.PI * 2) / numPoints;
  const angle = step * angleStep * frequency;

  const localPoint = new THREE.Vector3(armLength * Math.cos(angle), armLength * Math.sin(angle), 0);
  const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(rotation);
  const rotatedPoint = localPoint.clone().applyMatrix4(rotationMatrix);

  return rotatedPoint.clone().add(origin);
}

function calculateSplinePoints(arms: any[]): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const numPoints = 1000;

  for (let step = 0; step <= numPoints; step++) {
    let currentOrigin = new THREE.Vector3(0, 0, 0);

    arms.forEach(arm => {
      currentOrigin = drawCircleAroundPoint(currentOrigin, arm.rotation, arm.length, step, numPoints, arm.frequency);
    });

    points.push(currentOrigin);
  }
  return points;
}

function Letter({ char, fontUrl }: { char: string; fontUrl: string }) {
  return (
    <Text3D
      font={fontUrl}
      size={params.fontSize}
      height={0.01}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.01}
      bevelSize={0.005}
    >
      {char}
      <meshStandardMaterial color="black" />
    </Text3D>
  );
}

function RingOfLetters() {
  const groupRef = useRef<THREE.Group>(null);
  const tickerOffset = useRef(0);

  const text = "• Python • Rust • Java • Dart • C++ • C • Zig • Go • JavaScript • HTML • CSS • Bash • LaTeX • SQL • MicroPython • Lua • Ocaml • Haskell".repeat(params.wordRepeats);
  const characters = text.split('').reverse();
  const fontUrl = '/fonts/Gentilis_Bold.json';

  const arms = useMemo(() => [
    { length: 0.36, rotation: new THREE.Euler(0, 0, 0), frequency: 1 },
    { length: 0.43, rotation: new THREE.Euler(1.66, 0, 0), frequency: 4 },
    { length: 0.19, rotation: new THREE.Euler(3.68, 1.54, 1.71), frequency: 5 },
  ], []);

  const initialCameraPosition = useMemo(() => new THREE.Vector3(0, 0, 2.6), []);
  const targetCameraPosition = useMemo(() => new THREE.Vector3(), []);


  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const { camera, pointer } = state;

    const parallaxIntensity = 0.5;

    targetCameraPosition.set(
      initialCameraPosition.x + pointer.x * parallaxIntensity,
      initialCameraPosition.y + pointer.y * parallaxIntensity,
      initialCameraPosition.z
    );

    camera.position.lerp(targetCameraPosition, 3 * delta);


    camera.lookAt(0, 0, 0);


    if (params.animateRotationZ) {
      arms[2].rotation.z = (arms[2].rotation.z + params.rotationZSpeed * delta) % (Math.PI * 2);
    }

    if (params.playTicker) {
      tickerOffset.current -= params.tickerSpeed * delta * 0.1;
    }

    const points = calculateSplinePoints(arms);
    const curve = new THREE.CatmullRomCurve3(points);
    const curveLength = curve.getLength();

    if (tickerOffset.current < -curveLength) {
      tickerOffset.current += curveLength;
    }

    groupRef.current.children.forEach((child, i) => {
      const distance = (i / characters.length) * curveLength;
      let totalDistance = distance + tickerOffset.current;

      totalDistance %= curveLength;
      if (totalDistance < 0) {
        totalDistance += curveLength;
      }

      const t = totalDistance / curveLength;

      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      const lookAtPoint = new THREE.Vector3().copy(point).add(tangent);

      child.position.copy(point);
      child.lookAt(lookAtPoint);
      child.rotateY(Math.PI / 2);

      const time = state.clock.getElapsedTime();
      const scaleDelay = i * params.scaleDelayFactor;
      const positionDelay = i * params.positionDelayFactor;

      const scaleEffect = (Math.sin(time + scaleDelay) + 1) * 0.5;
      var scale = (params.scaleTarget / 100) * (1 - scaleEffect) + scaleEffect;
      scale = THREE.MathUtils.clamp(scale, 0.3, 0.6);
      child.scale.set(scale, scale, scale);

      const positionEffect = Math.sin(time + positionDelay);
      child.position.y += positionEffect * params.positionAmplitude;
    });
  });

  return (
    <group ref={groupRef}>
      {characters.map((char, index) => (
        <group key={index}>
          <Letter char={char} fontUrl={fontUrl} />
        </group>
      ))}
    </group>
  );
}

export default function TextRing() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.6], fov: 45 }}
      style={{ background: '#FFF' }}
    >
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      <Suspense fallback={null}>
        <RingOfLetters />
      </Suspense>
    </Canvas>
  );
}
