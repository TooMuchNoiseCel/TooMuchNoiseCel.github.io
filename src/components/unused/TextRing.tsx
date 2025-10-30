'use client';

import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import splinePointsData from '/public/spline-points.json';

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

const fontUrl = '/fonts/Gentilis_Bold.json';

function Letter({ char, color = 'black' }) {
  return (
    <Text3D font={fontUrl} size={params.fontSize} height={0.01} curveSegments={12} bevelEnabled bevelThickness={0.01} bevelSize={0.005}>
      {char}
      <meshStandardMaterial color={color} />
    </Text3D>
  );
}

function RingOfLetters() {
  const groupRef = useRef(null);
  const tickerOffset = useRef(0);
  
  const languageData = useMemo(() => [
    { name: 'Python', color: '#3776AB' }, { name: 'Rust', color: '#DEA584' },
    { name: 'Java', color: '#B07219' }, { name: 'Dart', color: '#0175C2' },
    { name: 'C++', color: '#00599C' }, { name: 'C', color: '#A8B9CC' },
    { name: 'Zig', color: '#F7A41D' }, { name: 'Go', color: '#00ADD8' },
    { name: 'JavaScript', color: '#F7DF1E' }, { name: 'HTML', color: '#E34F26' },
    { name: 'CSS', color: '#1572B6' }, { name: 'Bash', color: '#4EAA25' },
    { name: 'SQL', color: '#4479A1' }, { name: 'Lua', color: '#2C2D72' },
  ], []);

  const allCharacters = useMemo(() => {
    const items = [];
    const repeatedLanguages = Array(params.wordRepeats).fill(languageData).flat();
    repeatedLanguages.forEach((lang) => {
      for (const char of ' • ') items.push({ char, color: 'black' });
      for (const char of lang.name) items.push({ char, color: lang.color });
    });
    return items.reverse();
  }, [languageData]);

  const [renderedCharacters, setRenderedCharacters] = useState([]);

  useEffect(() => {
    let currentIndex = 0;
    const batchSize = 15;
    let animationFrameId;

    function addBatch() {
      if (currentIndex >= allCharacters.length) return;
      const nextBatch = allCharacters.slice(currentIndex, currentIndex + batchSize);
      setRenderedCharacters(prev => [...prev, ...nextBatch]);
      currentIndex += batchSize;
      animationFrameId = requestAnimationFrame(addBatch);
    }
    
    addBatch();

    return () => cancelAnimationFrame(animationFrameId); // Limpieza
  }, [allCharacters]);

  const splinePoints = useMemo(() => splinePointsData.map(p => new THREE.Vector3(...p)), []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(splinePoints), [splinePoints]);
  const curveLength = useMemo(() => curve.getLength(), [curve]);
  
  const initialCameraPosition = useMemo(() => new THREE.Vector3(0, 0, 2.6), []);
  const targetCameraPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!groupRef.current?.children.length) return;
    const { camera, pointer } = state;

    targetCameraPosition.set(initialCameraPosition.x + pointer.x * 0.5, initialCameraPosition.y + pointer.y * 0.5, initialCameraPosition.z);
    camera.position.lerp(targetCameraPosition, 3 * delta);
    camera.lookAt(0, 0, 0);

    if (params.playTicker) {
      tickerOffset.current -= params.tickerSpeed * delta * 0.1;
    }
    if (tickerOffset.current < -curveLength) {
      tickerOffset.current += curveLength;
    }

    groupRef.current.children.forEach((child, i) => {
      const distance = (i / allCharacters.length) * curveLength;
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
      {renderedCharacters.map(({ char, color }, index) => (
        <group key={index}>
          <Letter char={char} color={color} />
        </group>
      ))}
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();
  return <Html center style={{ color: 'black', fontSize: '1.2em' }}>Cargando {Math.round(progress)}%</Html>;
}

export default function TextRing() {
  return (
    <Canvas camera={{ position: [0, 0, 2.6], fov: 45 }} style={{ background: '#FFF' }}>
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Suspense fallback={<Loader />}>
        <RingOfLetters />
      </Suspense>
    </Canvas>
  );
}
