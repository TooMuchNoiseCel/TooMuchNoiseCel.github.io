'use client';

import React, { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll(".word");
    if (words.length === 0) {
      console.warn("ScrollReveal: No se encontraron elementos con la clase '.word' para animar.");
      return;
    }

    gsap.fromTo(
      el,
      {
        transformOrigin: "0% 50%",
        rotate: baseRotation,
        opacity: baseOpacity,
      },
      {
        rotate: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 60%",
          end: "bottom 130%",
          scrub: 1,
        },
      }
    );

    if (enableBlur) {
      gsap.fromTo(
        words,
        {
          filter: `blur(${blurStrength}px)`,
          opacity: baseOpacity,
        },
        {
          filter: "blur(0px)",
          opacity: 1,
          stagger: 0.05,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 60%",
            end: "bottom 130%",
            scrub: 1,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, [enableBlur, baseRotation, baseOpacity, blurStrength]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
