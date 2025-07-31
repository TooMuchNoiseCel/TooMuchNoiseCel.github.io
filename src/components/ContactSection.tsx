'use client';

import React from 'react';
import { Element } from 'react-scroll';
import Input from '@/components/Input';
import FlowingMenu from './FlowingMenu';

const ContactSection = () => {
  const demoItems = [
    { link: 'https://github.com/senchpimy', text: 'Github', image: 'https://picsum.photos/600/400?random=1' },
    { link: '#', text: 'Linkdn', image: 'https://picsum.photos/600/400?random=2' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Formulario enviado (simulación). ¡Gracias por tu mensaje!');
  };

  return (
    <Element name="contact-section">
      <section
        className="min-h-screen flex flex-col items-center justify-between pt-16"
        style={{ backgroundColor: 'var(--color-ventana)', color: 'var(--foreground)' }}
      >
        <div className="w-full max-w-lg mx-auto px-8">
          <div className="text-center mb-10">
            <h2 className="font-playfair font-medium text-5xl md:text-6xl">
              Hablemos
            </h2>
            <p className="mt-3 text-lg" style={{ color: 'var(--muted-foreground)' }}>
              ¿Tienes una idea o un proyecto en mente? Me encantaría escucharlo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Tu Nombre" name="name" type="text" placeholder="John Doe" required />
            <Input label="Tu Email" name="email" type="email" placeholder="john.doe@example.com" required />
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Tu Mensaje
              </label>
              <textarea
                id="message" name="message" rows={5} required placeholder="Hola Leonardo, me gustaría discutir..."
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-accent transition-colors"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="pt-4">
            </div>
          </form>
        </div>

        <div className="w-full" style={{ height: '200px', position: 'relative' }}>
          <FlowingMenu items={demoItems} />
        </div>

      </section>
    </Element>
  );
};

export default ContactSection;
