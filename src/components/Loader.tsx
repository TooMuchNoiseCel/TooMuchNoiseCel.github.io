'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoaderProps {
  onLoaderFinished: () => void;
}

const Loader = ({ onLoaderFinished }: LoaderProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onLoaderFinished,
    });

    tl.to(loaderRef.current, {
      autoAlpha: 0,
      pointerEvents: 'none',
      delay: 1.2,
      duration: 0.8,
    });
  }, [onLoaderFinished]);

  return (
    // Contenedor principal del loader
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white"
    >
      {/* 
        Efecto de viñeta circular usando un pseudo-elemento.
        Tailwind no puede generar pseudo-elementos ::after con contenido complejo,
        así que crearemos un div separado para ello. Es más explícito y fácil de manejar.
      */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          background: 'radial-gradient(circle at center, transparent 32%, black 32.25%)',
        }}
      />

      {/* 
        Texto con las iniciales.
        - Usamos la fuente 'Playfair Display' que ya tienes configurada en tu `globals.css`
          o `tailwind.config.js` (si no, asegúrate de que esté disponible).
        - El tamaño del texto es responsivo usando clamp() en la clase text-[] (JIT mode).
        - El resto son utilidades estándar de Tailwind.
      */}
      <div
        className="font-playfair font-medium leading-none
                   text-[clamp(8rem,25vw,15rem)]"
      >
        LC
      </div>
    </div>
  );
};

export default Loader;
