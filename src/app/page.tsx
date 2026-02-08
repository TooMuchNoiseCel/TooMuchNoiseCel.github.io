'use client';

import Header from '@/components/Header';
import IngSection from '@/components/IngSection';
import ProyectosSection from '@/components/ProyectosSection';
import VoroniCell from '@/components/VoronoiCell';
import Mascara from '@/components/VoronoiProyects';

export default function Home() {
  const listaElementos = [
    <VoroniCell
      imageSrc={"/images/Code2Flow.png"}
      linkUrl={"https://github.com"}
      linkText={"Ver Repositorio"}
      title={"Código Fuente"}
    />,
    <VoroniCell
      imageSrc={"/images/NasaApps.png"}
      linkUrl={"https://github.com"}
      linkText={"Ver Repositorio"}
      title={"Código Fuente"}
    />,

    <VoroniCell
      imageSrc={"/images/Senchpimy.png"}
      linkUrl={"https://github.com"}
      linkText={"Ver Repositorio"}
      title={"Código Fuente"}
    />
  ];

  return (
    <main>
      <Header />

      <ProyectosSection />
      {/*
        <IngSection /> 
      */}
      <Mascara elementos={listaElementos}></Mascara>
    </main>
  );
}
