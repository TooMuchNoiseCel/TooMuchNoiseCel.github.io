'use client'; // Las animaciones requieren que este sea un Client Component

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Define las variantes de la animación
const variants = {
  // Estado inicial de la página que entra
  initial: {
    x: '100%',
    opacity: 0,
  },
  // Estado final de la página que entra
  animate: {
    x: 0,
    opacity: 1,
  },
  // Estado final de la página que sale
  exit: {
    x: '-100%',
    opacity: 0,
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  // El hook usePathname nos da la ruta actual para usarla como `key`.
  // Esto es crucial para que AnimatePresence detecte el cambio de página.
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      {/* 
        La 'key' es fundamental. Cuando la 'key' cambia, AnimatePresence
        sabe que un componente está saliendo y otro entrando.
      */}
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.5, // Ajusta la duración a tu gusto
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
