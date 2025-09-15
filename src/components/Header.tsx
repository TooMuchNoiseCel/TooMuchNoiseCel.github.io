'use client';
import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import RotatingText from './RotatingText';

const Header = () => {
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);

  const rotatingSubtitles = [
    'Coder',
    'Full Stack Developer',
    'UI/UX Problem Solver',
    'Systems Thinker',
    'Lifelong Learner',
    'Systems & Algorithms Enthusiast',
    'Low-Level & High-Level Programmer',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaderFinished(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    gsap.set('.reveal-line-content', { yPercent: 100 });

    if (isLoaderFinished) {
      const tl = gsap.timeline();
      tl.to('.reveal-line-content', {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.175,
        ease: 'expo.out',
      });
    }
  }, [isLoaderFinished]);

  return (
    <header
      className="relative z-10 flex h-screen items-center justify-center overflow-hidden bg-black text-white"
      data-scroll-section
    >
      <div className="cursor-default text-center">
        <h1 className="mb-4 font-playfair text-[clamp(2.5rem,10vw,7rem)] font-medium leading-[1.1] text-white">
          <span className="block overflow-hidden">
            <span className="reveal-line-content inline-block">Leonardo</span>
          </span>
          <span className="block overflow-hidden pl-[clamp(1rem,5vw,4rem)]">
            <span className="reveal-line-content inline-block">Castañeda</span>
          </span>
        </h1>

        <div className="text-[clamp(0.8rem,3vw,1.2rem)] font-extralight tracking-wider text-neutral-400">
          <RotatingText
            texts={rotatingSubtitles}
            staggerDuration={0.03}
            rotationInterval={3000}
            mainClassName="justify-center"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
