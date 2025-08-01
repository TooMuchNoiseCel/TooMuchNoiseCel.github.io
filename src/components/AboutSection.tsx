'use client';

import React, { Suspense } from 'react';
import { Element } from 'react-scroll';

//const TextRing = React.lazy(() => import('@/components/TextRing'));
import dynamic from 'next/dynamic';


const TextRing = dynamic(
  () => import('@/components/TextRing'),
  {
    // Importantísimo: Evita que se incluya en el renderizado del servidor.
    // Three.js y R3F necesitan el objeto `window` del navegador.
    ssr: false,
    
    // Muestra este componente mientras el componente TextRing se está cargando.
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <p className="text-black text-lg">Cargando animación 3D...</p>
        {/* Aquí podrías poner un spinner de Tailwind si quieres */}
      </div>
    ),
  }
);


const AboutSection = () => {
  return (

    <Element name="about-section">
      <section
        className="min-h-screen w-full flex flex-col md:flex-row items-center md:items-stretch justify-center p-8 md:p-16"
        style={{ backgroundColor: 'white', color: 'black' }}
      >
        <div className="w-full md:w-1/3 text-left flex flex-col justify-center pr-0 md:pr-12 mb-10 md:mb-0">
          <h2 className="font-playfair font-medium text-5xl md:text-6xl mb-6">
            Sobre Mí

          </h2>
          <div className='text-justify'>
            <p className="text-lg leading-relaxed mb-4">
              Me apasiona aprender nuevas tecnologías y enfrentar desafíos que me hagan crecer como desarrollador.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Mi objetivo es combinar un código limpio y eficiente con un diseño centrado en el usuario para entregar productos digitales de alta calidad.
            </p>

            <p className="text-lg leading-relaxed mb-4">
              A lo largo de mi formación he explorado diversos lenguajes de programación, desde los más usados en la industria hasta aquellos más académicos o de bajo nivel. Esta diversidad me ha permitido adaptarme rápidamente a nuevos entornos y paradigmas. En la animación de la derecha puedes ver algunos de los lenguajes que domino.
            </p>
          </div>
        </div>

        <div className="w-full md:w-2/3 h-[60vh] md:h-auto">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Cargando 3D...</div>}>
            <TextRing />
          </Suspense>
        </div>
      </section>
    </Element>
  );
};

export default AboutSection;
