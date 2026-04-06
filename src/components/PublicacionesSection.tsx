'use client';

import { motion } from 'framer-motion';
import { FaBook, FaExternalLinkAlt, FaOrcid } from 'react-icons/fa';

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

const COLORS = {
  bg: '#0b0d12',
  fg: '#e5e7eb',
  accent: '#60a5fa',
  muted: '#9ca3af',
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
};

export default function PublicacionesSection() {
  return (
    <section
      className="w-full py-24 px-6"
      style={{ backgroundColor: COLORS.bg, color: COLORS.fg }}
    >
      <div className="max-w-4xl mx-auto font-inter">
        <motion.h2
          className="font-outfit text-4xl font-bold mb-12 text-center tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <FaBook className="inline-block mr-3 text-2xl align-middle" style={{ color: COLORS.accent }} />
          Publicaciones
        </motion.h2>

        <div className="space-y-8">
          {publications.map((pub, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group rounded-2xl p-6 md:p-8 transition-all duration-300
                         hover:shadow-[0_0_40px_rgba(96,165,250,0.08)]"
              style={{
                backgroundColor: COLORS.card,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              {/* Journal badge */}
              {pub.journal && (
                <span
                  className="inline-block text-xs font-medium tracking-wider uppercase mb-3 px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(96,165,250,0.12)', color: COLORS.accent }}
                >
                  {pub.journal}
                </span>
              )}

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-semibold mb-4 leading-snug">
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline decoration-1 underline-offset-4 transition-colors duration-200"
                  style={{ color: COLORS.fg }}
                >
                  {pub.title}
                  <FaExternalLinkAlt
                    className="inline-block ml-2 text-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  />
                </a>
              </h3>

              {/* Authors */}
              <div className="space-y-2">
                {pub.authors.map((author, j) => (
                  <div key={j} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span style={{ color: COLORS.fg }}>{author.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: COLORS.muted }}
                    >
                      {author.affiliation}
                    </span>
                    {author.orcid && (
                      <a
                        href={author.orcid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs transition-colors duration-200 hover:text-green-400"
                        style={{ color: '#a6ce39' }}
                      >
                        <FaOrcid />
                        ORCID
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Read link */}
              <div className="mt-5">
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200
                             hover:gap-3"
                  style={{ color: COLORS.accent }}
                >
                  Leer publicación
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
