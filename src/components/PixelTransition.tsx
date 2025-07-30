'use client';

import React, { useRef, useEffect, useState, CSSProperties, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  className?: string;
  style?: CSSProperties;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 12,
  pixelColor = "currentColor",
  animationStepDuration = 0.4,
  className = "",
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeContentRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const animationTweens = useRef<gsap.core.Tween[]>([]);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isLikelyMobile = window.innerWidth < 768;
      setIsMobile(isLikelyMobile);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;
    pixelGridEl.innerHTML = "";
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.style.backgroundColor = pixelColor;
        pixel.style.position = 'absolute';
        pixel.style.display = 'none';
        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = useCallback((activate: boolean) => {
    const activeEl = activeContentRef.current;
    const pixels = pixelGridRef.current?.children;
    if (!activeEl || !pixels || pixels.length === 0) return;

    animationTweens.current.forEach(t => t.kill());
    animationTweens.current = [];
    if (delayedCallRef.current) delayedCallRef.current.kill();

    const revealTween = gsap.to(pixels, {
      display: "block",
      duration: 0,
      stagger: {
        each: animationStepDuration / pixels.length,
        from: "random",
      },
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? 'block' : 'none';
      setIsActive(activate);
    });

    const hideTween = gsap.to(pixels, {
      display: "none",
      duration: 0,
      delay: animationStepDuration,
      stagger: {
        each: animationStepDuration / pixels.length,
        from: "random",
      },
    });

    animationTweens.current.push(revealTween, hideTween);
  }, [animationStepDuration]);

  useEffect(() => {
    if (isMobile && containerRef.current) {
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        onToggle: self => {
          if (self.isActive !== isActive) {
            animatePixels(self.isActive);
          }
        },
      });
      return () => { if (st) st.kill(); };
    }
  }, [isMobile, isActive, animatePixels]);

  return (
    <div
      ref={containerRef}
      className={`
        ${className}
        w-full relative // El contenedor principal debe ser relativo
        shadow-2xl shadow-neutral-400/20 rounded-lg
      `}
      style={style}
      onMouseEnter={!isMobile ? () => { if (!isActive) animatePixels(true) } : undefined}
      onMouseLeave={!isMobile ? () => { if (isActive) animatePixels(false) } : undefined}
    >
      <div className="opacity-0 pointer-events-none p-8 md:p-10">
        <div className={isActive ? 'hidden' : 'block'}>{firstContent}</div>
        <div className={isActive ? 'block' : 'hidden'}>{secondContent}</div>
      </div>


      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center">
        {firstContent}
      </div>

      <div
        ref={activeContentRef}
        className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center bg-white" // Fondo blanco para tapar el contenido de atrás
        style={{ display: 'none' }}
      >
        {secondContent}
      </div>

      <div
        ref={pixelGridRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    </div>
  );
};

export default PixelTransition;
