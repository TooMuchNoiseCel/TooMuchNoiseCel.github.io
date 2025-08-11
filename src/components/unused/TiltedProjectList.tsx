import React, { useState, useEffect, useRef } from 'react';
import './TiltedProjectList.css';

interface Project {
  id: number;
  name: string[];
  href: string;
}

interface TiltedProjectListProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  { id: 1, name: ['Compilador en', 'Zig'], href: 'https://google.com' },
  { id: 2, name: ['Robot', 'Humanoide'], href: '#' },
  { id: 3, name: ['Robot Sumo'], href: '#' },
  { id: 4, name: ['Marmol'], href: '#' },
  { id: 5, name: ['Telemetria', 'Cohete'], href: '#' },
  { id: 6, name: ['Patente'], href: '#' },
  { id: -1, name: [''], href: '#' },
];

const TiltedProjectList: React.FC<TiltedProjectListProps> = ({ projects = defaultProjects }) => {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const introTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    introTimerRef.current = setTimeout(() => {
      setIsIntroActive(false);
    }, 3000);

    return () => {
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
      }
    };
  }, []);

  const totalProjects = projects.length;

  return (
    <div
      className={`
        flex items-center justify-end w-full min-h-screen p-[5vw_0]
        bg-gray-900 overflow-hidden [perspective:1000px]
        font-rubik
      `}
    >
      <ul className="w-11/12 p-0 m-0 text-right list-none [transform-style:preserve-3d]">
        {projects.map((project, index) => {
          const staggerDelay = (totalProjects - 1 - index) * 0.1 + 0.2;

          const containerClasses = [
            'transition-transform duration-[1200ms] ease-[cubic-bezier(0.075,0.82,0.165,1)]',
            'hover:[transform:rotateY(0deg)]',
            '[transform-origin:right_center]',
            '[transform:rotateY(-45deg)]',
            'will-change-transform',
            isIntroActive ? 'intro-initial-state animate-intro-project' : ''
          ].join(' ');

          return (
            <li key={project.id} className="cursor-pointer [transform-style:preserve-3d] font-rubik mb-4">
              <div
                className={containerClasses}
                style={{ animationDelay: `${staggerDelay}s` }}
              >
                <a
                  href={project.href}
                  //data-info={project.year}
                  className={`
                    block relative p-[20px_0] text-transparent uppercase
                    font-rubik text-[8vw] md:text-[8vw] lg:text-[9.6vw]
                    leading-[0.9] tracking-wider whitespace-pre
                    transition-colors duration-500 hover:text-gray-100
                    text-stroke

                    before:content-[attr(data-info)] before:absolute before:top-[3.7em]
                    before:left-[-200px] before:w-[180px] before:text-right
                    before:text-[0.7vw] before:font-rubik before:tracking-normal
                    before:leading-tight before:text-gray-100 before:pointer-events-none

                    after:content-[''] after:absolute after:top-[0.23em]
                    after:left-[-0.3em] after:w-[2px] after:h-[0.85em]
                    after:bg-gray-100 after:rotate-25 after:pointer-events-none

                    md:before:block md:after:block before:hidden after:hidden
                  `}
                >
                  {project.name.join('\n')}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TiltedProjectList;
