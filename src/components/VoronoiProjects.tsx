"use client";

import React, { useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import Link from 'next/link';

type Point = { x: number; y: number };
type Vec = { u: number; v: number };
type Box = { x: number; y: number; width: number; height: number };

interface Props {
  cells: ReactNode[];
}


const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

function midpointOf(p1: Point, p2: Point): Point {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

function boundingBox(puntos: Point[]) {
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

function lineIntersection(p1: Point, v1: Vec, p2: Point, v2: Vec): Point | null {
  const det = v1.u * v2.v - v1.v * v2.u;
  if (Math.abs(det) < 1e-6) return null;
  const t = ((p2.x - p1.x) * v2.v - (p2.y - p1.y) * v2.u) / det;
  return { x: p1.x + t * v1.u, y: p1.y + t * v1.v };
}

function centroidOf(puntos: Point[]): Point {
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

function generateVoronoiCells(seeds: Point[], width: number, height: number): Point[][] {
  const box = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }];
  return seeds.map((p, i) => {
    let poly = [...box];
    for (let j = 0; j < seeds.length; j++) {
      if (i === j) continue;
      const q = seeds[j];
      const mid = midpointOf(p, q);
      const normal = { u: p.x - q.x, v: p.y - q.y };
      const newPoly: Point[] = [];
      for (let k = 0; k < poly.length; k++) {
        const curr = poly[k];
        const prev = poly[(k + poly.length - 1) % poly.length];
        const isCurrInside = (curr.x - mid.x) * normal.u + (curr.y - mid.y) * normal.v >= 0;
        const isPrevInside = (prev.x - mid.x) * normal.u + (prev.y - mid.y) * normal.v >= 0;

        if (isCurrInside && isPrevInside) newPoly.push(curr);
        else if (isCurrInside && !isPrevInside) {
          const inter = lineIntersection(prev, { u: curr.x - prev.x, v: curr.y - prev.y }, mid, { u: -normal.v, v: normal.u });
          if (inter) newPoly.push(inter);
          newPoly.push(curr);
        } else if (!isCurrInside && isPrevInside) {
          const inter = lineIntersection(prev, { u: curr.x - prev.x, v: curr.y - prev.y }, mid, { u: -normal.v, v: normal.u });
          if (inter) newPoly.push(inter);
        }
      }
      poly = newPoly;
      if (poly.length < 3) break;
    }
    return poly;
  });
}

function shrinkPolygon(puntos: Point[], pixeles: number): Point[] {
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

function smoothPath(puntos: Point[], radio: number, offsetX: number = 0, offsetY: number = 0): string {
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

const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;
const UMBRAL_CONVERGENCIA = 0.8;
const MAX_ITERACIONES = 60;
const RELAJACION = 0.15;

// Secuencia de baja discrepancia (R2): mismo layout en cada carga.
const R2_X = 0.7548776662466927;
const R2_Y = 0.5698402909980532;

function deterministicSeeds(cantidad: number, width: number, height: number, isMobile: boolean): Point[] {
  return Array.from({ length: cantidad }, (_, i) => {
    if (isMobile) {
      return { x: width / 2, y: (height / cantidad) * (i + 0.5) };
    }
    const fx = ((i + 1) * R2_X) % 1;
    const fy = ((i + 1) * R2_Y) % 1;
    return { x: width * (0.12 + 0.76 * fx), y: height * (0.12 + 0.76 * fy) };
  });
}

function relaxSeeds(iniciales: Point[], width: number, height: number, iteraciones: number): Point[] {
  let seeds = iniciales;
  for (let it = 0; it < iteraciones; it++) {
    const centroids = generateVoronoiCells(seeds, width, height).map(centroidOf);
    let maxMove = 0;
    seeds = seeds.map((p, i) => {
      const nx = lerp(p.x, centroids[i].x, 0.5);
      const ny = lerp(p.y, centroids[i].y, 0.5);
      maxMove = Math.max(maxMove, Math.hypot(nx - p.x, ny - p.y));
      return { x: nx, y: ny };
    });
    if (maxMove < UMBRAL_CONVERGENCIA) break;
  }
  return seeds;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function VoronoiProjects({ cells }: Props) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const seedsRef = useRef<Point[]>([]);
  const convergedRef = useRef(false);
  const lastFrameRef = useRef(0);
  const iterationRef = useRef(0);
  const wasMobileRef = useRef<boolean | null>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boundsRef = useRef<Box[]>([]);
  const pathsRef = useRef<string[]>([]);

  const applyCardStyles = useCallback((i: number, node: HTMLDivElement | null) => {
    cardRefs.current[i] = node;
    if (!node) return;
    const box = boundsRef.current[i];
    const path = pathsRef.current[i];
    if (!box || !path) {
      node.style.width = '0px';
      node.style.height = '0px';
      return;
    }
    node.style.width = `${box.width}px`;
    node.style.height = `${box.height}px`;
    node.style.transform = `translate3d(${box.x}px, ${box.y}px, 0)`;
    node.style.clipPath = `path('${path}')`;
    node.style.setProperty('-webkit-clip-path', `path('${path}')`);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });

      const isMobile = clientWidth < 768;
      const changedLayout = wasMobileRef.current !== null && wasMobileRef.current !== isMobile;

      if (cells.length > 0 && (seedsRef.current.length === 0 || changedLayout)) {
        wasMobileRef.current = isMobile;
        seedsRef.current = deterministicSeeds(cells.length, clientWidth, clientHeight, isMobile);
      }

      // Al cambiar el tamaño hay que volver a relajar el diagrama
      convergedRef.current = false;
      lastFrameRef.current = 0;
      iterationRef.current = 0;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cells.length]);

  const animate = useCallback((time: number) => {
    if (time - lastFrameRef.current < FRAME_INTERVAL) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }
    lastFrameRef.current = time;

    const { width, height } = dimensions;
    const prev = seedsRef.current;
    if (width === 0 || prev.length === 0) return;

    const reduced = prefersReducedMotion();
    if (reduced && !convergedRef.current) {
      // Sin animación: resolvemos el layout de una sola vez.
      seedsRef.current = relaxSeeds(prev, width, height, 30);
    }

    const seeds = seedsRef.current;
    const polygons = generateVoronoiCells(seeds, width, height);
    const centroids = polygons.map(c => centroidOf(c));

    const bounds: Box[] = [];
    const paths: string[] = [];

    polygons.forEach((celda, i) => {
      const shrunkPoly = shrinkPolygon(celda, 10);

      const box = boundingBox(shrunkPoly);
      bounds.push(box);

      const cssPath = smoothPath(shrunkPoly, 30, box.x, box.y);
      paths.push(cssPath);
    });

    boundsRef.current = bounds;
    pathsRef.current = paths;
    bounds.forEach((_, i) => applyCardStyles(i, cardRefs.current[i]));

    if (reduced) {
      convergedRef.current = true;
      return;
    }

    let maxMove = 0;
    const nextSeeds = seeds.map((p, i) => {
      const nx = lerp(p.x, centroids[i].x, RELAJACION);
      const ny = lerp(p.y, centroids[i].y, RELAJACION);
      maxMove = Math.max(maxMove, Math.hypot(nx - p.x, ny - p.y));
      return { x: nx, y: ny };
    });
    seedsRef.current = nextSeeds;

    iterationRef.current += 1;

    // Detenemos la animación al converger o al alcanzar el tope de iteraciones
    if (maxMove < UMBRAL_CONVERGENCIA || iterationRef.current >= MAX_ITERACIONES) {
      convergedRef.current = true;
      return;
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [dimensions, applyCardStyles]);

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
    if (isVisible && dimensions.width > 0 && cells.length > 0 && !convergedRef.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(requestRef.current!);
    };
  }, [animate, dimensions, isVisible, cells.length]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-gray-50 font-outfit">

      {/* Pill link at top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 group">
        <Link
          href="/proyectos"
          data-interactive="true"
          className="inline-flex items-center gap-3 rounded-full px-8 py-4
                     bg-neutral-900 text-white text-base font-semibold tracking-widest uppercase
                     no-underline shadow-lg shadow-neutral-900/25 ring-1 ring-white/20
                     backdrop-blur-sm
                     transition-all duration-300 ease-out
                     hover:bg-neutral-800 hover:scale-105 hover:shadow-xl hover:shadow-neutral-900/40
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
        >
          Ver Todos los Proyectos
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {cells.map((cell, i) => (
          <div
            key={i}
            ref={(node) => applyCardStyles(i, node)}
            className="absolute pointer-events-auto"
            style={{ left: 0, top: 0 }}
          >
            {React.isValidElement(cell) ? (
              React.cloneElement(cell as React.ReactElement<{ style?: React.CSSProperties }>, {
                style: {
                  ...((cell.props as { style?: React.CSSProperties }).style || {}),
                  width: '100%',
                  height: '100%'
                }
              })
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cell}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
