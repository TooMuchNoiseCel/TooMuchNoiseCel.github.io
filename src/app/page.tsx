'use client';

import Header from '@/components/Header';
import VoroniCell from '@/components/VoronoiCell';
import Mascara from '@/components/VoronoiProyects';
import PublicacionesSection from '@/components/PublicacionesSection';

export default function Home() {
  const listaElementos = [
    <VoroniCell
      key="1"
      imageSrc={"/images/Code2Flow.png"}
      linkUrl={"https://github.com"}
      linkText={"Ver Repositorio"}
      title={"Código Fuente"}
    />,
    <VoroniCell
      key="2"
      imageSrc={"/images/NasaApps.png"}
      linkUrl={"https://github.com"}
      linkText={"Ver Repositorio"}
      title={"Código Fuente"}
    />,

    <VoroniCell
      key="3"
      imageSrc={"/images/Senchpimy.png"}
      linkUrl={"https://github.com"}
      linkText={"Ver Repositorio"}
      title={"Código Fuente"}
    />
  ];

  return (
    <main>
      <Header />

      <Mascara elementos={listaElementos}></Mascara>

      <PublicacionesSection />
    </main>
  );
}

