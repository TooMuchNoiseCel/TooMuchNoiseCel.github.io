"use client";

import React, { useEffect, useRef } from "react";

const CursorFollower = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
    raf = requestAnimationFrame(update);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="
        fixed w-10 h-10 rounded-full pointer-events-none
        transition-transform duration-150 ease-out z-50
        backdrop-blur-sm ring-1
      "
    />
  );
};

export default CursorFollower;
