'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './TiltedProjectList.css';
import PixelTransition from './PixelTransition';

interface Project {
  id: number;
  name: string[];
  href: string;
  description: string;
}

interface TiltedProjectListProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  { id: 1, name: ['Compilador en', 'Zig'], href: '/proyectos/compilador', description: 'Un compilador completo para un subconjunto del lenguaje C, escrito desde cero en Zig.' },
  //{ id: 2, name: ['Robot', 'Humanoide'], href: '#' },
  //{ id: 3, name: ['Robot Sumo'], href: '#' },
  { id: 4, name: ['Marmol'], href: '/proyectos/marmol', description: 'Sistema de visión por computadora para detectar imperfecciones en planchas de mármol en tiempo real.' },
  { id: 5, name: ['Telemetria', 'Cohete'], href: '/proyectos/cohete', description: 'Placa PCB y software para la recolección y transmisión de datos de telemetría para cohetes amateur.' },
  { id: 6, name: ['Casco Patente'], href: '/proyectos/casco', description: 'Diseño de un casco de motocicleta con un sistema integrado para leer matrículas de vehículos cercanos.' },
];

// Deben coincidir con .animate-intro-project en TiltedProjectList.css
const INTRO_STAGGER_STEP = 0.1;
const INTRO_BASE_DELAY = 0.2;

const TiltedProjectList: React.FC<TiltedProjectListProps> = ({ projects = defaultProjects }) => {
  const router = useRouter();
  const [isIntroActive, setIsIntroActive] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const parallaxRef = useRef(0);
  const parallaxTargetRef = useRef(0);
  const lastYRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Solo contamos el desplazamiento después del primer evento,
      // para que el salto inicial del cursor no mande la lista al tope.
      if (lastYRef.current !== null) {
        const delta = e.clientY - lastYRef.current;
        parallaxTargetRef.current = Math.max(
          -220,
          Math.min(220, parallaxTargetRef.current - delta * 0.7)
        );
      }
      lastYRef.current = e.clientY;

      // Movemos el tooltip de forma imperativa: sin re-render por mousemove.
      if (descriptionRef.current) {
        descriptionRef.current.style.transform = `translate3d(${e.clientX - 350}px, ${e.clientY - 20}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Habilita el hover recién cuando termina la animación de entrada.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsIntroActive(false);
      return;
    }

    const items = container.querySelectorAll('.animate-intro-project');
    const total = items.length;
    if (total === 0) {
      setIsIntroActive(false);
      return;
    }

    let finished = 0;
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName !== 'intro-animation') return;
      finished += 1;
      if (finished >= total) setIsIntroActive(false);
    };

    // Si la hidratación llegó después de que la animación ya terminó,
    // no esperamos a un animationend que nunca va a llegar.
    const anyRunning = Array.from(items).some((el) =>
      el.getAnimations().some((animation) => animation.playState === 'running')
    );
    if (!anyRunning) {
      setIsIntroActive(false);
      return;
    }

    container.addEventListener('animationend', onAnimationEnd);

    // Respaldo por si algún navegador no dispara animationend.
    const fallback = setTimeout(() => setIsIntroActive(false), 8000);

    return () => {
      container.removeEventListener('animationend', onAnimationEnd);
      clearTimeout(fallback);
    };
  }, [projects.length]);

  // Mantiene el origen de la perspectiva en el centro del viewport.
  // Sin esto, con listas largas el origen queda en el centro de la lista
  // y los primeros/últimos proyectos se ven deformados.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const update = () => {
      const y = window.scrollY + window.innerHeight / 2 - container.offsetTop;
      container.style.setProperty('--perspective-origin-y', `${y}px`);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  // La lista sigue el movimiento del mouse (acumulado, con amortiguación).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const EASING = 0.2;
    let raf = 0;

    const tick = () => {
      const list = listRef.current;
      if (list) {
        parallaxRef.current += (parallaxTargetRef.current - parallaxRef.current) * EASING;
        list.style.transform = `translate3d(0, ${parallaxRef.current.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const totalProjects = projects.length;

  return (
    <div
      ref={containerRef}
      className={`
        flex items-center justify-end w-full min-h-screen p-[10vh_0]
        projects-stage bg-black overflow-hidden
        font-rubik
      `}
      onMouseLeave={() => {
        parallaxTargetRef.current = 0;
        lastYRef.current = null;
      }}
    >
      <ul ref={listRef} className="w-11/12 p-0 m-0 text-right list-none [transform-style:preserve-3d] will-change-transform">
        {projects.map((project, index) => {
          const staggerDelay = (totalProjects - 1 - index) * INTRO_STAGGER_STEP + INTRO_BASE_DELAY;

          // Capa 1: solo la entrada (animación). Capa 2: solo el hover.
          // Separarlas evita que al quitar la animación se pierda el estado hover.
          const introClasses = [
            'origin-right will-change-transform [transform-style:preserve-3d]',
            'md:-rotate-y-[40.5deg] rotate-y-[-13.5deg]',
            isIntroActive ? 'intro-initial-state animate-intro-project' : ''
          ].join(' ');

          const interactiveClasses = [
            'kitty transition-transform duration-[1200ms] ease-[cubic-bezier(0.075,0.82,0.165,1)]',
            'origin-right will-change-transform',
            // El hover se habilita recién cuando terminó el intro.
            !isIntroActive ? 'group-hover:rotate-y-[13.5deg] md:group-hover:rotate-y-[40.5deg]' : '',
          ].join(' ');

          return (
            <li 
              key={project.id} 
              className="group cursor-pointer [transform-style:preserve-3d] font-rubik mb-8 md:mb-4"
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => router.push(project.href)}
            >
              <div
                className={introClasses}
                style={{ animationDelay: `${staggerDelay}s` }}
              >
                <div className={interactiveClasses}>
                  <a
                    href={project.href}
                    onClick={(e) => e.preventDefault()}
                    className={`
                      block relative p-[10px_0] md:p-[20px_0] text-transparent uppercase
                      font-rubik text-[10vw] md:text-[8vw] lg:text-[9.6vw]
                      leading-[0.9] tracking-wider whitespace-pre
                      transition-colors duration-500 group-hover:text-gray-100
                      text-stroke

                      md:after:content-[''] md:after:absolute md:after:top-[0.23em]
                      md:after:left-[-0.3em] md:after:w-[2px] md:after:h-[0.85em]
                      md:after:bg-gray-100 md:after:rotate-25 md:after:pointer-events-none
                    `}
                  >
                    {project.name.join('\n')}
                  </a>
                  {/* Mobile description */}
                  <div className="md:hidden block text-neutral-400 text-xs mt-2 max-w-[80%] ml-auto font-sans normal-case tracking-normal">
                      {project.description}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      
      {/* Desktop hovered description */}
      <div
        ref={descriptionRef}
        className="hidden md:block"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: 'translate3d(-9999px, -9999px, 0)',
          zIndex: 9999,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease-in-out',
          willChange: 'transform',
        }}
      >
        {hoveredProject && (
          <PixelTransition
            forceActive={!!hoveredProject}
            animationStepDuration={0.5}
            className="w-[250px]"
            pixelColor="#222"
          >
            <div className="p-4 text-sm font-sans leading-snug">
              {hoveredProject.description}
            </div>
          </PixelTransition>
        )}
      </div>
    </div>
  );
};

export default TiltedProjectList;
