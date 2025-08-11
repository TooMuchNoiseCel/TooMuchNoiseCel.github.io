"use client";

import React from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

function SmoothScroller({ children }: { children: React.ReactNode }) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  if (prefersReduced || isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScroller;
