'use client';

import dynamic from 'next/dynamic';
import {
  ProjectShell,
  ProjectHeader,
  InfoCard,
  Section,
  MiniCard,
  CodeBlock,
  RepoLink,
} from '@/components/ProjectUi';

// El visor 3D usa WebGL: solo cliente.
const TelemetrySimulation = dynamic(() => import('@/components/sim/TelemetrySimulation'), {
  ssr: false,
});

const GITHUB_URL = 'https://github.com/senchpimy/Telemetria';

const sensors = [
  ['MPU6050', 'Aceleración y giroscopía.'],
  ['ADXL345', 'Aceleración redundante de alta fidelidad.'],
  ['BMP180 / BMP280', 'Altitud y presión barométrica dual.'],
  ['DHT11', 'Temperatura y humedad.'],
  ['GPS', 'Latitud y longitud durante el vuelo.'],
  ['HMC5883L', 'Orientación magnética.'],
];

export default function PaginaProyectoTelemetria() {
  return (
    <ProjectShell>
      <ProjectHeader
        kicker="Hardware · Telemetría"
        title="Telemetría de cohete"
        subtitle="Adquisición y transmisión de datos en tiempo real para un cohete de alta potencia."
        tags={['MicroPython', 'Raspberry Pi Pico', 'NRF24L01']}
        accent="text-lime-400/80"
      />

      <InfoCard
        items={[
          { label: 'Contexto', value: 'Competencia nacional' },
          { label: 'Placa', value: 'Raspberry Pi Pico' },
          { label: 'Radio', value: 'NRF24L01' },
        ]}
      />

      <Section title="Arquitectura">
        <div className="grid gap-4 sm:grid-cols-3">
          <MiniCard title="1. Adquisición">
            El Pico lee más de ocho sensores al mismo tiempo: orientación, altitud,
            aceleración y condiciones ambientales.
          </MiniCard>
          <MiniCard title="2. Procesamiento">
            Los datos se empaquetan en un payload binario de 32 bytes con <code>ustruct</code>
            para una transmisión eficiente.
          </MiniCard>
          <MiniCard title="3. Transmisión">
            El payload se envía a la estación terrestre cada pocos milisegundos por el
            módulo NRF24L01.
          </MiniCard>
        </div>
      </Section>

      <Section title="Sensores">
        <p>
          Se integró un conjunto redundante de sensores para capturar datos precisos
          durante todas las fases del vuelo.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {sensors.map(([name, description]) => (
            <MiniCard key={name} title={name}>
              {description}
            </MiniCard>
          ))}
        </div>
      </Section>

      <Section title="Firmware y comunicación">
        <p>
          Desarrollado en MicroPython para prototipar rápido sin sacrificar un rendimiento
          sólido en el Raspberry Pi Pico.
        </p>
        <p>
          Para reducir la latencia y aprovechar el ancho de banda se diseñó un formato de
          payload binario específico:
        </p>
        <CodeBlock>{'PAYLOAD_FORMAT = "<h6hhihBffB"'}</CodeBlock>
        <p>
          Cada lectura pasa por funciones <code>safe_read</code>, de modo que si un sensor
          falla, el resto de la telemetría sigue funcionando.
        </p>
      </Section>

      <TelemetrySimulation />

      <div className="mt-28">
        <RepoLink href={GITHUB_URL}>Ver firmware en GitHub</RepoLink>
      </div>
    </ProjectShell>
  );
}
