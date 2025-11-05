'use client';

import Dither from '@/components/unused/Dither';
import BackButton from '@/components/BackButton';
import { FaTerminal, FaPaintBrush, FaTasks, FaShieldAlt } from 'react-icons/fa';

export default function PaginaProyectoMarmol() {
  const GITHUB_URL = "https://github.com/senchpimy/marmol";

  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full">
        <Dither />
      </div>

      <main className="flex w-full min-h-screen justify-center p-8 text-neutral-200 sm:p-16">
        <div className="w-full max-w-5xl"> {}

          <BackButton />

          <header className="mb-12 text-center">
            <h1 className="mb-2 bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
              Marmol
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-xl text-neutral-300">
              Una aplicación de escritorio en Rust para la gestión de notas y proyectos en "vaults" seguras.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Pill color="blue">Licencia MIT</Pill>
              <Pill color="green">Versión 0.1.0</Pill>
              <Pill color="orange">Rust 1.70+</Pill>
              <Pill color="purple">egui + eframe</Pill>
            </div>
          </header>

          <div className="mb-16 rounded-xl bg-neutral-900/50 p-4 shadow-2xl ring-1 ring-white/10">
            <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-800">
              <span className="text-neutral-500">Aquí va una captura o video de la aplicación</span>
            </div>
            {/* Ejemplo con <img>:
            <img 
              src="/images/marmol-screenshot.png" 
              alt="Captura de pantalla de la aplicación Marmol" 
              className="w-full rounded-lg"
            /> 
            */}
          </div>
          
          <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Section title="Características Principales" icon={<FaTasks />}>
                <ul className="grid list-inside list-disc grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  <li>Gestión de "vaults" (proyectos).</li>
                  <li>Soporte multi-archivo: Markdown, etc.</li>
                  <li>Interfaz moderna con paneles y pestañas.</li>
                  <li>Creación de archivos desde plantillas.</li>
                  <li>Configuración personalizable.</li>
                  <li>Sistema de guardado automático de estado.</li>
                  <li>Escrito 100% en Rust seguro.</li>
                  <li>Multiplataforma (Windows, macOS, Linux).</li>
                </ul>
              </Section>
              
              <Section title="Roadmap y Futuras Mejoras" icon={<FaPaintBrush />}>
                <p className="mb-4 text-neutral-400">
                  Marmol está en desarrollo activo. Las próximas funcionalidades planeadas incluyen:
                </p>
                <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2 md:grid-cols-3">
                  <TodoItem>Servidor de Backups</TodoItem>
                  <TodoItem>Canvas para dibujo</TodoItem>
                  <TodoItem>Temas y colores</TodoItem>
                  <TodoItem>Enlaces entre notas</TodoItem>
                  <TodoItem>Renombrar/eliminar archivos</TodoItem>
                  <TodoItem>Calendario integrado</TodoItem>
                  <TodoItem>Atajos de teclado</TodoItem>
                  <TodoItem>Búsqueda por metadata</TodoItem>
                  <TodoItem>Iconos en explorador</TodoItem>
                  <TodoItem>Búsqueda en archivos</TodoItem>
                  <TodoItem>Fuentes personalizadas</TodoItem>
                  <TodoItem>Copiar archivos entre vaults</TodoItem>
                </div>
              </Section>
            </div>

            <aside className="lg:col-span-1">
              <Section title="Uso" icon={<FaTerminal />}>
                <p className="mb-2">Compila y ejecuta la versión optimizada con:</p>
                <CodeBlock text="cargo run --release" />
              </Section>
              
              <Section title="Licencia" icon={<FaShieldAlt />}>
                <p>
                  Este proyecto está distribuido bajo la licencia MIT. Puedes ver los detalles completos en el repositorio.
                </p>
                <a 
                  href={`${GITHUB_URL}/blob/main/LICENSE`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-4 inline-block text-sky-400 transition-colors hover:text-sky-300"
                >
                  Ver archivo LICENSE &rarr;
                </a>
              </Section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}


function Pill({ children, color }: { children: React.ReactNode; color: 'blue' | 'green' | 'orange' | 'purple' }) {
  const colors = {
    blue:   'bg-sky-500/80 text-sky-50',
    green:  'bg-emerald-500/80 text-emerald-50',
    orange: 'bg-orange-500/80 text-orange-50',
    purple: 'bg-violet-500/80 text-violet-50',
  };
  return (
    <span className={`rounded-full px-4 py-1 text-sm font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 flex items-center border-b-2 border-sky-500/30 pb-2 text-2xl font-semibold">
        <span className="mr-3 text-sky-400">{icon}</span>
        {title}
      </h2>
      <div className="space-y-4 text-neutral-300/90">{children}</div>
    </section>
  );
}

function TodoItem({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center text-neutral-400">{children}</div>;
}

function CodeBlock({ text }: { text: string }) {
  return (
    <div className="rounded-lg bg-neutral-900 p-4 font-mono text-sm text-sky-300 ring-1 ring-neutral-700">
      <pre><code>$ {text}</code></pre>
    </div>
  );
}
