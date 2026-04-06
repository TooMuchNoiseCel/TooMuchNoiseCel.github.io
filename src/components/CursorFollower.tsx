"use client";

import React, { useEffect, useRef, useState } from "react";

const CursorFollower = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsVisible(false);
      return;
    }

    document.body.style.cursor = 'none';
    let raf = 0;
    let x = -1;
    let y = -1;

    const update = () => {
      if (ref.current) {
        ref.current.style.transform = `translate(${x - 15}px, ${y - 15}px)`;
      }
      raf = requestAnimationFrame(update);
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-interactive="true"]')) {
        setIsHovering(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-interactive="true"]')) {
        setIsHovering(false);
      }
    };

    raf = requestAnimationFrame(update);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.body.style.cursor = 'auto';
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={ref}
      className={`
        fixed rounded-full pointer-events-none
        transition-all duration-300 ease-out z-50
        ${isHovering 
          ? 'w-12 h-12 bg-neutral-500/20 ring-white' 
          : 'w-8 h-8 bg-neutral-500/10 ring-neutral-400'
        }
        backdrop-blur-sm ring-1
      `}
    />
  );
};

export default CursorFollower;
