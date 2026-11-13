'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MOTOALERT,
  cancelPrealert,
  firmwareStep,
  formatEsp32Packet,
  initialFirmwareState,
  parseEsp32Packet,
  rideSample,
  type FirmwareState,
  type MotoAlertStatus,
  type SensorData,
} from '@/lib/motoalert';
import LiveChart from './LiveChart';
import HelmetViewer from './HelmetViewer';

const STATUS_UI: Record<
  MotoAlertStatus,
  { label: string; dot: string; text: string; border: string; bg: string }
> = {
  OK: {
    label: 'Sin novedad',
    dot: 'bg-emerald-400',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    bg: 'bg-emerald-500/[0.07]',
  },
  'PRE-ALERTA': {
    label: 'Pre-alerta · impacto detectado',
    dot: 'bg-amber-400',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/[0.08]',
  },
  CAIDA: {
    label: 'Caída confirmada · SMS enviado',
    dot: 'bg-red-500',
    text: 'text-red-300',
    border: 'border-red-500/30',
    bg: 'bg-red-500/[0.08]',
  },
};

export default function HelmetSimulation() {
  const [runId, setRunId] = useState(0);
  const [last, setLast] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const [status, setStatus] = useState<MotoAlertStatus>('OK');
  const [countdown, setCountdown] = useState(0);
  const [packet, setPacket] = useState('');

  const firmwareRef = useRef<FirmwareState>(initialFirmwareState);
  const timeRef = useRef(0);

  useEffect(() => {
    firmwareRef.current = { ...initialFirmwareState };
    timeRef.current = 0;
    setHistory([]);
    setLast(null);
    setStatus('OK');
    setCountdown(0);

    const id = setInterval(() => {
      timeRef.current += MOTOALERT.sampleMs / 1000;
      const base = rideSample(timeRef.current);
      const now = performance.now();
      const next = firmwareStep(firmwareRef.current, base, now);
      firmwareRef.current = next;

      // El paquete que consume la UI es el mismo string que saldría por BLE.
      const line = formatEsp32Packet({ ...base, status: next.status });
      const parsed = parseEsp32Packet(line);
      if (!parsed) return;

      setPacket(line);
      setLast(parsed);
      setStatus(next.status);
      setHistory((prev) => [...prev.slice(-(MOTOALERT.maxPoints - 1)), parsed]);
      setCountdown(
        next.prealertAt
          ? Math.max(0, Math.ceil((MOTOALERT.cancelWindowMs - (now - next.prealertAt)) / 1000))
          : 0,
      );
    }, MOTOALERT.sampleMs);

    return () => clearInterval(id);
  }, [runId]);

  const ui = STATUS_UI[status];
  const cancelWindowSeconds = MOTOALERT.cancelWindowMs / 1000;
  const elapsedRatio =
    status === 'PRE-ALERTA' ? 1 - countdown / cancelWindowSeconds : 0;

  return (
    <section className="mb-[90px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Simulación
        </h2>
        <span className="rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 font-mono text-[10px] text-neutral-500">
          lógica de app/lib/main.dart
        </span>
      </div>

      <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-neutral-400">
        El panel genera el mismo paquete que el ESP32 envía por BLE y lo procesa con el
        parser de la app: impacto de más de 4.5 G con velocidad superior a 15 km/h,
        quince segundos para cancelar y, si no se cancela, caída confirmada y SMS.
      </p>

      <div className="grid gap-4 md:grid-cols-[1.03fr_1fr]">
        <div className="relative aspect-[4/3] min-h-[300px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#0c0c0f] md:aspect-auto">
          <HelmetViewer roll={last?.roll ?? 0} pitch={last?.pitch ?? 0} />
          <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 font-mono text-[10px] text-neutral-500">
            <span className={`h-1.5 w-1.5 rounded-full ${ui.dot}`} />
            MPU6050 · 5 Hz
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] text-neutral-600">
            arrastra para girar
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className={`rounded-xl border ${ui.border} ${ui.bg} p-3`}>
            <div className="flex items-center justify-between gap-2">
              <span className={`flex items-center gap-2 text-xs font-medium ${ui.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${ui.dot} ${status !== 'OK' ? 'animate-pulse' : ''}`} />
                {ui.label}
              </span>
              <span className="font-mono text-[10px] text-neutral-500">
                {status === 'PRE-ALERTA' ? `${countdown} s` : 'MotoAlert_ESP32'}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {[
                ['Acel.', last ? last.accelG.toFixed(2) : '—', 'G'],
                ['Vel.', last ? last.speed.toFixed(0) : '—', 'km/h'],
                ['Roll', last ? last.roll.toFixed(0) : '—', '°'],
                ['Pitch', last ? last.pitch.toFixed(0) : '—', '°'],
              ].map(([label, value, unit]) => (
                <div key={label}>
                  <div className="text-[9px] uppercase tracking-[0.12em] text-neutral-600">{label}</div>
                  <div className="mt-0.5 font-mono text-xs text-neutral-200">
                    {value}
                    <span className="ml-0.5 text-[9px] text-neutral-600">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {status === 'PRE-ALERTA' && (
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full rounded-full bg-amber-400 transition-[width] duration-200 ease-linear"
                  style={{ width: `${Math.min(100, elapsedRatio * 100)}%` }}
                />
              </div>
            )}
          </div>

          <LiveChart
            title="Aceleración (G)"
            unit="G"
            min={0}
            max={8}
            decimals={2}
            height={78}
            series={[
              { label: 'accelG', color: '#f87171', values: history.map((item) => item.accelG) },
            ]}
          />

          <LiveChart
            title="Velocidad (km/h)"
            unit="km/h"
            min={-5}
            max={120}
            decimals={0}
            height={78}
            series={[
              { label: 'speed', color: '#c084fc', values: history.map((item) => item.speed) },
            ]}
          />

          <div className="truncate rounded-lg border border-neutral-800 bg-black/40 px-3 py-2 font-mono text-[10px] text-neutral-500">
            <span className="text-neutral-700">BLE ›</span> {packet || '—'}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setRunId((value) => value + 1)}
          className="rounded-full border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-neutral-900"
        >
          Reiniciar recorrido
        </button>
        <button
          type="button"
          disabled={status !== 'PRE-ALERTA'}
          onClick={() => {
            firmwareRef.current = cancelPrealert(firmwareRef.current);
            setStatus('OK');
            setCountdown(0);
          }}
          className="rounded-full border border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Cancelar alerta
        </button>
        <span className="self-center font-mono text-[10px] text-neutral-600">
          &gt; 4.5 G · &gt; 15 km/h · 15 s
        </span>
      </div>

      <p className="mt-3 text-[10px] text-neutral-700">
        Modelo 3D: “Racing Bike Helmet” de CGTrader (licencia free, uso personal y comercial).
      </p>
    </section>
  );
}
