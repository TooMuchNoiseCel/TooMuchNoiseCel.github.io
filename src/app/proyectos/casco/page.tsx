'use client';

import {
  ProjectShell,
  ProjectHeader,
  InfoCard,
  Section,
  MiniCard,
  Pill,
  RepoLink,
} from '@/components/ProjectUi';

const REPO_URL = 'https://github.com/senchpimy/CascoMoto';

const pins = [
  ['MPU6050 SDA / SCL', '21 / 22'],
  ['GPS TX / RX', '17 / 16'],
  ['SIM800L TX / RX', '3 / 2'],
];

export default function PaginaProyectoMotoAlert() {
  return (
    <ProjectShell>
      <ProjectHeader
        kicker="IoT · Seguridad"
        title="MotoAlert"
        subtitle="Sistema de detección de caídas para motociclistas, con alertas por BLE y SMS."
        tags={['ESP32', 'Flutter', 'BLE', 'Licencia MIT']}
        accent="text-purple-400/80"
      />

      <InfoCard
        items={[
          { label: 'Estado', value: 'Prototipo / solicitud de patente' },
          { label: 'Hardware', value: 'ESP32' },
          { label: 'Aplicación', value: 'Flutter' },
        ]}
      />

      <Section title="Patente">
        <p>
          El proyecto sirvió como desarrollo tecnológico y prueba de concepto para una
          solicitud de patente, demostrando su viabilidad en el campo de la seguridad
          para motociclistas.
        </p>
      </Section>

      <Section title="Cómo funciona">
        <div className="grid gap-4 sm:grid-cols-3">
          <MiniCard title="1. Detección">
            El MPU6050 detecta un impacto superior a 4.5G y el GPS confirma movimiento
            por encima de 15 km/h. El ESP32 activa una pre-alerta.
          </MiniCard>
          <MiniCard title="2. Comunicación">
            El estado se transmite por BLE a la app en tiempo real. El usuario tiene
            15 segundos para cancelar la alerta.
          </MiniCard>
          <MiniCard title="3. Alerta confirmada">
            Si no se cancela, la app muestra una alerta visual y el módulo SIM800L envía
            un SMS de emergencia con la ubicación GPS.
          </MiniCard>
        </div>
      </Section>

      <Section title="Dispositivo">
        <div className="grid gap-4 sm:grid-cols-2">
          <MiniCard title="ESP32">MCU principal con WiFi y BLE.</MiniCard>
          <MiniCard title="MPU6050 + GPS">Detecta caídas y obtiene la ubicación.</MiniCard>
          <MiniCard title="SIM800L (opcional)">Envía el SMS de emergencia.</MiniCard>
          <MiniCard title="Bluetooth LE">Comunica estado y datos a la app.</MiniCard>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <div className="grid grid-cols-2 bg-[#0c0c0f] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            <span>Módulo / pin</span>
            <span className="text-right">ESP32 GPIO</span>
          </div>
          {pins.map(([module, gpio]) => (
            <div
              key={module}
              className="grid grid-cols-2 border-t border-neutral-800 px-4 py-2 text-sm text-neutral-400"
            >
              <span>{module}</span>
              <span className="text-right font-mono text-neutral-300">{gpio}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Aplicación">
        <ul className="list-disc space-y-2 pl-5 marker:text-neutral-700">
          <li>Conexión y reconexión automática por BLE.</li>
          <li>Dashboard con estado, velocidad y orientación.</li>
          <li>Gráficas en tiempo real de aceleración y velocidad.</li>
          <li>Alerta visual y sonora ante una caída confirmada.</li>
          <li>Gestión de permisos de Bluetooth y ubicación.</li>
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          <Pill>Flutter</Pill>
          <Pill>flutter_blue_plus</Pill>
          <Pill>fl_chart</Pill>
          <Pill>shared_preferences</Pill>
        </div>
      </Section>

      <div className="mt-28">
        <RepoLink href={REPO_URL} />
      </div>
    </ProjectShell>
  );
}
