"use client";

import React, { useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import { Stage, Layer, Path, Rect } from 'react-konva';
import Link from 'next/link';
import { refractive } from '@hashintel/refractive';

type Punto = { x: number; y: number };
type Vector = { u: number; v: number };

interface Props {
  elementos: ReactNode[];
}


const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

function calcularPuntoMedio(p1: Punto, p2: Punto): Punto {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

function obtenerCaja(puntos: Punto[]) {
  if (puntos.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  puntos.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function interseccionLineas(p1: Punto, v1: Vector, p2: Punto, v2: Vector): Punto | null {
  const det = v1.u * v2.v - v1.v * v2.u;
  if (Math.abs(det) < 1e-6) return null;
  const t = ((p2.x - p1.x) * v2.v - (p2.y - p1.y) * v2.u) / det;
  return { x: p1.x + t * v1.u, y: p1.y + t * v1.v };
}

function calcularCentroide(puntos: Punto[]): Punto {
  if (puntos.length === 0) return { x: 0, y: 0 };
  let area = 0, cx = 0, cy = 0;
  for (let i = 0; i < puntos.length; i++) {
    const p1 = puntos[i];
    const p2 = puntos[(i + 1) % puntos.length];
    const cross = (p1.x * p2.y - p2.x * p1.y);
    area += cross;
    cx += (p1.x + p2.x) * cross;
    cy += (p1.y + p2.y) * cross;
  }
  area /= 2;
  if (Math.abs(area) < 0.1) return puntos[0];
  return { x: cx / (6 * area), y: cy / (6 * area) };
}

function generarCeldasVoronoi(semillas: Punto[], width: number, height: number): Punto[][] {
  const box = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }];
  return semillas.map((p, i) => {
    let poly = [...box];
    for (let j = 0; j < semillas.length; j++) {
      if (i === j) continue;
      const q = semillas[j];
      const mid = calcularPuntoMedio(p, q);
      const normal = { u: p.x - q.x, v: p.y - q.y };
      const newPoly: Punto[] = [];
      for (let k = 0; k < poly.length; k++) {
        const curr = poly[k];
        const prev = poly[(k + poly.length - 1) % poly.length];
        const isCurrInside = (curr.x - mid.x) * normal.u + (curr.y - mid.y) * normal.v >= 0;
        const isPrevInside = (prev.x - mid.x) * normal.u + (prev.y - mid.y) * normal.v >= 0;

        if (isCurrInside && isPrevInside) newPoly.push(curr);
        else if (isCurrInside && !isPrevInside) {
          const inter = interseccionLineas(prev, { u: curr.x - prev.x, v: curr.y - prev.y }, mid, { u: -normal.v, v: normal.u });
          if (inter) newPoly.push(inter);
          newPoly.push(curr);
        } else if (!isCurrInside && isPrevInside) {
          const inter = interseccionLineas(prev, { u: curr.x - prev.x, v: curr.y - prev.y }, mid, { u: -normal.v, v: normal.u });
          if (inter) newPoly.push(inter);
        }
      }
      poly = newPoly;
      if (poly.length < 3) break;
    }
    return poly;
  });
}

function encogerPoligono(puntos: Punto[], pixeles: number): Punto[] {
  if (puntos.length === 0) return [];
  let cx = 0, cy = 0;
  puntos.forEach(p => { cx += p.x; cy += p.y; });
  cx /= puntos.length; cy /= puntos.length;
  return puntos.map(p => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= pixeles) return { x: cx, y: cy };
    const factor = (dist - pixeles) / dist;
    return { x: cx + dx * factor, y: cy + dy * factor };
  });
}

function generarPathSuave(puntos: Punto[], radio: number, offsetX: number = 0, offsetY: number = 0): string {
  if (puntos.length < 3) return "";
  let path = "";
  for (let i = 0; i < puntos.length; i++) {
    const curr = { x: puntos[i].x - offsetX, y: puntos[i].y - offsetY };
    const prevRaw = puntos[(i - 1 + puntos.length) % puntos.length];
    const nextRaw = puntos[(i + 1) % puntos.length];

    const prev = { x: prevRaw.x - offsetX, y: prevRaw.y - offsetY };
    const next = { x: nextRaw.x - offsetX, y: nextRaw.y - offsetY };

    const vPrev = { x: prev.x - curr.x, y: prev.y - curr.y };
    const vNext = { x: next.x - curr.x, y: next.y - curr.y };
    const lenPrev = Math.sqrt(vPrev.x ** 2 + vPrev.y ** 2);
    const lenNext = Math.sqrt(vNext.x ** 2 + vNext.y ** 2);
    const r = Math.min(radio, lenPrev / 2, lenNext / 2);

    const startX = curr.x + (vPrev.x / lenPrev) * r;
    const startY = curr.y + (vPrev.y / lenPrev) * r;
    const endX = curr.x + (vNext.x / lenNext) * r;
    const endY = curr.y + (vNext.y / lenNext) * r;

    if (i === 0) path += `M ${startX} ${startY} `; else path += `L ${startX} ${startY} `;
    path += `Q ${curr.x} ${curr.y}, ${endX} ${endY} `;
  }
  path += "Z";
  return path;
}

