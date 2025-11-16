'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import TiltedProjectList from '@/components/unused/TiltedProjectList';

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rounded-full px-4 py-1 text-sm font-medium ${className || ''}`}>
      {children}
    </span>
  );
}


export function Section({ title, icon, children, className, iconClassName }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string; iconClassName?: string; }) {
  return (
    <section className="mb-10">
      <h2 className={`mb-4 flex items-center border-b-2 pb-2 text-2xl font-semibold ${className || 'border-sky-500/30'}`}>
        <span className={`mr-3 ${iconClassName || 'text-sky-400'}`}>{icon}</span>
        {title}
      </h2>
      <div className="space-y-4 text-neutral-300/90">{children}</div>
    </section>
  );
}

function BackButton() {
  return (
    <div className="fixed top-6 left-6 z-50">
      <Link
        href="/"
        className="fixed z-20  group inline-flex items-center gap-2 text-sm font-medium text-neutral-400
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

export default function Home() {
  return (
    <>
    <BackButton />
    <TiltedProjectList />
    </>
  );
}
