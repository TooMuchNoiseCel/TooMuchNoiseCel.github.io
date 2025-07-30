'use client';

import React, { Suspense, useMemo } from 'react';
import { Element } from 'react-scroll';
import { useInView } from 'react-intersection-observer';
import Dither from './Dither';
import ScrollReveal from './ScrollReveal';

const prepareTextForAnimation = (text: string) => {
  return text.split(/(\s+)/).map((segment, index) => {
    if (segment.match(/^\s+$/)) {
      return segment;
    }
    return (
      <span key={index} className="inline-block word">
        {segment}
      </span>
    );
  });
};

const IngenieriaSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: '200px 0px',
  });

  const text1 = useMemo(() => prepareTextForAnimation(
    "Soy un desarrollador de software apasionado con experiencia en la creación de experiencias web modernas e interactivas. Me especializo en el ecosistema de JavaScript, utilizando herramientas como React, Next.js y Node.js para construir aplicaciones rápidas, escalables y visualmente atractivas."
  ), []);

  const text2 = useMemo(() => prepareTextForAnimation(
    "Mi objetivo es combinar un código limpio y eficiente con un diseño centrado en el usuario para entregar productos digitales de alta calidad."
  ), []);

  return (
    <Element name="ingenieria-section">
      <section ref={ref} className="relative min-h-[120vh] w-full flex flex-col items-center justify-center p-8 text-white overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-full">
          <Suspense fallback={
            <div className="w-full h-full bg-black flex items-center justify-center">
              Cargando...
            </div>
          }>
            <Dither
              isVisible={inView}
              waveColor={[0.4, 0.4, 0.4]}
              disableAnimation={false}
              enableMouseInteraction={true}
              mouseRadius={0.2}
              colorNum={4}
              waveAmplitude={0.3}
              waveFrequency={3}
              waveSpeed={0.02}
            />
          </Suspense>
        </div>

        <div className="relative z-10 w-full max-w-4xl text-center md:text-left pointer-events-none">
          <h2 className="font-playfair font-medium text-5xl md:text-6xl mb-8">
            Ingeniería
          </h2>
          <ScrollReveal
            baseOpacity={0.1}
            enableBlur={true}
            blurStrength={4}
            baseRotation={3}
          >
            <p className="text-lg md:text-xl leading-relaxed mb-4 text-justify">
              {text1}
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-justify">
              {text2}
            </p>
          </ScrollReveal>
        </div>
      </section>
    </Element>
  );
};

export default IngenieriaSection;
