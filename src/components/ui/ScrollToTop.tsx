import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMobileInputFocus } from '../../hooks/useMobileInputFocus';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isInputFocused = useMobileInputFocus();

  useEffect(() => {
    const handleScroll = () => {
      // Appear after 350px of scroll
      setIsVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && !isInputFocused && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+5.25rem)] right-4 sm:right-6 z-40 w-11 h-11 rounded-full bg-white/95 text-violet-imperial border border-violet-imperial/20 shadow-soft hover:shadow-glow hover:bg-white hover:border-violet-imperial hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-imperial backdrop-blur-sm"
          aria-label="Retour en haut de la page"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
