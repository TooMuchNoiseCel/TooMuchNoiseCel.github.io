'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomableImage({ src, alt, className = '' }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const imgRef = useRef<HTMLImageElement>(null);

  const open = useCallback(() => {
    if (animating) return;
    const el = imgRef.current;
    if (!el) return;
    setRect(el.getBoundingClientRect());
    setIsOpen(true);
    setAnimating(true);
    setPhase('opening');
    // Force a reflow before transitioning to 'open'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase('open');
      });
    });
  }, [animating]);

  const close = useCallback(() => {
    if (phase !== 'open') return;
    setAnimating(true);
    setPhase('closing');
  }, [phase]);

  const handleTransitionEnd = useCallback(() => {
    if (phase === 'open') {
      setAnimating(false);
    } else if (phase === 'closing') {
      setIsOpen(false);
      setAnimating(false);
      setPhase('closed');
    }
  }, [phase]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, close]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Calculate the transform for the image clone
  const getStyle = (): React.CSSProperties => {
    if (!rect) return {};

    if (phase === 'opening') {
      // Start position: match the original image exactly
      return {
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: '0.75rem',
        transition: 'none',
        zIndex: 60,
        cursor: 'zoom-out',
        objectFit: 'cover' as const,
      };
    }

    if (phase === 'open') {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxW = vw * 0.8;
      const maxH = vh * 0.8;
      const aspect = rect.width / rect.height;
      let w: number, h: number;

      if (maxW / maxH > aspect) {
        h = maxH;
        w = h * aspect;
      } else {
        w = maxW;
        h = w / aspect;
      }

      return {
        position: 'fixed',
        top: (vh - h) / 2,
        left: (vw - w) / 2,
        width: w,
        height: h,
        borderRadius: '1rem',
        transition: 'all 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: 60,
        cursor: 'zoom-out',
        objectFit: 'contain' as const,
        boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
      };
    }

    if (phase === 'closing') {
      return {
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: '0.75rem',
        transition: 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: 60,
        cursor: 'zoom-in',
        objectFit: 'cover' as const,
        boxShadow: '0 0px 0px rgba(0,0,0,0)',
      };
    }

    return {};
  };

  const overlayOpacity = phase === 'open' ? 1 : 0;

  return (
    <>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`cursor-zoom-in transition-opacity duration-300 ${className}`}
        style={{ opacity: isOpen ? 0 : 1 }}
        onClick={open}
      />

      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 55,
              backgroundColor: `rgba(0, 0, 0, ${overlayOpacity * 0.7})`,
              backdropFilter: overlayOpacity > 0 ? 'blur(8px)' : 'none',
              WebkitBackdropFilter: overlayOpacity > 0 ? 'blur(8px)' : 'none',
              transition: phase === 'opening' ? 'none' : 'all 0.4s ease',
              cursor: 'zoom-out',
            }}
          />
          {/* Zoomed image */}
          <img
            src={src}
            alt={alt}
            style={getStyle()}
            onClick={close}
            onTransitionEnd={handleTransitionEnd}
          />
        </>,
        document.body
      )}
    </>
  );
}
