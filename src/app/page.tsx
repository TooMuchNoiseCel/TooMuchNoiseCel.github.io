'use client';

import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import AboutSection from '@/components/AboutSection';
import IngSection from '@/components/IngSection';
import ProyectosSection from '@/components/ProyectosSection';

export default function Home() {
  return (
    <main>
      {/* Simplemente renderiza el Header */}
      <Header />

      <IngSection />
      <AboutSection />
      <ProyectosSection />
      <ContactSection />
    </main>
  );
}
