/**
 * Lógica portada del proyecto MotoAlert (github.com/senchpimy/CascoMoto).
 *
 * Fuentes reales:
 * - Parser y modelo:        app/lib/main.dart -> SensorData.fromEsp32String
 * - Formato del paquete:    readme.md  "<ESTADO>,<Aceleración_G>,<Roll>,<Pitch>,<Velocidad_km/h>,<GPS_fix>,<Latitud>,<Longitud>"
 * - Umbrales de detección:  readme.md  4.5 G, >15 km/h y 15 s para cancelar
 * - Historial de gráficas:  app/lib/main.dart -> _maxDataPoints = 50
 */

export type MotoAlertStatus = 'OK' | 'PRE-ALERTA' | 'CAIDA';

export interface SensorData {
  status: MotoAlertStatus;
  accelG: number;
  roll: number;
  pitch: number;
  speed: number;
  isGpsFixed: boolean;
  lat: number;
  lon: number;
  /** La línea tal cual sale del ESP32, para mostrarla sin retocar. */
  raw: string;
}

export const MOTOALERT = {
  impactG: 4.5,
  minSpeedKmh: 15,
  cancelWindowMs: 15_000,
  maxPoints: 50,
  sampleMs: 200,
} as const;

/** Puerto directo de SensorData.fromEsp32String (Dart). */
export function parseEsp32Packet(packet: string): SensorData | null {
  const values = packet.split(',');
  if (values.length !== 8) return null;

  const [status, accelG, roll, pitch, speed, fix, lat, lon] = values;
  const numbers = [accelG, roll, pitch, speed, lat, lon].map(Number);
  const fixNumber = Number.parseInt(fix, 10);
  if (numbers.some(Number.isNaN) || Number.isNaN(fixNumber)) return null;

  return {
    status: status as MotoAlertStatus,
    accelG: numbers[0],
    roll: numbers[1],
    pitch: numbers[2],
    speed: numbers[3],
    isGpsFixed: fixNumber === 1,
    lat: numbers[4],
    lon: numbers[5],
    raw: packet,
  };
}

/** Inverso del parser: arma el paquete con el formato documentado del firmware. */
export function formatEsp32Packet(
  data: Omit<SensorData, 'raw'>,
): string {
  return [
    data.status,
    data.accelG.toFixed(2),
    data.roll.toFixed(2),
    data.pitch.toFixed(2),
    data.speed.toFixed(2),
    data.isGpsFixed ? 1 : 0,
    data.lat.toFixed(6),
    data.lon.toFixed(6),
  ].join(',');
}

export interface FirmwareState {
  status: MotoAlertStatus;
  prealertAt: number | null;
  armed: boolean;
}

export const initialFirmwareState: FirmwareState = {
  status: 'OK',
  prealertAt: null,
  armed: true,
};

/**
 * Máquina de estados del firmware: impacto > 4.5 G con velocidad > 15 km/h
 * dispara PRE-ALERTA; si pasan 15 s sin cancelar se confirma la CAIDA.
 */
export function firmwareStep(
  state: FirmwareState,
  sample: { accelG: number; speed: number },
  now: number,
): FirmwareState {
  if (
    state.status === 'PRE-ALERTA' &&
    state.prealertAt !== null &&
    now - state.prealertAt >= MOTOALERT.cancelWindowMs
  ) {
    return { ...state, status: 'CAIDA' };
  }

  if (state.status !== 'OK') return state;

  if (state.armed && sample.accelG > MOTOALERT.impactG && sample.speed > MOTOALERT.minSpeedKmh) {
    return { status: 'PRE-ALERTA', prealertAt: now, armed: false };
  }

  return state;
}

export function cancelPrealert(state: FirmwareState): FirmwareState {
  return { status: 'OK', prealertAt: null, armed: false };
}

/* ------------------------------------------------------------------ */
/* Recorrido simulado: genera los valores que el ESP32 leería          */
/* ------------------------------------------------------------------ */

const IMPACT_AT = 6;
const IMPACT_LENGTH = 0.45;

/** Ruido determinista (misma secuencia en cada carga). */
function noise(seed: number): number {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function rideSample(time: number) {
  const progress = (time - IMPACT_AT) / IMPACT_LENGTH;
  const impact = progress >= 0 && progress < 1;
  const after = progress >= 1;

  const speed = after
    ? 0
    : impact
      ? Math.max(0, 46 * (1 - progress))
      : 46 + 4 * Math.sin(time * 0.7) + noise(time) * 1.5;

  const accelG = impact
    ? 1 + 7.5 * Math.sqrt(progress)
    : after
      ? 1 + noise(time + 3) * 0.18
      : 1 + (noise(time + 1) - 0.5) * 0.28;

  const roll = after ? 72 : impact ? 72 * progress : 9 * Math.sin(time * 0.9);
  const pitch = after ? -38 : impact ? -38 * progress : 6 * Math.cos(time * 0.6);

  return {
    accelG,
    roll,
    pitch,
    speed,
    isGpsFixed: true,
    lat: 19.4326 + time * 0.00004,
    lon: -99.1332 + time * 0.00006,
  };
}
