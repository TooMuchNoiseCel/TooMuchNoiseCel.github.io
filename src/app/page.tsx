'use client';

import Header from '@/components/Header';
import IngSection from '@/components/IngSection';
import ProyectosSection from '@/components/ProyectosSection';

export default function Home() {
  return (
    <main>
      <Header />

      <ProyectosSection />
      <IngSection />
    </main>
  );
}
