'use client';

import { useEffect, useRef, useState } from 'react';
import { FaOrcid } from 'react-icons/fa';

interface Author {
  name: string;
  affiliation: string;
  orcid?: string;
}

interface Publication {
  title: string;
  url: string;
  journal?: string;
  authors: Author[];
}

const publications: Publication[] = [
  {
    title: 'Análisis de demanda de ancho de banda en los servicios de internet de RedUNAM',
    url: 'https://cuadernos.tic.unam.mx/index.php/cua/article/view/144',
    journal: 'Cuadernos de TIC — UNAM',
    authors: [
      {
        name: 'Esteban Roberto Ramírez Fernández',
        affiliation: 'DGTIC',
        orcid: 'https://orcid.org/0000-0002-2169-6233',
      },
      {
        name: 'Hugo Rivera Martínez',
        affiliation: 'DGTIC',
        orcid: 'https://orcid.org/0009-0007-1248-9412',
      },
      {
        name: 'Leonardo Isay Castañeda Ávila',
        affiliation: 'Facultad de Estudios Superiores, Aragón',
      },
    ],
  },
];

export default function PublicacionesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const revealClass = revealed
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-6';

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#09090b] px-6 py-36 font-outfit text-neutral-300 sm:px-8 sm:py-44"
    >
      <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[220px_1fr] md:gap-24">
        <div className={`transition-all duration-700 ease-out motion-reduce:transition-none ${revealClass}`}>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sky-400/80">
            Investigación
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Publicaciones
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
            Trabajos académicos y colaboraciones en los que he participado.
          </p>
        </div>

        <div className="border-t border-neutral-800">
          {publications.map((pub, i) => (
            <article
              key={i}
              className={`border-b border-neutral-800 py-12 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 sm:py-16 ${revealClass}`}
              style={{ transitionDelay: `${120 + i * 120}ms` }}
            >
              {pub.journal && (
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                  {pub.journal}
                </p>
              )}

              <h3 className="text-xl font-medium leading-snug text-white sm:text-2xl">
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-sky-300"
                >
                  {pub.title}
                </a>
              </h3>

              <ul className="mt-5 space-y-2 text-sm">
                {pub.authors.map((author, j) => (
                  <li
                    key={j}
                    className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-neutral-400"
                  >
                    <span className="text-neutral-300">{author.name}</span>
                    <span className="text-neutral-700">·</span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                      {author.affiliation}
                    </span>
                    {author.orcid && (
                      <a
                        href={author.orcid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#a6ce39] transition-opacity hover:opacity-75"
                      >
                        <FaOrcid />
                        ORCID
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-b border-neutral-700 pb-0.5 text-sm text-neutral-300 transition-colors hover:border-neutral-400 hover:text-white"
                >
                  Leer publicación
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
