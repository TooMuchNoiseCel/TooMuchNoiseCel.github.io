'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MAX_CHART_POINTS,
  SAMPLE_MS,
  applyGyro,
  dummyTelemetryLine,
  parseTelemetryLine,
  type Quat,
  type TelemetrySample,
} from '@/lib/telemetria';
import LiveChart from './LiveChart';
import RocketViewer from './RocketViewer';

const IDENTITY: Quat = [0, 0, 0, 1];

export default function TelemetrySimulation() {
  const [history, setHistory] = useState<TelemetrySample[]>([]);
  const [last, setLast] = useState<TelemetrySample | null>(null);
  const [line, setLine] = useState('');
  const [quaternion, setQuaternion] = useState<Quat>(IDENTITY);

  const quaternionRef = useRef<Quat>(IDENTITY);
  const counterRef = useRef(0);
  const lastTimestampRef = useRef(0);

  useEffect(() => {
    // Igual que el modo "Test Dummy Data" del dashboard real.
    const id = setInterval(() => {
      counterRef.current += 1;
      const raw = dummyTelemetryLine(counterRef.current);
      const parsed = parseTelemetryLine(raw);
      if (!parsed) return;

      const now = performance.now();
      const dt = lastTimestampRef.current ? (now - lastTimestampRef.current) / 1000 : SAMPLE_MS / 1000;
      lastTimestampRef.current = now;

      quaternionRef.current = applyGyro(
        quaternionRef.current,
        parsed.gx,
        parsed.gy,
        parsed.gz,
        dt,
      );

      setQuaternion(quaternionRef.current);
      setLine(raw);
      setLast(parsed);
      setHistory((prev) => [...prev.slice(-(MAX_CHART_POINTS - 1)), parsed]);
    }, SAMPLE_MS);

    return () => clearInterval(id);
  }, []);

  const series = (pick: (sample: TelemetrySample) => number) => history.map(pick);

  return (
    <section className="mb-[90px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Simulación
        </h2>
        <span className="rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 font-mono text-[10px] text-neutral-500">
          parser de Cominucacion/pagina/app.js
        </span>
      </div>

      <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-neutral-400">
        Se emiten las mismas líneas de 14 campos que el Pico manda por serial y se
        procesan con el parser y la integración de giroscopio del dashboard real, así
        que el cohete gira con los mismos datos que alimentan las gráficas.
      </p>

      <div className="grid gap-4 md:grid-cols-[1.03fr_1fr]">
        <div className="relative aspect-[4/3] min-h-[300px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#0c0c0f] md:aspect-auto">
          <RocketViewer quaternion={quaternion} />
          <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 font-mono text-[10px] text-neutral-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
            NRF24L01 · 5 Hz
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] text-neutral-600">
            arrastra para girar
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xs font-medium text-neutral-200">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                Vuelo en curso
              </span>
              <span className="font-mono text-[10px] text-neutral-500">
                #{last?.counter ?? 0} · {last?.sats ?? 0} sats
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {[
                ['Presión', last ? `${(last.presion / 1000).toFixed(1)}` : '—', 'kPa'],
                ['Temp. BMP', last ? last.tempBmp.toFixed(1) : '—', '°C'],
                ['Temp. DHT', last ? last.tempDht.toFixed(1) : '—', '°C'],
                ['Humedad', last ? last.hum.toFixed(0) : '—', '%'],
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
          </div>

          <LiveChart
            title="Temperatura (°C)"
            unit="°C"
            min={15}
            max={35}
            decimals={1}
            height={70}
            series={[
              { label: 'BMP', color: '#38bdf8', values: series((sample) => sample.tempBmp) },
              { label: 'DHT', color: '#2dd4bf', values: series((sample) => sample.tempDht) },
            ]}
          />

          <LiveChart
            title="Presión (Pa)"
            unit="Pa"
            min={100800}
            max={102600}
            decimals={0}
            height={70}
            series={[
              { label: 'pres_i', color: '#fb923c', values: series((sample) => sample.presion) },
            ]}
          />

          <LiveChart
            title="Humedad (%)"
            unit="%"
            min={0}
            max={100}
            decimals={0}
            height={70}
            series={[
              { label: 'hum_b', color: '#a78bfa', values: series((sample) => sample.hum) },
            ]}
          />

          <div className="truncate rounded-lg border border-neutral-800 bg-black/40 px-3 py-2 font-mono text-[10px] text-neutral-500">
            <span className="text-neutral-700">SERIAL ›</span> {line || '—'}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            quaternionRef.current = IDENTITY;
            setQuaternion(IDENTITY);
            lastTimestampRef.current = 0;
          }}
          className="rounded-full border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-neutral-900"
        >
          Reiniciar orientación
        </button>
        <span className="font-mono text-[10px] text-neutral-600">
          14 campos · ustruct &lt;h6hhihBffB · 32 bytes
        </span>
      </div>
    </section>
  );
}
