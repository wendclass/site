import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Sparkles } from 'lucide-react';

interface HeroProjectSlide {
  id: string;
  title: string;
  category: string;
  image: string;
  tagline: string;
  accent: string;
}

const HERO_SLIDES: HeroProjectSlide[] = [
  {
    id: 'bang',
    title: 'Bang',
    category: 'Identité Visuelle & Stratégie',
    image: '/assets/projets/bang/SUBWAY LED BILLBOARD bang.png',
    tagline: 'Une identité singulière pensée pour s’imposer sur le marché.',
    accent: '#6600CC',
  },
  {
    id: 'mon-frere-parle',
    title: 'Mon Frère, Parle',
    category: 'Identité & Campagne',
    image: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Visuel_Principal.jpg',
    tagline: 'Une atmosphère visuelle bienveillante au service d’une cause forte.',
    accent: '#A87FE8',
  },
  {
    id: '72h-cj',
    title: '72H CJ 2026',
    category: 'Communication Événementielle',
    image: '/assets/projets/72h-cj-2026/Carrousel 0 72h 2026.png',
    tagline: 'Des visuels percutants conçus pour maximiser l’engouement.',
    accent: '#C9A070',
  },
  {
    id: 'cafe-inspire',
    title: 'Café Inspire',
    category: 'Branding Social Media',
    image: '/assets/projets/cafe-inspire/01_Café Pyramide v3.png',
    tagline: 'Structuration visuelle pour convertir chaque post en ventes.',
    accent: '#6600CC',
  },
  {
    id: 'off-day',
    title: 'Off Day',
    category: 'Campagne Événementielle',
    image: '/assets/projets/off-day/Off_Day_Visual_v2.2 Corrigé.png',
    tagline: 'Simplicité radicale et mémorisation instantanée.',
    accent: '#3A2F5C',
  },
];

// 16 fragments in a 4x4 matrix for Desktop, dynamic styling
const GRID_ROWS = 4;
const GRID_COLS = 4;
const TOTAL_TILES = GRID_ROWS * GRID_COLS;

