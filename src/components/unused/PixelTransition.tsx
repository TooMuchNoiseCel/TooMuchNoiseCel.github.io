// src/components/PixelTransition.tsx
"use client";

import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  activeBg?: string;
  className?: string;
  style?: CSSProperties;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 12,
  pixelColor = "currentColor",
  animationStepDuration = 0.4,
  activeBg = "#ffffff",
  className = "",
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeContentRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Crea la grilla de píxeles
  useEffect(() => {
    const grid = pixelGridRef.current;
    if (!grid) return;
    grid.innerHTML = "";
    const size = 100 / gridSize;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const px = document.createElement("div");
        px.style.position = "absolute";
        px.style.left = `${c * size}%`;
        px.style.top = `${r * size}%`;
        px.style.width = `${size}%`;
        px.style.height = `${size}%`;
        px.style.backgroundColor = pixelColor;
        px.style.opacity = "0";
        grid.appendChild(px);
      }
    }
  }, [gridSize, pixelColor]);

  const runTransition = useCallback(
    (activate: boolean) => {
      const grid = pixelGridRef.current;
      const activeEl = activeContentRef.current;
      if (!grid || !activeEl) return;

      tlRef.current?.kill();
      const tiles = Array.from(grid.children) as HTMLElement[];

      // Reset
      gsap.set(tiles, { opacity: 0 });
      gsap.set(activeEl, {
        opacity: activate ? 0 : 1,
        pointerEvents: activate ? "none" : "auto",
      });

      const tl = gsap.timeline();
      tl.to(tiles, {
        opacity: 1,
        duration: animationStepDuration * 0.6,
        stagger: {
          each: (animationStepDuration * 0.6) / tiles.length,
          from: "random",
        },
        ease: "none",
      });
      tl.add(() => {
        // Cambia el contenido activo cuando los píxeles cubren
        if (activate) {
          gsap.set(activeEl, { opacity: 1, pointerEvents: "auto" });
        } else {
          gsap.set(activeEl, { opacity: 0, pointerEvents: "none" });
        }
        setIsActive(activate);
      });
      tl.to(tiles, {
        opacity: 0,
        duration: animationStepDuration * 0.4,
        stagger: {
          each: (animationStepDuration * 0.4) / tiles.length,
          from: "random",
        },
        ease: "none",
      });

      tlRef.current = tl;
    },
    [animationStepDuration],
  );

  // En mobile, activar por scroll
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 75%",
      onToggle: (self) => {
        if (self.isActive !== isActive) runTransition(self.isActive);
      },
    });
    return () => st.kill();
  }, [isMobile, isActive, runTransition]);

  return (
    <div
      ref={containerRef}
      className={`${className} relative overflow-hidden`}
      style={style}
      onMouseEnter={
        !isMobile ? () => (!isActive ? runTransition(true) : undefined) : undefined
      }
      onMouseLeave={
        !isMobile ? () => (isActive ? runTransition(false) : undefined) : undefined
      }
    >
      {/* Sizer: define la altura del contenedor según el contenido activo */}
      <div className="pointer-events-none opacity-0 p-8 md:p-10" aria-hidden="true">
        <div className={isActive ? "hidden" : "block"}>{firstContent}</div>
        <div className={isActive ? "block" : "hidden"}>{secondContent}</div>
      </div>

      {/* Capa base (contenido inicial) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center p-8 md:p-10">
        {firstContent}
      </div>

      {/* Capa activa (contenido alternativo) */}
      <div
        ref={activeContentRef}
        className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-10 transition-opacity duration-300"
        style={{
          opacity: 0,
          pointerEvents: "none",
          backgroundColor: activeBg,
        }}
      >
        {secondContent}
      </div>

      {/* Grilla de píxeles por encima */}
      <div
        ref={pixelGridRef}
        className="pointer-events-none absolute inset-0 z-30"
      />
    </div>
  );
};

export default PixelTransition;
