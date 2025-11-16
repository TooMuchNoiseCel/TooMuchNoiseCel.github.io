'use client';

import Dither from '@/components/unused/Dither';
import BackButton from '@/components/BackButton';

import { Pill, Section } from '../page';
import { 
  FaRocket, FaSatellite, FaThermometerHalf, FaRulerCombined, FaMicrochip, FaBroadcastTower,
  FaGithub, FaCogs, FaProjectDiagram
} from 'react-icons/fa';

export default function PaginaProyectoTelemetria() {
  const GITHUB_URL = "https://github.com/senchpimy/Telemetria"

  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full">
        <Dither />
      </div>

      <main className="flex w-full min-h-screen justify-center p-6 text-neutral-200 sm:p-12">
        <div className="w-full max-w-6xl">

          <BackButton />

          <header className="mb-12 text-center">
            <h1 className="mb-2 bg-gradient-to-r from-lime-300 to-green-700 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
              Telemetría para Cohete de Competición
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-xl text-neutral-300">
              Un sistema embebido de adquisición y transmisión de datos en tiempo real para un cohete de alta potencia.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Pill className="bg-violet-500/80 text-violet-50">MicroPython</Pill>
              <Pill className="bg-red-500/80 text-red-50">Raspberry Pi Pico</Pill>
              <Pill className="bg-orange-500/80 text-orange-50">NRF24L01</Pill>
              <Pill className="bg-sky-500/80 text-sky-50">Sensor Fusion</Pill>
            </div>
          </header>
          
          <div className="mx-auto mb-16 max-w-4xl rounded-xl border border-lime-300/50 bg-lime-300/10 p-6 text-center shadow-lg">
            <h2 className="mb-2 flex items-center justify-center text-2xl font-semibold text-lime-300">
              <FaRocket className="mr-3" />
              Desplegado en Competición Nacional
            </h2>
            <p className="text-neutral-300">
              Este sistema fue diseñado, construido y volado como la carga útil de telemetría para el equipo [Nombre del Equipo] en la competencia [Nombre de la Competencia]. Mi rol fue [Tu Rol Específico, ej: desarrollador principal de firmware y encargado de la integración de sensores].
            </p>
          </div>

          <Section title="Arquitectura del Sistema" icon={<FaProjectDiagram />} className="border-lime-300/50" iconClassName="text-lime-300">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FlowStep icon={<FaCogs />} title="1. Adquisición de Datos">
                El Raspberry Pi Pico lee datos de más de 8 sensores simultáneamente, capturando la orientación, altitud, aceleración y condiciones ambientales del cohete.
              </FlowStep>
              <FlowStep icon={<FaMicrochip />} title="2. Procesamiento y Empaquetado">
                Los datos de los sensores se procesan y se empaquetan en un payload binario compacto de 32 bytes usando `ustruct` para una transmisión ultra eficiente.
              </FlowStep>
              <FlowStep icon={<FaBroadcastTower />} title="3. Transmisión Inalámbrica">
                El payload se transmite a la estación terrestre cada pocos milisegundos a través del módulo de radio NRF24L01, proporcionando datos de vuelo en tiempo real.
              </FlowStep>
            </div>
          </Section>

          {/* --- Detalles Técnicos --- */}
          <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-5">
            {/* Columna Principal */}
            <div className="lg:col-span-3">
              <Section title="Carga Útil de Sensores" icon={<FaRulerCombined />} className="border-lime-300/50" iconClassName="text-lime-300">
                <p className="mb-4">Se integró un conjunto redundante y diverso de sensores para garantizar la captura de datos precisa y fiable durante todas las fases del vuelo.</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SensorCard icon={<FaSatellite />} name="Orientación (IMU)" desc="MPU6050 para aceleración y giroscopía." />
                  <SensorCard icon={<FaSatellite />} name="Aceleración Redundante" desc="ADXL345 para datos de G de alta fidelidad." />
                  <SensorCard icon={<FaRocket />} name="Altitud y Presión" desc="BMP180 y BMP280 para mediciones barométricas duales." />
                  <SensorCard icon={<FaThermometerHalf />} name="Ambiente" desc="DHT11 para temperatura y humedad." />
                  <SensorCard icon={<FaSatellite />} name="Posición Global" desc="Módulo GPS para seguimiento de latitud/longitud." />
                  <SensorCard icon={<FaBroadcastTower />} name="Magnetómetro" desc="HMC5883L para orientación magnética." />
                </div>
              </Section>
            </div>

            {/* Columna Lateral */}
            <aside className="lg:col-span-2">
              <Section title="Firmware y Comunicación" icon={<FaMicrochip />} className="border-lime-300/50" iconClassName="text-lime-300">
                <p className="mb-4 font-semibold">Desarrollado en MicroPython para un prototipado rápido y un rendimiento robusto en el Raspberry Pi Pico.</p>
                <h4 className="mb-2 font-bold text-lime-300">Protocolo de Datos Personalizado</h4>
                <p className="mb-4">Para minimizar la latencia y maximizar el ancho de banda, se diseñó un formato de payload binario específico:</p>
                <CodeBlock text='PAYLOAD_FORMAT = "<h6hhihBffB"' />
                <h4 className="mt-6 mb-2 font-bold text-lime-300">Manejo de Errores</h4>
                <p>Se implementaron funciones `safe_read` para asegurar que un fallo en un sensor no detuviera la recolección de datos de los demás, garantizando la continuidad de la misión.</p>
              </Section>
            </aside>
          </div>
          
          {/* --- Repositorio --- */}
          <footer className="mt-12 text-center">
            <RepoButton href={GITHUB_URL} icon={<FaGithub />}>Ver Código del Firmware en GitHub</RepoButton>
          </footer>
        </div>
      </main>
    </>
  );
}

//const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode; }) => (
//  <section className="mb-12">
//    <h2 className="mb-6 flex items-center border-b-2 border-lime-300/50 pb-3 text-3xl font-semibold">
//      <span className="mr-4 text-lime-300">{icon}</span> {title}
//    </h2>
//    <div className="space-y-4 text-neutral-300/90">{children}</div>
//  </section>
//);



const FlowStep = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode; }) => (
  <div className="rounded-lg bg-neutral-800/50 p-4 text-center ring-1 ring-neutral-700">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lime-500/20 text-2xl text-lime-400">
      {icon}
    </div>
    <h3 className="mb-1 text-lg font-bold">{title}</h3>
    <p className="text-sm text-neutral-400">{children}</p>
  </div>
);

const SensorCard = ({ icon, name, desc }: { icon: React.ReactNode; name: string; desc: string; }) => (
  <div className="flex items-center rounded-lg bg-neutral-800/50 p-3 ring-1 ring-neutral-700">
    <span className="mr-4 text-2xl text-lime-400">{icon}</span>
    <div>
      <h4 className="font-semibold text-neutral-200">{name}</h4>
      <p className="text-xs text-neutral-400">{desc}</p>
    </div>
  </div>
);

const CodeBlock = ({ text }: { text: string }) => (
  <div className="rounded-lg bg-neutral-900 p-4 font-mono text-sm text-lime-300 ring-1 ring-neutral-700">
    <pre><code>{text}</code></pre>
  </div>
);

const RepoButton = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode; }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-3 rounded-lg bg-neutral-200 px-8 py-3 font-semibold text-black transition-transform duration-200 hover:scale-105 hover:bg-lime-400">
    {icon} <span>{children}</span>
  </a>
);
