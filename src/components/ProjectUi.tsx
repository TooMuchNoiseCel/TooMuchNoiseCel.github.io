import React from 'react';
import { FaGithub } from 'react-icons/fa';
import BackButton from './BackButton';

export function ProjectShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-[#09090b] font-outfit text-neutral-300 antialiased">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:px-8 sm:py-28">
        <BackButton />
        {children}
      </div>
    </main>
  );
}

export function ProjectHeader({
  kicker,
  title,
  subtitle,
  tags,
  accent = 'text-neutral-500',
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  accent?: string;
}) {
  return (
    <header className="mb-20 sm:mb-24">
      <p className={`mb-3 text-[11px] font-medium uppercase tracking-[0.22em] ${accent}`}>
        {kicker}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-400">
          {subtitle}
        </p>
      )}
      {tags && tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      )}
    </header>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-400">
      {children}
    </span>
  );
}

export function InfoCard({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="mb-24 sm:mb-28 grid gap-px overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-[#0c0c0f] p-5">
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            {item.label}
          </dt>
          <dd className="mt-2 text-sm text-neutral-200">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Section({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-[90px]">
      <h2 className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-neutral-400">
        {children}
      </div>
    </section>
  );
}

export function MiniCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0c0c0f] p-4">
      <h3 className="mb-1.5 text-sm font-medium text-neutral-100">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-500">{children}</p>
    </div>
  );
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-neutral-800 bg-[#0c0c0f] p-4 font-mono text-sm text-neutral-400">
      <code>{children}</code>
    </pre>
  );
}

export function RepoLink({
  href,
  children = 'Ver repositorio',
}: {
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-neutral-900"
    >
      <FaGithub className="text-base" />
      {children}
    </a>
  );
}
