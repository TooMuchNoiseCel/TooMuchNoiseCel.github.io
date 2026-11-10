'use client';

import {
  ProjectShell,
  ProjectHeader,
  InfoCard,
  Section,
  CodeBlock,
  RepoLink,
} from '@/components/ProjectUi';

const GITHUB_URL = 'https://github.com/senchpimy/zegC';

export default function PaginaProyectoZegC() {
  return (
    <ProjectShell>
      <ProjectHeader
        kicker="Compilador"
        title="zeg-C"
        subtitle="Un compilador de C escrito desde cero en Zig, enfocado en entender cómo funciona un compilador por dentro."
        tags={['Zig 0.12+', 'Lenguaje C', 'En desarrollo']}
        accent="text-amber-400/80"
      />

      <InfoCard
        items={[
          { label: 'Estado', value: 'En desarrollo' },
          { label: 'Implementación', value: 'Zig' },
          { label: 'Enfoque', value: 'Aprendizaje y experimentación' },
        ]}
      />

      <Section title="Qué incluye">
        <ul className="list-disc space-y-2 pl-5 marker:text-neutral-700">
          <li>REPL interactivo para probar declaraciones y expresiones.</li>
          <li>Análisis léxico para declaraciones de variables y asignaciones simples.</li>
          <li>Reconocimiento de tipos primitivos como <code>int</code>, <code>char</code> y <code>float</code>.</li>
          <li>Manejo de varias instrucciones en una misma línea, separadas por <code>;</code>.</li>
          <li>Uso de <code>StringHashMap</code> y uniones en Zig para almacenar símbolos de forma eficiente.</li>
        </ul>
      </Section>

      <Section title="Objetivo">
        <p>
          Implementar un compilador C funcional y minimalista. El proceso abarca desde el
          análisis léxico y sintáctico hasta el análisis semántico y la generación de código,
          usando Zig por su control de bajo nivel y su seguridad.
        </p>
      </Section>

      <Section title="Cómo probarlo">
        <p>Necesitas Zig v0.12 o superior.</p>
        <CodeBlock>zig build run</CodeBlock>
        <p>O directamente:</p>
        <CodeBlock>zig run main.zig</CodeBlock>
        <p className="text-sm text-neutral-500">
          Solo funciona en sistemas tipo Unix (Linux, macOS) por el uso de <code>/dev/tty</code>.
        </p>
      </Section>

      <Section title="Próximos pasos">
        <ul className="list-disc space-y-2 pl-5 marker:text-neutral-700">
          <li>Implementar el parser de expresiones.</li>
          <li>Construir un AST.</li>
          <li>Análisis semántico y de tipos.</li>
          <li>Generación de código (LLVM o VM).</li>
        </ul>
      </Section>

      <div className="mt-28">
        <RepoLink href={GITHUB_URL} />
      </div>
    </ProjectShell>
  );
}
