'use client';

import React, { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { prepareWithSegments, layoutNextLine, type LayoutCursor, type PreparedTextWithSegments } from '@chenglou/pretext';

const TextRing = dynamic(() => import('./TextRing'), { ssr: false });

// ── Constants ────────────────────────────────────────────────────────────────
const ARTICLE_TEXT = `La medición de texto ha sido uno de los problemas más subestimados del desarrollo web. Durante años, los navegadores obligaron a los desarrolladores a leer el DOM para saber cuánto espacio ocuparía un párrafo, provocando reflujos de layout costosísimos. Pretext resuelve esto con aritmética pura sobre anchos precalculados mediante canvas.

La librería segmenta el texto con Intl.Segmenter, mide cada palabra una sola vez y almacena los anchos en caché. Después, cada vez que el contenedor cambia de tamaño o el texto debe recolocarse alrededor de un obstáculo flotante, un recorrido aritmético reconstruye todas las líneas en menos de un milisegundo.

Este demo aprovecha layoutNextLine(), la función que permite variar el ancho máximo línea a línea. El modelo 3D que flota en pantalla actúa como zona de exclusión: las líneas que quedan a su altura son más estrechas, creando el efecto visual de que el texto rodea al objeto de forma orgánica, sin ninguna lectura del DOM en el hot path.

La precisión del layout admite textos multilingüe, emojis, escritura bidireccional, CJK y reglas tipográficas de kinsoku. Cada segmento se mide exactamente igual que lo haría el navegador, pero sin forzar un reflow. El rendimiento es constante independientemente del número de bloques de texto en pantalla.

Los casos de uso más prometedores son la virtualización sin heurísticas, la prevención del layout shift al cargar contenido dinámico, la verificación en tiempo de compilación de etiquetas que no deben desbordarse y la construcción de layouts editoriales avanzados como masonry, columnas de ancho variable o texto que fluye alrededor de imágenes flotantes.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin nisl. Integer nisl risus, sagittis convallis, rutrum id, elementum congue, nibh. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi neque rutrum erat, eu congue orci lorem eget lorem. Vestibulum non ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

Fusce sodales feugiat leo. Etiam dictum tincidunt diam. Phasellus iaculis congue nulla. Ut quis metus. Mauris at eros. Curabitur viverra. Donec dictum lectus non odio. Aliquam tincidunt nisi. Praesent vestibulum ac nisl. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, ut hendrerit urna magna id urna.

El futuro de la tipografía web no reside en esperar a que el navegador decida cómo romper una línea, sino en tomar el control total de la geometría textual. Con Pretext, podemos imaginar interfaces que respiran, que se adaptan a formas complejas y que mantienen una fluidez de 60 cuadros por segundo sin importar la densidad del contenido. Es la democratización del diseño editorial de alta gama aplicado al lienzo infinito del navegador.`;

const LINE_HEIGHT = 26;
const MARGIN_TOP = 40;
const MIN_COL = 40;
const STATS_INTERVAL = 400;
const FONT_MOBILE = '14px "Palatino Linotype", "Book Antiqua", Palatino, serif';
const FONT_DESKTOP = '17px "Palatino Linotype", "Book Antiqua", Palatino, serif';

interface DemoConfig {
    orbW: number;
    orbH: number;
    marginX: number;
    font: string;
    gap: number;
}

const DESKTOP_CONFIG: DemoConfig = {
    orbW: 340,
    orbH: 360,
    marginX: 48,
    font: FONT_DESKTOP,
    gap: 6,
};

const MOBILE_CONFIG: DemoConfig = {
    orbW: 220,
    orbH: 230,
    marginX: 20,
    font: FONT_MOBILE,
    gap: 4,
};

interface RenderedLine {
    text: string;
    x: number;
    y: number;
    width: number;
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function PretextDemo() {
    const containerRef = useRef<HTMLElement | null>(null);
    const linesRef = useRef<HTMLDivElement | null>(null);
    const orbRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef(0);

    // Hot-path state lives in refs so mouse movement never triggers a render.
    const preparedRef = useRef<PreparedTextWithSegments | null>(null);
    const configRef = useRef<DemoConfig>(DESKTOP_CONFIG);
    const orbPosRef = useRef({ x: 0, y: 0 });
    const hasOrbPosRef = useRef(false);
    const containerBoxRef = useRef({ left: 0, top: 0, width: 0 });
    const dirtyRef = useRef(true);
    const lineElsRef = useRef<HTMLSpanElement[]>([]);
    const fpsRef = useRef({ last: 0, frames: 0 });

    const [stats, setStats] = useState({ lines: 0, reflow: 0, fps: 60 });
    const [isMobile, setIsMobile] = useState(false);

    const applyOrbTransform = useCallback(() => {
        const orb = orbRef.current;
        if (!orb) return;
        const { x, y } = orbPosRef.current;
        orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, []);

    // ── Measure environment (mount + resize) ─────────────────────────────────
    const measure = useCallback(() => {
        if (typeof window === 'undefined') return;
        const container = containerRef.current;
        if (!container) return;

        const mobile = window.innerWidth < 768;
        const cfg = mobile ? MOBILE_CONFIG : DESKTOP_CONFIG;
        configRef.current = cfg;
        setIsMobile(mobile);

        const rect = container.getBoundingClientRect();
        containerBoxRef.current = { left: rect.left, top: rect.top, width: rect.width };
        preparedRef.current = prepareWithSegments(ARTICLE_TEXT, cfg.font);

        const orb = orbRef.current;
        if (orb) {
            orb.style.width = `${cfg.orbW}px`;
            orb.style.height = `${cfg.orbH}px`;
        }

        if (!hasOrbPosRef.current) {
            hasOrbPosRef.current = true;
            orbPosRef.current = {
                x: Math.max(0, rect.width - cfg.orbW - (mobile ? 20 : 60)),
                y: 80,
            };
        } else {
            // Keep the orb inside the section after a resize.
            const maxX = Math.max(0, rect.width - cfg.orbW);
            orbPosRef.current.x = Math.min(Math.max(0, orbPosRef.current.x), maxX);
        }
        applyOrbTransform();
        dirtyRef.current = true;
    }, [applyOrbTransform]);

    // ── Reflow ────────────────────────────────────────────────────────────────
    const reflow = useCallback(() => {
        const layer = linesRef.current;
        const prepared = preparedRef.current;
        const cfg = configRef.current;
        const width = containerBoxRef.current.width;
        if (!layer || !prepared || width <= 0) return;

        const maxW = width - cfg.marginX * 2;
        if (maxW <= 0) return;

        const t0 = performance.now();

        // Orb bounds in text-container local coords (text starts at marginX).
        const orbCenterX = orbPosRef.current.x - cfg.marginX + cfg.orbW / 2;
        const orbCenterY = orbPosRef.current.y - MARGIN_TOP + cfg.orbH / 2;
        const orbRadiusX = cfg.orbW / 2;
        const orbRadiusY = cfg.orbH / 2;
        const orbTop = orbCenterY - orbRadiusY;
        const orbBottom = orbCenterY + orbRadiusY;

        const renderedLines: RenderedLine[] = [];
        let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
        let y = 0;

        while (true) {
            const lineMid = y + LINE_HEIGHT / 2;
            const overlaps = lineMid > orbTop && lineMid < orbBottom;

            if (!overlaps) {
                const line = layoutNextLine(prepared, cursor, maxW);
                if (!line) break;
                renderedLines.push({ text: line.text, x: 0, y, width: line.width });
                cursor = line.end;
            } else {
                const dy = lineMid - orbCenterY;
                const normDy = dy / orbRadiusY;
                const halfW = orbRadiusX * Math.sqrt(Math.max(0, 1 - normDy * normDy));

                const orbLeftRow = orbCenterX - halfW;
                const orbRightRow = orbCenterX + halfW;

                const leftW = Math.max(orbLeftRow - cfg.gap, 0);
                const rightW = Math.max(maxW - orbRightRow - cfg.gap, 0);
                const rightX = Math.min(orbRightRow + cfg.gap, maxW);

                const hasLeft = leftW >= MIN_COL;
                const hasRight = rightW >= MIN_COL;

                if (hasLeft && hasRight) {
                    const leftLine = layoutNextLine(prepared, cursor, leftW);
                    if (!leftLine) break;
                    const leftLineX = Math.max(0, leftW - leftLine.width);
                    renderedLines.push({ text: leftLine.text, x: leftLineX, y, width: leftLine.width });
                    cursor = leftLine.end;

                    const rightLine = layoutNextLine(prepared, cursor, rightW);
                    if (rightLine) {
                        renderedLines.push({ text: rightLine.text, x: rightX, y, width: rightLine.width });
                        cursor = rightLine.end;
                    }
                } else if (hasLeft) {
                    const line = layoutNextLine(prepared, cursor, leftW);
                    if (!line) break;
                    const lineX = Math.max(0, leftW - line.width);
                    renderedLines.push({ text: line.text, x: lineX, y, width: line.width });
                    cursor = line.end;
                } else if (hasRight) {
                    const line = layoutNextLine(prepared, cursor, rightW);
                    if (!line) break;
                    renderedLines.push({ text: line.text, x: rightX, y, width: line.width });
                    cursor = line.end;
                }
            }

            y += LINE_HEIGHT;
            if (renderedLines.length > 1200) break;
        }

        const elapsedReflow = performance.now() - t0;

        // Reuse a pool of spans instead of rebuilding innerHTML every frame.
        const pool = lineElsRef.current;
        while (pool.length < renderedLines.length) {
            const span = document.createElement('span');
            span.className = 'pretext-line';
            span.setAttribute('aria-hidden', 'true');
            layer.appendChild(span);
            pool.push(span);
        }

        for (let i = 0; i < renderedLines.length; i++) {
            const el = pool[i];
            const line = renderedLines[i];
            if (el.style.display === 'none') el.style.display = '';
            if (el.textContent !== line.text) el.textContent = line.text;
            el.style.top = `${line.y + MARGIN_TOP}px`;
            el.style.left = `${line.x + cfg.marginX}px`;
            el.style.font = cfg.font;
        }
        for (let i = renderedLines.length; i < pool.length; i++) {
            if (pool[i].style.display !== 'none') pool[i].style.display = 'none';
        }

        // Stats update is throttled; React never re-renders per frame.
        const now = performance.now();
        const fps = fpsRef.current;
        if (fps.last === 0) fps.last = now;
        fps.frames += 1;
        if (now - fps.last >= STATS_INTERVAL) {
            const measuredFps = Math.round((fps.frames * 1000) / (now - fps.last));
            fps.frames = 0;
            fps.last = now;
            setStats({ lines: renderedLines.length, reflow: +elapsedReflow.toFixed(3), fps: measuredFps });
        }
    }, []);

    // ── rAF loop: reflows only when something changed ─────────────────────────
    useEffect(() => {
        const loop = () => {
            if (dirtyRef.current) {
                dirtyRef.current = false;
                reflow();
            }
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [reflow]);

    // ── Environment listeners ─────────────────────────────────────────────────
    useEffect(() => {
        measure();

        const refreshBox = () => {
            const container = containerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            containerBoxRef.current = { left: rect.left, top: rect.top, width: rect.width };
        };

        window.addEventListener('resize', measure);
        window.addEventListener('scroll', refreshBox, { passive: true });
        return () => {
            window.removeEventListener('resize', measure);
            window.removeEventListener('scroll', refreshBox);
        };
    }, [measure]);

    // ── Mouse/Touch tracking ──────────────────────────────────────────────────
    const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const container = containerRef.current;
        if (!container) return;

        let clientX: number;
        let clientY: number;

        if ('touches' in e) {
            const touch = e.touches[0];
            if (!touch) return;
            clientX = touch.clientX;
            clientY = touch.clientY;

            // Touch may happen after a scroll; refresh the cached box.
            const rect = container.getBoundingClientRect();
            containerBoxRef.current = { left: rect.left, top: rect.top, width: rect.width };
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const cfg = configRef.current;
        const box = containerBoxRef.current;
        const maxX = Math.max(0, box.width - cfg.orbW);

        orbPosRef.current = {
            x: Math.min(Math.max(0, clientX - box.left - cfg.orbW / 2), maxX),
            y: Math.max(0, clientY - box.top - cfg.orbH / 2),
        };
        applyOrbTransform();
        dirtyRef.current = true;
    }, [applyOrbTransform]);

    return (
        <section
            ref={containerRef}
            className="pretext-section"
            onMouseMove={onMove}
            onTouchMove={onMove}
        >
            <style jsx>{`
                .pretext-section {
                    position: relative;
                    width: 100%;
                    min-height: 100vh;
                    background: radial-gradient(ellipse at 50% 30%, #0d0d14 0%, #07070c 100%);
                    overflow: hidden;
                    cursor: crosshair;
                }

                .pretext-orb {
                    position: absolute;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                    z-index: 10;
                    border-radius: 12px;
                    overflow: hidden;
                    filter: drop-shadow(0 0 40px rgba(120, 80, 255, 0.25));
                    will-change: transform;
                }

                .pretext-orb-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    color: rgba(255,255,255,0.3);
                    font-size: 0.9rem;
                    font-family: monospace;
                }

                .pretext-text-container {
                    position: absolute;
                    inset: 0;
                    z-index: 5;
                    pointer-events: none;
                    overflow: hidden;
                }

                .pretext-lines-layer {
                    position: absolute;
                    inset: 0;
                }

                :global(.pretext-line) {
                    position: absolute;
                    white-space: pre;
                    color: rgba(230, 220, 200, 0.82);
                    line-height: 26px;
                    pointer-events: none;
                    letter-spacing: 0.01em;
                }

                .pretext-stats {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 100;
                    background: rgba(4, 4, 10, 0.88);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-top: 1px solid rgba(255,255,255,0.06);
                    padding: 8px 24px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px 32px;
                    align-items: center;
                }

                .pretext-stat {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }

                .pretext-stat-label {
                    font: 400 10px/1 sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: rgba(255,255,255,0.3);
                }

                .pretext-stat-value {
                    font: 600 12px/1 sans-serif;
                    color: rgba(255,255,255,0.7);
                    min-width: 36px;
                }

                .pretext-hint {
                    position: absolute;
                    top: 14px;
                    left: 50%;
                    transform: translateX(-50%);
                    font: 400 12px/1 sans-serif;
                    color: rgba(255,255,255,0.2);
                    z-index: 100;
                    background: rgba(0,0,0,0.4);
                    padding: 6px 18px;
                    border-radius: 999px;
                    pointer-events: none;
                    white-space: nowrap;
                    font-size: clamp(10px, 3vw, 12px);
                }

                @media (max-width: 768px) {
                    .pretext-stats {
                        padding: 8px 12px;
                        gap: 12px;
                    }
                }
            `}</style>

            <div className="pretext-hint">
                {isMobile ? 'Toca para mover' : 'Mueve el ratón'} · El texto reflota automáticamente
            </div>

            {/* Accessible source text; the visual lines are decorative. */}
            <p className="sr-only">{ARTICLE_TEXT}</p>

            {/* Floating 3D model */}
            <div
                ref={orbRef}
                className="pretext-orb"
                style={{ width: DESKTOP_CONFIG.orbW, height: DESKTOP_CONFIG.orbH }}
            >
                <Suspense fallback={<div className="pretext-orb-loading">Cargando 3D…</div>}>
                    <TextRing />
                </Suspense>
            </div>

            {/* Text container */}
            <div className="pretext-text-container">
                <div ref={linesRef} className="pretext-lines-layer" aria-hidden="true" />
            </div>

            {/* Stats bar */}
            <div className="pretext-stats">
                <div className="pretext-stat">
                    <span className="pretext-stat-label">Líneas</span>
                    <span className="pretext-stat-value">{stats.lines}</span>
                </div>
                <div className="pretext-stat">
                    <span className="pretext-stat-label">Reflow</span>
                    <span className="pretext-stat-value">{stats.reflow}ms</span>
                </div>
                <div className="pretext-stat">
                    <span className="pretext-stat-label">DOM reads/reflow</span>
                    <span className="pretext-stat-value">0</span>
                </div>
                <div className="pretext-stat">
                    <span className="pretext-stat-label">FPS</span>
                    <span className="pretext-stat-value">{stats.fps}</span>
                </div>
            </div>
        </section>
    );
}
