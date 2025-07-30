// components/ProyectosSection.tsx
'use client';

import React from 'react';
import { Element } from 'react-scroll';
import PixelTransition from './PixelTransition';

const ProyectosSection = () => {
  return (
    <Element name="proyectos-section">
      <section
        className="min-h-[110vh] w-full flex flex-col md:flex-row items-center md:items-stretch p-8 md:p-16"
        style={{
          backgroundColor: '#ffffff',
          color: '#18181b',
        }}
      >

        <div className="hidden md:block md:w-1/2">

        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <PixelTransition
            firstContent={
              <h2 className="font-playfair text-5xl md:text-6xl text-[var(--primary-accent)]">
                PROYECTOS
              </h2>
            }
            secondContent={
              <div>
                <p className="text-lg leading-relaxed mb-4">
                  Cada proyecto es una oportunidad para resolver problemas reales a través del código y el diseño. Aquí presento una selección de trabajos donde he aplicado mi pasión por la tecnología para crear soluciones funcionales, intuitivas y estéticamente cuidadas.
                </p>
                {/* El color del texto muted ahora será un gris oscuro sobre blanco */}
                <p className="text-lg leading-relaxed text-[#71717a]">
                  Te invito a explorar cada caso. Detrás de cada interfaz hay horas de planificación, desarrollo y un compromiso firme con la calidad y la experiencia del usuario final.
                </p>
                <div className="mt-8">
                  <a
                    href="#detalle-proyectos"
                    className="px-6 py-3 border border-current text-current hover:bg-current hover:text-[#ffffff] transition-colors duration-300"
                  >
                    Ver mi trabajo
                  </a>
                </div>
              </div>
            }
            gridSize={12}
            pixelColor={'var(--primary-accent)'}
            animationStepDuration={0.4}
          />
        </div>
      </section>
    </Element>
  );
};

export default ProyectosSection;
