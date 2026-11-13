'use client';

import { useState } from 'react';

interface VoronoiCellProps {
  imageSrc: string;   // URL de la imagen o GIF
  linkUrl: string;    // A dónde lleva el enlace
  linkText: string;   // Texto del botón/enlace
  title?: string;     // Título opcional para la parte trasera
  altText?: string;
}

export default function VoronoiCell({
  imageSrc,
  linkUrl,
  linkText,
  title = "Ver más",
  altText = "Imagen de carta"
}: VoronoiCellProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group relative w-full h-full [perspective:1000px] cursor-pointer"
      data-interactive="true"
      onClick={() => setFlipped(value => !value)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]
                    group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]
                    shadow-xl rounded-xl ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden">
          <img
            src={imageSrc}
            alt={altText}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {/* Imagen nítida como fondo; el panel de vidrio la difumina. */}
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/45" />

          {/* Panel de "vidrio" con blur CSS. Antes usaba
              @hashintel/refractive (backdrop-filter con filtro SVG) y dejaba
              líneas rectas/halos al voltear la tarjeta en Chrome. */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white
                       bg-white/[0.04] backdrop-blur-[3px]"
          >
            <h3 className="text-2xl font-bold mb-4">{title}</h3>

            <p className="text-sm text-neutral-300 mb-6">
              Haz clic abajo para continuar
            </p>

            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="px-6 py-2 bg-black text-white font-semibold rounded-full border border-white/20
                         hover:bg-neutral-800 transition-colors duration-300 shadow-md transform hover:scale-105
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {linkText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
