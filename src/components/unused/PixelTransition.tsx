'use client';
import React, { useRef, useLayoutEffect, useState, CSSProperties } from 'react';
import { gsap } from 'gsap';

interface PixelTransitionProps {
  children: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  className?: string;
  style?: CSSProperties;
  forceActive: boolean;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  children,
  gridSize = 5,
  pixelColor = '#222',
  animationStepDuration = 0.4,
  className = '',
  style = {},
  forceActive,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    gsap.set(containerRef.current, { visibility: 'hidden' });
  }, []);

  useLayoutEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;
    pixelGridEl.innerHTML = '';
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixelated-image-card__pixel', 'absolute');
        pixel.style.backgroundColor = pixelColor;
        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  useLayoutEffect(() => {
    animatePixels(forceActive);
  }, [forceActive]);

  const animatePixels = (activate: boolean): void => {
    const containerEl = containerRef.current;
    const contentEl = contentRef.current;
    const pixels = containerEl?.querySelectorAll<HTMLDivElement>('.pixelated-image-card__pixel');

    if (!containerEl || !contentEl || !pixels || pixels.length === 0) return;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    const tl = gsap.timeline();
    animationRef.current = tl;

    const staggerDuration = animationStepDuration / pixels.length;

    if (activate) {
      gsap.set(containerEl, {
        visibility: 'visible',
        opacity: 1,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      });
      gsap.set(contentEl, { display: 'none' });

      tl.fromTo(pixels, { opacity: 0 }, {
        opacity: 1,
        display: 'block',
        duration: 0,
        stagger: { each: staggerDuration, from: 'random' }
      });

      tl.to(containerEl, {
        backgroundColor: pixelColor,
        borderColor: 'white',
        duration: animationStepDuration,
        ease: 'power2.inOut',
      }, '>-=0.1');
      
      tl.set(contentEl, { display: 'grid' }, '<');

      tl.to(pixels, {
        opacity: 0,
        duration: 0,
        stagger: { each: staggerDuration, from: 'random' },
        onComplete: () => {
          gsap.set(pixels, { display: 'none' });
        }
      }, '<');

    } else {
      tl.to(pixels, {
        opacity: 1,
        display: 'block',
        duration: 0,
        stagger: { each: staggerDuration, from: 'random' },
      });

      tl.to(containerEl, {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        duration: animationStepDuration,
        ease: 'power2.inOut'
      }, '<');
      
      tl.set(contentEl, { display: 'none' }, '<');

      tl.to(pixels, {
        opacity: 0,
        duration: 0,
        stagger: { each: staggerDuration, from: 'random' },
        onComplete: () => {
          gsap.set(containerEl, { visibility: 'hidden' });
        }
      }, '>-=0.1');
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${className} text-white rounded-[15px] border-2 bg-transparent border-transparent relative overflow-hidden grid`}
      style={{ ...style, visibility: 'hidden' }}
    >
      <div ref={contentRef} style={{ gridArea: '1 / 1', display: 'none' }}>
        {children}
      </div>
      <div ref={pixelGridRef} className="absolute inset-0 w-full h-full pointer-events-none z-[3]" />
    </div>
  );
};

export default PixelTransition;
