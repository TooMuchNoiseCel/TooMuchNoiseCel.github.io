'use client';

import {
  ProjectShell,
  ProjectHeader,
  InfoCard,
  Section,
  MiniCard,
  RepoLink,
} from '@/components/ProjectUi';

const GITHUB_URL = 'https://github.com/senchpimy/marmol';

const roadmap = [
  'Panel de backlinks y grafo local de la nota.',
  'Web clipper para capturar contenido desde el navegador.',
  'Calendario, repetición espaciada y presentaciones.',
  'Bookmarks, colores por carpeta y colores de tags.',
  'Pulir el build de Android y el consumo de memoria.',
];

export default function PaginaProyectoMarmol() {
  return (
    <ProjectShell>
      <ProjectHeader
        kicker="Aplicación de escritorio"
        title="Marmol"
        subtitle="Un espacio de trabajo local para notas, diagramas, tareas y proyectos, construido en Rust con egui."
        tags={['Rust 1.70+', 'egui 0.36', 'v0.1.6', 'Licencia MIT']}
        accent="text-sky-400/80"
      />

      <InfoCard
        items={[
          { label: 'Estado', value: 'Desarrollo activo' },
          { label: 'Stack', value: 'Rust · egui · eframe' },
          { label: 'Versión', value: '0.1.6' },
        ]}
      />

      <Section title="Editor y vaults">
        <ul className="list-disc space-y-2 pl-5 marker:text-neutral-700">
          <li>Editor Markdown con vista y edición, resaltado de sintaxis, imágenes, SVG/GIF y emojis.</li>
          <li>Pestañas y paneles acoplables, árbol de archivos y quick switcher.</li>
          <li>Wikilinks con autocompletado y enlaces internos clicables.</li>
          <li>Vaults con configuración propia, metadatos/frontmatter y autoguardado.</li>
          <li>Búsqueda dentro de archivos, incluso con expresiones regulares.</li>
          <li>Command palette para ejecutar acciones sin soltar el teclado.</li>
          <li>Iconos por archivo con paquetes de FontAwesome integrados.</li>
        </ul>
      </Section>

      <Section title="Diagramas y matemáticas">
        <div className="grid gap-4 sm:grid-cols-2">
          <MiniCard title="Mermaid">
            Diagramas de flujo, secuencia y más directamente desde bloques de código.
          </MiniCard>
          <MiniCard title="Vega / Vega-Lite">
            Gráficas declarativas renderizadas a SVG con un motor propio en Rust puro.
          </MiniCard>
          <MiniCard title="LaTeX nativo">
            Motor matemático portado de Tinta, con vista previa en vivo bajo el cursor.
          </MiniCard>
          <MiniCard title="TikZ">
            Dibujos y diagramas TikZ renderizados dentro de la nota.
          </MiniCard>
          <MiniCard title="Excalidraw">
            Lienzo de dibujo integrado, con edición, selección y exportación.
          </MiniCard>
          <MiniCard title="Sketch + IA">
            Dibuja a mano y convierte el trazo a LaTeX con un modelo de visión (requiere API key).
          </MiniCard>
        </div>
      </Section>

      <Section title="Organización">
        <ul className="list-disc space-y-2 pl-5 marker:text-neutral-700">
          <li>
            Grafo de notas estilo Obsidian: fuerzas, filtros por consulta
            (<code>file:</code>, <code>path:</code>, <code>tag:</code>, <code>content:</code>),
            grupos de color, tags, adjuntos, flechas y ajustes persistentes por vault.
          </li>
          <li>Canvas infinito con nodos de archivos, texto y grupos.</li>
          <li>Tableros Kanban con columnas, fechas y archivo de tareas.</li>
          <li>Tareas y registro de ingresos/gastos con gráficas y categorías.</li>
          <li>Notas diarias, plantillas y creación rápida de archivos.</li>
        </ul>
      </Section>

      <Section title="Plataformas y rendimiento">
        <ul className="list-disc space-y-2 pl-5 marker:text-neutral-700">
          <li>Desktop en Linux, Windows y macOS; build experimental para Android.</li>
          <li>Guardado automático del estado y la configuración al cerrar.</li>
          <li>Cachés acotadas, lecturas compartidas con <code>Arc&lt;str&gt;</code> y control de <code>mtime</code> para el árbol de archivos.</li>
          <li>Respaldos con <code>rsync</code> desde el módulo de servidor (experimental).</li>
        </ul>
      </Section>

      <Section title="Roadmap">
        <ul className="list-disc space-y-2 pl-5 marker:text-neutral-700">
          {roadmap.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Licencia">
        <p>
          El proyecto se distribuye bajo la licencia MIT. El código y las notas del
          proyecto están disponibles en el repositorio.
        </p>
      </Section>

      <div className="mt-28">
        <RepoLink href={GITHUB_URL} />
      </div>
    </ProjectShell>
  );
}
