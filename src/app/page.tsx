'use client';

import IntroAnimation from '@/components/IntroAnimation';
import ContactSection from '@/components/ContactSection';
import AboutSection from '@/components/AboutSection';
import IngSection from '@/components/IngSection';
import ProyectosSection from '@/components/ProyectosSection';


export default function Home() {
  return (
    <main>
      <section className="min-h-[120vh] flex items-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-screen-lg">
          <IntroAnimation>
            <div className="flex flex-col items-start gap-8">
              <h1 className="font-playfair font-playfair-title font-medium leading-none tracking-tight flex flex-col">
                <span>Leonardo</span>
                <span>Castañeda</span>
              </h1>
            </div>
          </IntroAnimation>
        </div>
      </section>

      <IngSection />
      <AboutSection />
      <ProyectosSection />
      <ContactSection />

    </main>
  );
}
