'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function BackButton() {
  return (
    <div className="mb-8">
      <Link
        href="/proyectos"
        className="group inline-flex items-center gap-3 rounded-full border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-400
                   transition-all duration-300
                   hover:border-sky-500/80 hover:bg-sky-500/10 hover:text-sky-400
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Volver a todos los proyectos</span>
      </Link>
    </div>
  );
}
