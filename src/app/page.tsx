'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import VoronoiCell from '@/components/VoronoiCell';
import PublicacionesSection from '@/components/PublicacionesSection';

// La rejilla Voronoi solo se dibuja en cliente (mide el contenedor real).
const VoronoiProjects = dynamic(() => import('@/components/VoronoiProjects'), {
  ssr: false,
});

// p5 usa window/canvas: solo cliente.
const RandomSquaresSketch = dynamic(
  () => import('@/components/RandomSquaresSketch'),
  { ssr: false }
);

export default function Home() {
  const projectCells = [
    <VoronoiCell
      key="1"
      imageSrc={"/images/Code2Flow.png"}
      linkUrl={"https://github.com/senchpimy/code2flowchart"}
      linkText={"Ver Repositorio"}
      title={"Code2Flowchart"}
      altText={"Captura de Code2Flowchart"}
    />,
    <VoronoiCell
      key="2"
      imageSrc={"/images/NasaApps.png"}
      linkUrl={"https://github.com/senchpimy/2025NasaSpaceAppsExplorer"}
      linkText={"Ver Repositorio"}
      title={"NASA Space Apps Explorer"}
      altText={"Captura de NASA Space Apps Explorer"}
    />,

    <VoronoiCell
      key="3"
      imageSrc={"/images/Senchpimy.png"}
      linkUrl={"https://github.com/senchpimy/senchpimy.github.io"}
      linkText={"Ver Repositorio"}
      title={"Portafolio Senchpimy"}
      altText={"Captura del portafolio de Senchpimy"}
    />
  ];

  return (
    <main>
      <Header />

      <div className="relative h-[700px] bg-black" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-b from-black to-[#09090b]" />
      </div>

      <section className="w-full bg-[#09090b] px-6 pb-[400px] font-outfit text-neutral-300 sm:px-8">
        <div className="mx-auto grid max-w-[1800px] items-center gap-24 md:grid-cols-2 lg:gap-32 xl:grid-cols-[1.41fr_1fr] xl:gap-[300px]">
          <div
            className="aspect-[4/3] min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl xl:ml-20"
            aria-hidden="true"
          >
            <RandomSquaresSketch className="h-full w-full" />
          </div>

          <div className="min-w-0 max-w-md">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
              Hola
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Soy Leonardo.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-neutral-400">
              Desarrollador de sistemas y hardware. Analista de datos, me gusta
              entender cómo funcionan las cosas por dentro y construir herramientas y proyectos
              interesantes y desafiantes
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-400">
              Estudié Ingeniería en Computación y Ciencia de Datos en la UNAM.
            </p>
          </div>
        </div>
      </section>

      <div className="relative h-[700px] bg-[#09090b]" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-b from-[#09090b] to-[#f9fafb]" />
      </div>

      <VoronoiProjects cells={projectCells} />

      <div className="relative h-[700px] bg-[#09090b]" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-[#f9fafb] to-[#09090b]" />
      </div>

      <PublicacionesSection />
    </main>
  );
}

