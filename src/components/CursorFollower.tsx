'use client';

import { useState, useEffect } from 'react';

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: -1, y: -1 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return (
    <div
      className="
        fixed
        w-10 h-10
        rounded-full
        pointer-events-none 
        transition-transform duration-150 ease-out
        z-50
        backdrop-blur-sm
        ring-1
      "
      style={{
        transform: `translate(${position.x - 15}px, ${position.y - 15}px)`,
      }}
    />
  );
};

export default CursorFollower;
