'use client';

import {
  ProjectShell,
  ProjectHeader,
  InfoCard,
  Section,
  RepoLink,
} from '@/components/ProjectUi';
import ZoomableImage from '@/components/ZoomableImage';

const GITHUB_URL = 'https://github.com/senchpimy/marmol';

const roadmap = [
  'Servidor de backups',
  'Canvas para dibujo',
  'Temas y colores',
  'Enlaces entre notas',
  'Renombrar y eliminar archivos',
  'Calendario integrado',
  'Atajos de teclado',
  'Búsqueda por metadata',
  'Iconos en el explorador',
  'Búsqueda dentro de archivos',
  'Fuentes personalizadas',
  'Copiar archivos entre vaults',
];

export default function PaginaProyectoMarmol() {
  return (
    <ProjectShell>
      <ProjectHeader
        kicker="Aplicación de escritorio"
        title="Marmol"
        subtitle="Una aplicación en Rust para gestionar notas y proyectos dentro de vaults seguras."
        tags={['Rust 1.70+', 'egui', 'Licencia MIT']}
        accent="text-sky-400/80"
      />

      <InfoCard
        items={[
          { label: 'Estado', value: 'En desarrollo' },
          { label: 'Stack', value: 'Rust + egui' },
          { label: 'Licencia', value: 'MIT' },
        ]}
      />

      <Section title="Capturas">
        <div className="grid gap-4 sm:grid-cols-2">
          <ZoomableImage
            src="/images/marmol1.png"
            alt="Captura de la aplicación Marmol"
            className="w-full rounded-xl border border-neutral-800"
          />
          <ZoomableImage
            src="/images/marmol2.png"
            alt="Captura de la aplicación Marmol con varias notas abiertas"
            className="w-full rounded-xl border border-neutral-800"
          />
        </div>
      </Section>

      <Section title="Características">
        <ul className="grid list-disc gap-x-8 gap-y-2 pl-5 marker:text-neutral-700 sm:grid-cols-2">
          <li>Gestión de vaults (proyectos).</li>
          <li>Soporte multi-archivo: Markdown y más.</li>
          <li>Interfaz con paneles y pestañas.</li>
          <li>Creación de archivos desde plantillas.</li>
          <li>Configuración personalizable.</li>
          <li>Guardado automático del estado.</li>
          <li>Escrito 100% en Rust seguro.</li>
          <li>Multiplataforma: Windows, macOS y Linux.</li>
        </ul>
      </Section>

      <Section title="Roadmap">
        <p>Marmol está en desarrollo activo. Estas son las siguientes funciones planeadas:</p>
        <ul className="grid list-disc gap-x-8 gap-y-2 pl-5 marker:text-neutral-700 sm:grid-cols-2">
          {roadmap.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Licencia">
        <p>
          El proyecto se distribuye bajo la licencia MIT. Puedes revisar el texto completo
          en el repositorio.
        </p>
        <a
          href={`${GITHUB_URL}/blob/main/LICENSE`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-neutral-300 underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-white"
        >
          Ver archivo LICENSE
        </a>
      </Section>

      <div className="mt-28">
        <RepoLink href={GITHUB_URL} />
      </div>
    </ProjectShell>
  );
}