export const HeroAnimation: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const currentSlide = HERO_SLIDES[currentIndex];

  // Helper to trigger the fragment construction gesture
  const animateConstruction = useCallback((onComplete?: () => void) => {
    if (prefersReducedMotion) {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, onComplete }
        );
      }
      return;
    }

    const validTiles = tilesRef.current.filter(Boolean) as HTMLDivElement[];
    if (validTiles.length === 0) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        if (onComplete) onComplete();
      },
    });

    // Same iconic gesture: fragments arrive from scattered positions with organic stagger
    tl.set(validTiles, {
      opacity: 0,
      scale: 0.7,
      x: (i) => {
        const col = i % GRID_COLS;
        return (col - 1.5) * (Math.random() * 60 + 40);
      },
      y: (i) => {
        const row = Math.floor(i / GRID_COLS);
        return (row - 1.5) * (Math.random() * 60 + 40);
      },
      rotation: () => (Math.random() - 0.5) * 35,
      filter: 'blur(8px)',
    });

    tl.to(validTiles, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0,
      filter: 'blur(0px)',
      duration: 1.05,
      stagger: {
        grid: [GRID_ROWS, GRID_COLS],
        from: 'center',
        amount: 0.45,
        ease: 'power3.out',
      },
      ease: 'back.out(1.4)',
    });

    timelineRef.current = tl;
  }, [prefersReducedMotion]);

  // Helper to trigger the fragment deconstruction gesture (same movement reversed/scattered)
  const animateDeconstruction = useCallback((nextIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (prefersReducedMotion) {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            setCurrentIndex(nextIndex);
            gsap.to(containerRef.current, { opacity: 1, duration: 0.3, onComplete: () => setIsTransitioning(false) });
          },
        });
      }
      return;
    }

    const validTiles = tilesRef.current.filter(Boolean) as HTMLDivElement[];
    if (validTiles.length === 0) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex);
      },
    });

    // Deconstruction: disperse fragments outwards rapidly (650ms)
    tl.to(validTiles, {
      opacity: 0,
      scale: 0.75,
      x: (i) => {
        const col = i % GRID_COLS;
        return (col - 1.5) * (Math.random() * 70 + 50);
      },
      y: (i) => {
        const row = Math.floor(i / GRID_COLS);
        return (row - 1.5) * (Math.random() * 70 + 50);
      },
      rotation: () => (Math.random() - 0.5) * 45,
      filter: 'blur(6px)',
      duration: 0.65,
      stagger: {
        grid: [GRID_ROWS, GRID_COLS],
        from: 'edges',
        amount: 0.3,
        ease: 'power2.in',
      },
      ease: 'power2.in',
    });

    timelineRef.current = tl;
  }, [isTransitioning, prefersReducedMotion]);

  // Trigger initial construction on mount
  useEffect(() => {
    animateConstruction();
    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, []);

  // Trigger construction whenever currentIndex updates
  useEffect(() => {
    animateConstruction();
  }, [currentIndex, animateConstruction]);

  // Auto-rotation timer (every 5 seconds when not hovered)
  useEffect(() => {
    if (isHovered || isTransitioning) return;

    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % HERO_SLIDES.length;
      animateDeconstruction(nextIndex);
    }, 4800);

    return () => clearInterval(timer);
  }, [currentIndex, isHovered, isTransitioning, animateDeconstruction]);

  const handleManualSlide = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    animateDeconstruction(index);
  };

  return (
    <div
      className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative ambient backdrop */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-violet-imperial/20 via-amethyste/15 to-or-champagne/15 rounded-3xl blur-2xl opacity-75 transform -rotate-1 pointer-events-none" />

      {/* Main Showcase Container */}
      <div
        ref={containerRef}
        className="relative bg-onyx rounded-2xl md:rounded-3xl p-3 sm:p-4 shadow-soft-lg border border-violet-imperial/20 overflow-hidden"
      >
        {/* Top Mini Bar */}
        <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-white/10 text-xs text-ivoire-violet/70">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amethyste animate-pulse" />
            <span className="font-medium tracking-wide uppercase text-[11px] text-or-champagne">
              Projet en vitrine : {currentSlide.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-ivoire-violet/50">
            <Sparkles className="w-3.5 h-3.5 text-amethyste" />
            <span className="hidden sm:inline">Construction par fragments</span>
          </div>
        </div>

        {/* The Fragment Matrix */}
        <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-xl overflow-hidden bg-onyx/80">
          <div
            className="w-full h-full grid grid-cols-4 grid-rows-4 gap-[2px] bg-onyx"
            style={{
              perspective: '1200px',
            }}
          >
            {Array.from({ length: TOTAL_TILES }).map((_, i) => {
              const row = Math.floor(i / GRID_COLS);
              const col = i % GRID_COLS;
              // Compute background position so each tile displays its slice of the image
              const bgPosX = (col / (GRID_COLS - 1)) * 100;
              const bgPosY = (row / (GRID_ROWS - 1)) * 100;

              return (
                <div
                  key={i}
                  ref={(el) => (tilesRef.current[i] = el)}
                  className="relative overflow-hidden bg-cover bg-no-repeat rounded-[2px] shadow-sm transform-gpu will-change-transform"
                  style={{
                    backgroundImage: `url("${currentSlide.image}")`,
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    backgroundSize: '400% 400%',
                  }}
                >
                  {/* Subtle glossy border and overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
                </div>
              );
            })}
          </div>

          {/* Bottom Project Overlay Card */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 glass-card-dark rounded-xl p-3 sm:p-4 border border-white/15 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amethyste">
                  {currentSlide.category}
                </span>
                <span className="text-white/30 text-xs">•</span>
                <span className="text-xs text-white/80 font-medium">
                  {currentSlide.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ivoire-violet font-normal leading-snug line-clamp-1">
                {currentSlide.tagline}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <span className="text-[11px] text-ivoire-violet/60 font-body">
                {currentIndex + 1} / {HERO_SLIDES.length}
              </span>
            </div>
          </div>
        </div>

        {/* Project Selector Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-3">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => handleManualSlide(idx)}
              className={`h-2 transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amethyste ${
                idx === currentIndex
                  ? 'w-8 bg-gradient-to-r from-amethyste to-or-champagne'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Afficher le projet ${slide.title}`}
              aria-current={idx === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