export default function Mascara({ elementos }: Props) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [semillas, setSemillas] = useState<Punto[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const [layout, setLayout] = useState<{
    polys: Punto[][],
    centroides: Punto[],
    bounds: { x: number, y: number, width: number, height: number }[],
    paths: string[]
  }>({
    polys: [], centroides: [], bounds: [], paths: []
  });

  const requestRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
        
        const isMobile = clientWidth < 768;
        if (semillas.length === 0 && elementos.length > 0) {
          if (isMobile) {
            // Vertical distribution for mobile
            setSemillas(elementos.map((_, i) => ({
              x: clientWidth / 2 + (Math.random() - 0.5) * 20,
              y: (clientHeight / elementos.length) * (i + 0.5)
            })));
          } else {
            setSemillas(elementos.map(() => ({
              x: Math.random() * clientWidth,
              y: Math.random() * clientHeight
            })));
          }
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [elementos.length]);

  const animate = useCallback(() => {
    setSemillas(prev => {
      const { width, height } = dimensions;
      if (width === 0 || prev.length === 0) return prev;

      const celdas = generarCeldasVoronoi(prev, width, height);
      const centroides = celdas.map(c => calcularCentroide(c));

      const bounds: any[] = [];
      const paths: string[] = [];
      const polysFinales: Punto[][] = [];

      celdas.forEach(celda => {
        const polyEncogido = encogerPoligono(celda, 10);
        polysFinales.push(polyEncogido);

        const box = obtenerCaja(polyEncogido);
        bounds.push(box);

        const cssPath = generarPathSuave(polyEncogido, 30, box.x, box.y);
        paths.push(cssPath);
      });

      setLayout({ polys: polysFinales, centroides: centroides, bounds, paths });

      return prev.map((p, i) => ({
        x: lerp(p.x, centroides[i].x, 0.05),
        y: lerp(p.y, centroides[i].y, 0.05)
      }));
    });
    requestRef.current = requestAnimationFrame(animate);
  }, [dimensions]);

  // Only start animation when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && dimensions.width > 0 && elementos.length > 0) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate, dimensions, elementos, isVisible]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-gray-50">

      {/* Pill link at top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 group">
        <refractive.div
          refraction={{ radius: 28, blur: 4, bezelWidth: 8 }}
          className="rounded-full transition-all duration-300 ease-out
                     group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          <Link
            href="/proyectos"
            className="inline-block px-10 py-4 text-lg font-semibold tracking-wider uppercase
                       bg-white/10 rounded-full
                       group-hover:bg-white/25 transition-all duration-300
                       no-underline text-neutral-800 group-hover:text-neutral-900
                       group-hover:tracking-[0.15em]"
          >
            Ver Todos los Proyectos →
          </Link>
        </refractive.div>
      </div>

      <Stage width={dimensions.width} height={dimensions.height} className="absolute inset-0 z-0 pointer-events-none">
        <Layer>
          <Rect width={dimensions.width} height={dimensions.height} fill="transparent" />
          {layout.polys.map((poly, i) => (
            <Path
              key={i}
              data={generarPathSuave(poly, 30)}
              fill="white"
              stroke="#e2e8f0"
              strokeWidth={3}
              shadowBlur={15}
              shadowColor="rgba(0,0,0,0.1)"
            />
          ))}
        </Layer>
      </Stage>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {elementos.map((elemento, i) => {
          const bound = layout.bounds[i] || { x: 0, y: 0, width: 0, height: 0 };
          const pathString = layout.paths[i] || "";

          return (
            <div
              key={i}
              className="absolute pointer-events-auto"
              style={{
                left: 0,
                top: 0,
                width: bound.width,
                height: bound.height,
                transform: `translate3d(${bound.x}px, ${bound.y}px, 0)`,
                clipPath: `path('${pathString}')`,
                WebkitClipPath: `path('${pathString}')`
              }}
            >
              {React.isValidElement(elemento) ? (
                React.cloneElement(elemento as React.ReactElement, {
                  style: {
                    ...((elemento.props as any)?.style || {}),
                    width: '100%',
                    height: '100%'
                  }
                })
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {elemento}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
