'use client';

import Dither from '@/components/unused/Dither';
import BackButton from '@/components/BackButton';
import { FaGithub, FaTerminal, FaWrench } from 'react-icons/fa';
import Link from 'next/link';

export default function PaginaProyectoZegC() {
  const GITHUB_URL = "https://github.com/senchpimy/zegC";

  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full">
        <Dither />
      </div>

      <main 
        className=" flex w-full min-h-screen justify-center p-8 text-neutral-200 sm:p-16"
      >
        <div className="w-full max-w-4xl">

          <BackButton />

          <header className="mb-12 text-center">
            <h1 className="mb-2 bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
              zeg-C
            </h1>
            <p className="mb-4 text-2xl font-light text-neutral-300">
              Un Compilador de C escrito en Zig
            </p>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-neutral-400">
              Un proyecto experimental enfocado en el aprendizaje y la exploración de la construcción de compiladores, desde cero.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="rounded-full bg-orange-500 px-4 py-1 text-sm font-semibold text-black">
                Zig v0.12+
              </span>
              <span className="rounded-full bg-gray-400 px-4 py-1 text-sm font-semibold text-black">
                Lenguaje C
              </span>
              <span className="rounded-full bg-neutral-700 px-4 py-1 text-sm font-semibold text-neutral-200">
                🚧 En Desarrollo
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-x-16 md:grid-cols-3">
            <div className="md:col-span-2">
              <Section title="Características Principales">
                <ul className="list-inside list-disc space-y-2 text-neutral-300">
                  <li>REPL interactivo para pruebas rápidas de declaraciones y expresiones.</li>
                  <li>Análisis léxico para declaraciones de variables (`int x;`) y asignaciones simples (`x = 4;`).</li>
                  <li>Reconocimiento de tipos de datos primitivos como `int`, `char`, `float`.</li>
                  <li>Manejo de múltiples instrucciones en una sola línea, separadas por `;`.</li>
                  <li>Uso de `StringHashMap` y uniones en Zig para un almacenamiento de símbolos eficiente.</li>
                </ul>
              </Section>
              
              <Section title="Objetivo del Proyecto">
                <p>
                  El objetivo final de **zeg-C** es implementar un compilador C funcional y minimalista. El proceso abarca desde el análisis léxico y sintáctico hasta el análisis semántico y la generación de código, utilizando Zig por su control de bajo nivel y seguridad.
                </p>
              </Section>
            </div>

            <aside className="md:col-span-1">
              <Section title={<><FaGithub className="mr-2" /> Repositorio</>}>
                <a 
                  href={GITHUB_URL}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group inline-flex items-center rounded-lg bg-orange-500 px-6 py-3 font-semibold text-black transition-transform duration-200 hover:scale-105"
                >
                  <FaGithub className="mr-3 text-xl" />
                  Ver en GitHub
                </a>
              </Section>

              <Section title={<><FaTerminal className="mr-2" /> Cómo Probarlo</>}>
                <p className="mb-2">Necesitas Zig v0.12+:</p>
                <CodeBlock text="zig build run" />
                <p className="my-2">o directamente:</p>
                <CodeBlock text="zig run main.zig" />
                <div className="mt-4 rounded-lg border-l-4 border-orange-500 bg-orange-500/10 p-3 text-sm text-orange-300">
                  ⚠️ Solo funciona en sistemas tipo Unix (Linux, macOS) debido al uso de `/dev/tty`.
                </div>
              </Section>

              <Section title={<><FaWrench className="mr-2" /> Próximos Pasos</>}>
                <ul className="list-inside list-disc text-sm text-neutral-300">
                  <li>Implementar parser de expresiones.</li>
                  <li>Construir un AST.</li>
                  <li>Análisis semántico y de tipos.</li>
                  <li>Generación de código (LLVM o VM).</li>
                </ul>
              </Section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 flex items-center border-b-2 border-orange-500/50 pb-2 text-2xl font-semibold">
        {title}
      </h2>
      <div className="text-neutral-300/90 space-y-4">{children}</div>
    </section>
  );
}

function CodeBlock({ text }: { text: string }) {
  return (
    <div className="rounded-lg bg-neutral-900 p-4 font-mono text-sm text-neutral-300 ring-1 ring-neutral-700">
      <pre><code>{text}</code></pre>
    </div>
  );
}
