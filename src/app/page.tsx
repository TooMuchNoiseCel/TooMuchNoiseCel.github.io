'use client';

import Button from '@/components/Button';
import IntroAnimation from '@/components/IntroAnimation';
import ContactSection from '@/components/ContactSection';
import AboutSection from '@/components/AboutSection';
import StrudelSection from '@/components/StrudelSection';

import { Link } from 'react-scroll';

export default function Home() {

  return (
    <>
      <main>
        <section className="min-h-screen flex items-center p-8 md:p-16 lg:p-24">
          <div className="w-full max-w-screen-lg">
            <IntroAnimation>
              <div className="flex flex-col items-start gap-8">
                <h1 className="font-playfair font-medium leading-none tracking-tight flex flex-col">
                  <span>Leonardo</span>
                  <span>Castañeda</span>
                </h1>

                <Link
                  to="contact-section"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={800}
                >
                  <Button
                    text="Contáctame"
                    type="button"
                  />
                </Link>
              </div>
            </IntroAnimation>
          </div>
        </section>

        <AboutSection />
        <StrudelSection />
        <ContactSection />
      </main>
    </>
  );
}
