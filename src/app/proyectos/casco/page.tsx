'use client';

import Dither from '@/components/unused/Dither';
import BackButton from '@/components/BackButton';
import { Pill, Section } from '../page';
import { 
  FaMicrochip, FaSatelliteDish, FaMobileAlt, FaBluetoothB, FaSms, FaExclamationTriangle, FaCode,
  FaGithub, FaFileCode, FaCertificate 
} from 'react-icons/fa';

export default function PaginaProyectoMotoAlert() {
  const REPO_URL_FIRMWARE = "https://github.com/senchpimy/CascoMoto";
  const REPO_URL_APP = "https://github.com/senchpimy/CascoMoto";

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full">
        <Dither />
      </div>

      <main className="flex w-full min-h-screen justify-center p-6 text-neutral-200 sm:p-12">
        <div className="w-full max-w-6xl">

          <BackButton />

          <header className="mb-12 text-center">
            <h1 className="mb-2 bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
              🏍️ MotoAlert
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-xl text-neutral-300">
              Sistema IoT de detección de caídas para motociclistas con alertas por BLE y SMS.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Pill className="bg-sky-500/80 text-sky-50">Licencia MIT</Pill>
              <Pill className="bg-emerald-500/80 text-emerald-50">Versión 1.0.0</Pill>
              <Pill className="bg-orange-500/80 text-orange-50">ESP32 (C++)</Pill>
              <Pill className="bg-cyan-500/80 text-cyan-50">Flutter (Dart)</Pill>
            </div>
          </header>

          <div className="mx-auto mb-16 max-w-4xl rounded-xl border border-purple-500/50 bg-purple-500/10 p-6 text-center shadow-lg">
            <h2 className="mb-2 flex items-center justify-center text-2xl font-semibold text-purple-300">
              <FaCertificate className="mr-3" />
              Base para Solicitud de Patente
            </h2>
            <p className="text-neutral-300">
              Este proyecto sirvió como desarrollo tecnológico y prueba de concepto para una solicitud de patente, demostrando su viabilidad e innovación en el campo de la seguridad para motociclistas.
            </p>
          </div>

          <div className="mb-16 rounded-xl bg-neutral-900/50 p-4 shadow-2xl ring-1 ring-white/10">
            <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-800">
              <span className="text-neutral-500">
                Idealmente, una imagen del dispositivo junto a una captura de la app
              </span>
            </div>
          </div>
          
          <Section title="¿Cómo Funciona el Sistema?" icon={<FaCode />} className="border-purple-500/30" iconClassName="text-purple-400">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FlowStep icon={<FaMicrochip />} title="1. Detección en el Casco">
                El MPU6050 detecta un impacto (+4.5G) y el GPS confirma movimiento (+15km/h). El ESP32 activa una PRE-ALERTA.
              </FlowStep>
              <FlowStep icon={<FaBluetoothB />} title="2. Comunicación Inmediata">
                El estado se transmite vía Bluetooth (BLE) a la app MotoAlert en tiempo real. El usuario tiene 15s para cancelar la alerta.
              </FlowStep>
              <FlowStep icon={<FaExclamationTriangle />} title="3. Alerta Confirmada">
                Si no se cancela, se confirma la CAÍDA. La app muestra una alerta visual y el módulo SIM800L envía un SMS de emergencia con la ubicación GPS.
              </FlowStep>
            </div>
          </Section>

          <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-2">
            
            <div>
              <Section title="El Dispositivo (Firmware ESP32)" icon={<FaMicrochip />} className="border-purple-500/30" iconClassName="text-purple-400">
                <div className="space-y-4">
                  <p>El cerebro del sistema. Un firmware en C++ para ESP32 que monitorea sensores y gestiona las alertas.</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <HardwareCard icon={<FaMicrochip />} name="ESP32" desc="MCU principal con WiFi y BLE." />
                    <HardwareCard icon={<FaSatelliteDish />} name="MPU6050 + GPS" desc="Detecta caídas y obtiene la ubicación." />
                    <HardwareCard icon={<FaSms />} name="SIM800L (Opcional)" desc="Envía SMS de emergencia." />
                    <HardwareCard icon={<FaBluetoothB />} name="Bluetooth LE" desc="Comunica estado y datos a la app." />
                  </div>
                  <h3 className="pt-4 text-lg font-semibold text-purple-300">Conexiones Principales (GPIO)</h3>
                  <PinoutTable />
                </div>
              </Section>
            </div>

            <div>
              <Section title="La Aplicación Móvil (Flutter)" icon={<FaMobileAlt />} className="border-purple-500/30" iconClassName="text-purple-400">
                <div className="space-y-4">
                  <p>Una app para Android/iOS que sirve como dashboard en tiempo real y centro de alertas para el conductor.</p>
                  <ul className="list-inside list-disc space-y-2">
                    <li>Conexión y reconexión automática por BLE.</li>
                    <li>Dashboard con estado, velocidad y orientación.</li>
                    <li>Gráficos en tiempo real para aceleración y velocidad.</li>
                    <li>Alerta visual y sonora en caso de caída confirmada.</li>
                    <li>Gestión de permisos de Bluetooth y ubicación.</li>
                  </ul>
                  <h3 className="pt-4 text-lg font-semibold text-purple-300">Tecnologías Utilizadas</h3>
                  <div className="flex flex-wrap gap-2">
                    <Pill className="bg-cyan-500/80 text-cyan-50">Flutter</Pill>
                    <Pill className="bg-sky-500/80 text-sky-50">flutter_blue_plus</Pill>
                    <Pill className="bg-emerald-500/80 text-emerald-50">fl_chart</Pill>
                    <Pill className="bg-violet-500/80 text-violet-50">shared_preferences</Pill>
                  </div>
                </div>
              </Section>
            </div>
          </div>

          <footer className="mt-12 text-center">
            <h2 className="mb-6 text-3xl font-bold">Explora el Código Fuente</h2>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <RepoButton href={REPO_URL_FIRMWARE} icon={<FaFileCode />}>Firmware (ESP32)</RepoButton>
              <RepoButton href={REPO_URL_APP} icon={<FaMobileAlt />}>Aplicación (Flutter)</RepoButton>
            </div>
          </footer>

        </div>
      </main>
    </>
  );
}

