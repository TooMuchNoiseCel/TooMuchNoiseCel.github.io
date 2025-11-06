'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function BackButton() {
  return (
    <div className="mb-8">
      <Link
        href="/proyectos"
        className="relative z-20  group inline-flex items-center gap-2 text-sm font-medium text-neutral-400
                   transition-colors duration-300
                   hover:text-white
                   focus-visible:text-white focus-visible:outline-none"
      >
        <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="bg-gradient-to-r from-sky-500 to-sky-500 
                         bg-[length:0%_2px] bg-left-bottom bg-no-repeat
                         transition-[background-size] duration-300 
                         group-hover:bg-[length:100%_2px]">
          Volver
        </span>
      </Link>
    </div>
  );
}
