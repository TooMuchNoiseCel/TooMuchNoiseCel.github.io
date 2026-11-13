/**
 * Lógica portada del proyecto de telemetría (github.com/senchpimy/Telemetria).
 *
 * Fuentes reales:
 * - Parser del payload:   Cominucacion/pagina/app.js -> parseAndProcessData (14 campos)
 * - Datos de prueba:      Cominucacion/pagina/app.js -> startStreamingDummyData (mismos rangos)
 * - Orientación 3D:       Cominucacion/pagina/app.js -> updateCylinderRotation (cuaterniones)
 * - Puntos de gráfica:    Cominucacion/pagina/app.js -> MAX_CHART_POINTS = 50
 */

export const EXPECTED_PARTS = 14;
export const MAX_CHART_POINTS = 50;
export const SAMPLE_MS = 200;

export interface TelemetrySample {
  counter: number;
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
  tempBmp: number;
  presion: number;
  tempDht: number;
  hum: number;
  lat: number;
  lon: number;
  sats: number;
  raw: string;
}

/**
 * Puerto directo de parseAndProcessData (app.js).
 * Orden real: counter, ax, ay, az, gx, gy, gz, bmp_t, pres_i, dht_t, hum_b, lat, lon, sats_b
 */
export function parseTelemetryLine(line: string): TelemetrySample | null {
  const parts = line.split(',');
  if (parts.length !== EXPECTED_PARTS) return null;

  const data: TelemetrySample = {
    counter: Number.parseInt(parts[0], 10),
    ax: Number.parseFloat(parts[1]),
    ay: Number.parseFloat(parts[2]),
    az: Number.parseFloat(parts[3]),
    gx: Number.parseFloat(parts[4]),
    gy: Number.parseFloat(parts[5]),
    gz: Number.parseFloat(parts[6]),
    tempBmp: Number.parseFloat(parts[7]),
    presion: Number.parseFloat(parts[8]),
    tempDht: Number.parseFloat(parts[9]),
    hum: Number.parseFloat(parts[10]),
    lat: Number.parseFloat(parts[11]),
    lon: Number.parseFloat(parts[12]),
    sats: Number.parseInt(parts[13], 10),
    raw: line,
  };

  // La app real descarta la línea completa si algún valor no es numérico.
  const keys: (keyof TelemetrySample)[] = [
    'counter', 'ax', 'ay', 'az', 'gx', 'gy', 'gz',
    'tempBmp', 'presion', 'tempDht', 'hum', 'lat', 'lon', 'sats',
  ];
  if (keys.some((key) => Number.isNaN(data[key] as number))) return null;

  return data;
}

/** Puerto de startStreamingDummyData (app.js), con los mismos rangos. */
export function dummyTelemetryLine(counter: number): string {
  const ax = (Math.random() * 2 - 1).toFixed(2);
  const ay = (Math.random() * 2 - 1).toFixed(2);
  const az = (Math.random() * 2 - 1).toFixed(2);
  const gx = (Math.random() * 10 - 5).toFixed(2);
  const gy = (Math.random() * 10 - 5).toFixed(2);
  const gz = (Math.random() * 10 - 5).toFixed(2);
  const bmpT = (20 + Math.random() * 10).toFixed(2);
  const presI = (101325 + Math.random() * 1000).toFixed(2);
  const dhtT = (22 + Math.random() * 5).toFixed(2);
  const humB = (40 + Math.random() * 20).toFixed(2);
  const lat = (19.4326 + (Math.random() - 0.5) * 0.01).toFixed(6);
  const lon = (-99.1332 + (Math.random() - 0.5) * 0.01).toFixed(6);
  const satsB = Math.floor(Math.random() * 12);

  return [counter, ax, ay, az, gx, gy, gz, bmpT, presI, dhtT, humB, lat, lon, satsB].join(',');
}

/* ------------------------------------------------------------------ */
/* Cuaterniones: puerto de updateCylinderRotation (app.js)             */
/* ------------------------------------------------------------------ */

export type Quat = [number, number, number, number];

const DEG = Math.PI / 180;

function multiplyQuats(a: Quat, b: Quat): Quat {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

function axisAngleQuat(x: number, y: number, z: number, angle: number): Quat {
  const half = angle / 2;
  const s = Math.sin(half);
  return [x * s, y * s, z * s, Math.cos(half)];
}

function normalizeQuat([x, y, z, w]: Quat): Quat {
  const length = Math.hypot(x, y, z, w) || 1;
  return [x / length, y / length, z / length, w / length];
}

/**
 * Integra la velocidad angular del giroscopio (grados/s) durante dt segundos.
 * Mismo mapeo de ejes y mismo orden de composición que la app real:
 *   X modelo <- Gy, Y modelo <- Gx, Z modelo <- Gz ; delta = Z * X * Y
 */
export function applyGyro(q: Quat, gx: number, gy: number, gz: number, dt: number): Quat {
  const deltaX = axisAngleQuat(1, 0, 0, gy * DEG * dt);
  const deltaY = axisAngleQuat(0, 1, 0, gx * DEG * dt);
  const deltaZ = axisAngleQuat(0, 0, 1, gz * DEG * dt);

  let delta: Quat = multiplyQuats(deltaZ, deltaX);
  delta = multiplyQuats(delta, deltaY);

  return normalizeQuat(multiplyQuats(delta, q));
}