const FlowStep = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode; }) => (
  <div className="rounded-lg bg-neutral-800/50 p-4 ring-1 ring-neutral-700">
    <div className="mb-2 flex items-center text-xl font-bold text-purple-400">
      <span className="mr-3">{icon}</span>{title}
    </div>
    <p className="text-sm text-neutral-400">{children}</p>
  </div>
);

const HardwareCard = ({ icon, name, desc }: { icon: React.ReactNode; name: string; desc: string; }) => (
  <div className="flex items-center rounded-lg bg-neutral-800/50 p-3 ring-1 ring-neutral-700">
    <span className="mr-4 text-2xl text-purple-400">{icon}</span>
    <div>
      <h4 className="font-semibold text-neutral-200">{name}</h4>
      <p className="text-xs text-neutral-400">{desc}</p>
    </div>
  </div>
);

const PinoutTable = () => (
  <div className="overflow-hidden rounded-lg text-sm ring-1 ring-neutral-700">
    <div className="grid grid-cols-2 bg-neutral-800 p-2 font-semibold">
      <div>Módulo / Pin</div><div className="text-right">ESP32 GPIO</div>
    </div>
    <div className="grid grid-cols-2 border-t border-neutral-700 p-2">
      <div>MPU6050 SDA / SCL</div><div className="text-right font-mono">21 / 22</div>
    </div>
    <div className="grid grid-cols-2 border-t border-neutral-700 bg-neutral-800/50 p-2">
      <div>GPS TX / RX</div><div className="text-right font-mono">17 / 16</div>
    </div>
    <div className="grid grid-cols-2 border-t border-neutral-700 p-2">
      <div>SIM800L TX / RX</div><div className="text-right font-mono">3 / 2</div>
    </div>
  </div>
);

const RepoButton = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode; }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-3 rounded-lg bg-neutral-200 px-8 py-3 font-semibold text-black transition-transform duration-200 hover:scale-105 hover:bg-purple-400">
    <FaGithub className="text-xl" />
    <div className="flex items-center gap-2">
      {icon} <span>{children}</span>
    </div>
  </a>
);
