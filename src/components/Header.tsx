'use client';
import { useEffect, useRef } from 'react';
import RotatingText from './RotatingText';

const ROTATING_SUBTITLES = [
  'Coder',
  'Full Stack Developer',
  'UI/UX Problem Solver',
  'Systems Thinker',
  'Lifelong Learner',
  'Systems & Algorithms Enthusiast',
  'Low-Level & High-Level Programmer',
];

const Header = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // El parallax rota el robot dentro del canvas, no la cámara ni el iframe.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = { x: 0, y: 0 };
    let raf = 0;

    const send = () => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'humanocito-parallax', x: target.x, y: target.y },
        '*'
      );
      raf = 0;
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(send);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      className="relative z-10 flex min-h-screen items-center overflow-hidden bg-black py-20 text-white lg:py-0"
      data-scroll-section
    >
      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-24 px-6 sm:px-8 lg:grid-cols-2 lg:gap-32 xl:gap-[350px]">
        <div className="cursor-default text-left">
          <h1
            className="mb-4 font-playfair text-[clamp(2.5rem,7vw,6.75rem)] font-medium leading-[1.02] text-white"
            style={{ letterSpacing: '0.015em' }}
          >
            <span className="block overflow-hidden">
              <span className="reveal-line-content inline-block">Leonardo</span>
            </span>
            <span className="block overflow-hidden">
              <span className="reveal-line-content reveal-line-content--delayed inline-block">Castañeda</span>
            </span>
          </h1>

          <div className="max-w-xl text-[clamp(0.8rem,2.2vw,1.15rem)] font-extralight tracking-wider text-neutral-400">
            <RotatingText
              texts={ROTATING_SUBTITLES}
              staggerDuration={0.03}
              rotationInterval={3000}
              mainClassName="justify-start"
            />
          </div>
        </div>

        <div className="relative h-[360px] w-full overflow-hidden sm:h-[480px] lg:h-[560px] xl:h-[640px]">
          <iframe
            ref={iframeRef}
            src="/humanocito/index.html"
            title="Humanocito caminando"
            className="pointer-events-none h-full w-full border-0"
            aria-hidden="true"
            onLoad={() => {
              iframeRef.current?.contentWindow?.postMessage(
                { type: 'humanocito-parallax', x: 0, y: 0 },
                '*'
              );
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
