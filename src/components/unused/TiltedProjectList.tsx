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

const TiltedProjectList: React.FC<TiltedProjectListProps> = ({ projects = defaultProjects }) => {
  const router = useRouter();
  const [isIntroActive, setIsIntroActive] = useState(true);
  const introTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    introTimerRef.current = setTimeout(() => {
      setIsIntroActive(false);
    }, 2000);

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const totalProjects = projects.length;

  return (
    <div
      className={`
        flex items-center justify-end w-full min-h-screen p-[10vh_0]
        bg-black overflow-hidden [perspective:1000px]
        font-rubik
      `}
    >
      <ul className="w-11/12 p-0 m-0 text-right list-none [transform-style:preserve-3d]">
        {projects.map((project, index) => {
          const staggerDelay = (totalProjects - 1 - index) * 0.1 + 0.2;

          const containerClasses = [
            'transition-transform duration-[1200ms] ease-[cubic-bezier(0.075,0.82,0.165,1)]',
            'group-hover:rotate-y-0',
            'origin-right',
            'md:-rotate-y-45 rotate-y-[-15deg]',
            'will-change-transform',
            'kitty',
            isIntroActive ? 'intro-initial-state animate-intro-project' : ''
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
                className={containerClasses}
                style={{ animationDelay: `${staggerDelay}s` }}
              >
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
            </li>
          );
        })}
      </ul>
      
      {/* Desktop hovered description */}
      <div
        className="hidden md:block"
        style={{
          position: 'fixed',
          top: cursorPosition.y,
          left: cursorPosition.x,
          transform: 'translate(-350px, -20px)',
          zIndex: 9999,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease-in-out',
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
