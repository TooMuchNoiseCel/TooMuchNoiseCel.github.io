'use client';

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

export default function Home() {
  return (
    <TiltedProjectList />
  );
}
