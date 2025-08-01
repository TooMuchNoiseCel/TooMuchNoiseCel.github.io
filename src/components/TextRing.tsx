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

function drawCircleAroundPoint(origin, rotation, armLength, step, numPoints, frequency) {
  const angleStep = (Math.PI * 2) / numPoints;
  const angle = step * angleStep * frequency;

  const localPoint = new THREE.Vector3(armLength * Math.cos(angle), armLength * Math.sin(angle), 0);
  const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(rotation);
  const rotatedPoint = localPoint.clone().applyMatrix4(rotationMatrix);

  return rotatedPoint.clone().add(origin);
}

function calculateSplinePoints(arms) {
  const points = [];
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

function Letter({ char, fontUrl, color = 'black' }) {
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
      <meshStandardMaterial color={color} />
    </Text3D>
  );
}

function RingOfLetters() {
  const groupRef = useRef(null);
  const tickerOffset = useRef(0);
  const fontUrl = '/fonts/Gentilis_Bold.json';

  const languageData = useMemo(() => [
    { name: 'Python', color: '#3776AB' },
    { name: 'Rust', color: '#DEA584' },
    { name: 'Java', color: '#B07219' },
    { name: 'Dart', color: '#0175C2' },
    { name: 'C++', color: '#00599C' },
    { name: 'C', color: '#A8B9CC' },
    { name: 'Zig', color: '#F7A41D' },
    { name: 'Go', color: '#00ADD8' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'HTML', color: '#E34F26' },
    { name: 'CSS', color: '#1572B6' },
    { name: 'Bash', color: '#4EAA25' },
    { name: 'SQL', color: '#4479A1' },
    { name: 'Lua', color: '#2C2D72' },
  ], []);

  const charactersWithColor = useMemo(() => {
    const items = [];
    const repeatedLanguages = Array(params.wordRepeats).fill(languageData).flat();

    repeatedLanguages.forEach((lang) => {
      // Agregamos el separador
      for (const char of ' • ') {
        items.push({ char, color: 'black' });
      }
      for (const char of lang.name) {
        items.push({ char, color: lang.color });
      }
    });
    return items.reverse();
  }, [languageData, params.wordRepeats]);

  const arms = useMemo(() => [
    { length: 0.36, rotation: new THREE.Euler(0, 0, 0), frequency: 1 },
    { length: 0.43, rotation: new THREE.Euler(1.66, 0, 0), frequency: 4 },
    { length: 0.19, rotation: new THREE.Euler(3.68, 1.54, 1.71), frequency: 5 },
  ], []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(calculateSplinePoints(arms)), [arms]);
  const curveLength = useMemo(() => curve.getLength(), [curve]);
  
  const initialCameraPosition = useMemo(() => new THREE.Vector3(0, 0, 2.6), []);
  const targetCameraPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const { camera, pointer } = state;

    targetCameraPosition.set(
      initialCameraPosition.x + pointer.x * 0.5,
      initialCameraPosition.y + pointer.y * 0.5,
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
    if (tickerOffset.current < -curveLength) {
      tickerOffset.current += curveLength;
    }

    groupRef.current.children.forEach((child, i) => {
      const distance = (i / charactersWithColor.length) * curveLength;
      let totalDistance = (distance + tickerOffset.current) % curveLength;
      totalDistance = totalDistance < 0 ? totalDistance + curveLength : totalDistance;
      
      const t = totalDistance / curveLength;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);

      child.position.copy(point);
      child.lookAt(new THREE.Vector3().copy(point).add(tangent));
      child.rotateY(Math.PI / 2);

      const time = state.clock.getElapsedTime();
      const scaleEffect = (Math.sin(time + i * params.scaleDelayFactor) + 1) * 0.5;
      let scale = (params.scaleTarget / 100) * (1 - scaleEffect) + scaleEffect;
      scale = THREE.MathUtils.clamp(scale, 0.3, 0.6);
      child.scale.set(scale, scale, scale);

      const positionEffect = Math.sin(time + i * params.positionDelayFactor);
      child.position.y += positionEffect * params.positionAmplitude;
    });
  });

  return (
    <group ref={groupRef}>
      {charactersWithColor.map(({ char, color }, index) => (
        <group key={index}>
          <Letter char={char} fontUrl={fontUrl} color={color} />
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
