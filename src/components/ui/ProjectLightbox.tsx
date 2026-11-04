import React, { useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImage } from '../../lib/images';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface LightboxItem {
  src: string;
  caption: string;
  width?: number;
  height?: number;
}

interface ProjectLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: LightboxItem[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
  projectTitle: string;
  triggerElement?: HTMLElement | null;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
  projectTitle,
  triggerElement,
}) => {
  const prefersReduced = useReducedMotion();
  const isReduced = !!prefersReduced;
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const total = items.length;
  const currentItem = items[currentIndex] || items[0];

  const goToNext = useCallback(() => {
    if (total <= 1) return;
    onNavigate((currentIndex + 1) % total);
  }, [currentIndex, total, onNavigate]);

  const goToPrev = useCallback(() => {
    if (total <= 1) return;
    onNavigate((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onNavigate]);

  // Preload neighboring images
  useEffect(() => {
    if (!isOpen || total <= 1) return;
    const nextIdx = (currentIndex + 1) % total;
    const prevIdx = (currentIndex - 1 + total) % total;

    [nextIdx, prevIdx].forEach((idx) => {
      const nextItem = items[idx];
      if (nextItem) {
        const opt = getOptimizedImage(nextItem.src, { width: 1920 });
        const img = new Image();
        img.src = opt.src;
        if (opt.srcSet) img.srcset = opt.srcSet;
      }
    });
  }, [isOpen, currentIndex, total, items]);

  // Lock body scroll while open and restore focus on close
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus first interactive element inside modal
      setTimeout(() => {
        if (dialogRef.current) {
          const focusable = dialogRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          focusable?.focus();
        }
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
        if (triggerElement && typeof triggerElement.focus === 'function') {
          triggerElement.focus();
        }
      };
    }
  }, [isOpen, triggerElement]);

  // Keyboard navigation and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
        return;
      }

      // Trap focus
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || total <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
  };

  if (!isOpen || !currentItem) return null;

  const optimized = getOptimizedImage(currentItem.src, { width: 1920 });

  return (
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${currentItem.caption || 'Visuel'} - Plein écran`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isReduced ? 0.1 : 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-onyx/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 select-none"
      >
        <div
          className="relative max-w-6xl w-full max-h-[94vh] flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar: Counter & Close button */}
          <div className="w-full flex items-center justify-between pb-3 px-1 text-white/80">
            <span className="text-xs sm:text-sm font-medium font-body text-ivoire-violet/80">
              {currentIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-amethyste"
              aria-label="Fermer la vue plein écran (Échap)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Navigation Prev Button */}
          {total > 1 && (
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-2 sm:-left-12 md:-left-16 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/80 hover:text-white rounded-full bg-onyx/80 border border-white/10 hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-amethyste z-20 shadow-lg"
              aria-label="Image précédente (Flèche gauche)"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Navigation Next Button */}
          {total > 1 && (
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 sm:-right-12 md:-right-16 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/80 hover:text-white rounded-full bg-onyx/80 border border-white/10 hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-amethyste z-20 shadow-lg"
              aria-label="Image suivante (Flèche droite)"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Main Visual Image (Preserves natural aspect ratio, never cropped) */}
          <div
            className="relative max-h-[75vh] sm:max-h-[78vh] flex items-center justify-center overflow-hidden rounded-2xl bg-onyx shadow-2xl border border-white/10 select-none"
            onContextMenu={(e) => e.preventDefault()}
            data-protected-image="true"
          >
            <motion.img
              key={currentItem.src}
              initial={isReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              src={optimized.src}
              srcSet={optimized.srcSet}
              sizes="90vw"
              alt={currentItem.caption || projectTitle}
              width={currentItem.width || optimized.width}
              height={currentItem.height || optimized.height}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="max-h-[75vh] sm:max-h-[78vh] w-auto max-w-full object-contain pointer-events-none select-none"
              decoding="async"
            />
            {/* Anti-download protective overlay shield */}
            <div
              className="absolute inset-0 z-10 select-none cursor-default"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              aria-hidden="true"
            />
          </div>

          {/* Caption & Project Info */}
          <div className="mt-4 text-center text-white space-y-1 max-w-2xl px-4">
            <p className="text-sm sm:text-base font-semibold font-body leading-snug">
              {currentItem.caption}
            </p>
            <p className="text-xs text-white/60 font-body">
              {projectTitle} • Visuel {currentIndex + 1} sur {total}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
