'use client';

import { ReactLenis, useLenis } from '@studio-freight/react-lenis';

function SmoothScroller({ children }: { children: React.ReactNode }) {
  const options = {
    lerp: 0.1,
    duration: 1.5,
    smoothTouch: true,
  };

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScroller;
