"use client";

import React, { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

function SmoothScroller({ children }: { children: React.ReactNode }) {
  // Arrancamos sin suavizado para que server y cliente rendericen igual.
  const [smooth, setSmooth] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    setSmooth(!prefersReduced && !isMobile);
  }, []);

  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.5, smoothWheel: smooth }}
    >
      {/* El tipado de react-lenis trae su propia copia de @types/react. */}
      {children as never}
    </ReactLenis>
  );
}

export default SmoothScroller;
