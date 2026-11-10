'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function BackButton() {
  return (
    <div className="mb-10">
      <Link
        href="/proyectos"
        className="group inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-200"
      >
        <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1" />
        Volver
      </Link>
    </div>
  );
}
