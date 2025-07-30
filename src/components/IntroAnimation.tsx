'use client';

import { useState, useEffect } from 'react';

interface IntroAnimationProps {
  children: React.ReactNode;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startAnimationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 100);

    const finishAnimationTimer = setTimeout(() => {
      setIsFinished(true);
    }, 2200);

    return () => {
      clearTimeout(startAnimationTimer);
      clearTimeout(finishAnimationTimer);
    };
  }, []);

  return (
    <div className="relative">
      {}
      {children}

      {}
      <div
        className={`
          fixed inset-0 flex z-50 pointer-events-none
          ${isFinished ? 'hidden' : ''} 
        `}
      >
        <div
          className={`
            w-1/2 h-full intro-door-bg 
            transition-transform duration-1500 ease-[cubic-bezier(.74,.29,.1,1.03)]
            ${isAnimating ? 'translate-x-0' : '-translate-x-full'}
          `}
        ></div>

        <div
          className={`
            w-1/2 h-full intro-door-bg
            transition-transform duration-1500 ease-[cubic-bezier(.74,.29,.1,1.03)]
            ${isAnimating ? 'translate-x-0' : 'translate-x-full'}
          `}
        ></div>
      </div>
    </div>
  );
};

export default IntroAnimation;
