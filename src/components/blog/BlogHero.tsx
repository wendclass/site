import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Clock,
  Calendar,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { DbArticle } from '../../lib/supabase';
import { getRubriqueName } from '../../config/rubriques';

interface BlogHeroProps {
  articles: DbArticle[];
}

export const BlogHero: React.FC<BlogHeroProps> = ({ articles }) => {
  const prefersReduced = useReducedMotion();
  const isReducedMotion = !!prefersReduced;

  // Filter 3 most recent published articles
  const recentArticles = useMemo(() => {
    return [...articles]
      .filter((a) => a.status === 'publie')
      .sort(
        (a, b) =>
          new Date(b.published_at || b.created_at).getTime() -
          new Date(a.published_at || a.created_at).getTime()
      )
      .slice(0, 3);
  }, [articles]);

  const count = recentArticles.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!isReducedMotion);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasManuallyInteracted, setHasManuallyInteracted] = useState(false);
  const [srAnnouncement, setSrAnnouncement] = useState('');

  // 3D Tilt states
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hasHoverSupport, setHasHoverSupport] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  // Swipe gesture tracking
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasHoverSupport(window.matchMedia('(hover: hover)').matches);
    }
  }, []);

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Safe manual navigation
  const goToNext = useCallback(
    (isManual = false) => {
      if (count <= 1) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % count;
        if (isManual) {
          setHasManuallyInteracted(true);
          setSrAnnouncement(
            `Article ${next + 1} sur ${count} : ${recentArticles[next]?.title}`
          );
        }
        return next;
      });
    },
    [count, recentArticles]
  );

  const goToPrev = useCallback(
    (isManual = false) => {
      if (count <= 1) return;
      setActiveIndex((prev) => {
        const next = (prev - 1 + count) % count;
        if (isManual) {
          setHasManuallyInteracted(true);
          setSrAnnouncement(
            `Article ${next + 1} sur ${count} : ${recentArticles[next]?.title}`
          );
        }
        return next;
      });
    },
    [count, recentArticles]
  );

  const selectIndex = useCallback(
    (idx: number) => {
      if (idx === activeIndex || count <= 1) return;
      setActiveIndex(idx);
      setHasManuallyInteracted(true);
      setSrAnnouncement(
        `Article ${idx + 1} sur ${count} : ${recentArticles[idx]?.title}`
      );
    },
    [activeIndex, count, recentArticles]
  );

  // Auto rotation timer (5s)
  useEffect(() => {
    if (
      count <= 1 ||
      isReducedMotion ||
      !isPlaying ||
      isHovered ||
      isFocused ||
      hasManuallyInteracted
    ) {
      return;
    }

    const timer = setInterval(() => {
      goToNext(false);
    }, 5000);

    return () => clearInterval(timer);
  }, [
    count,
    isReducedMotion,
    isPlaying,
    isHovered,
    isFocused,
    hasManuallyInteracted,
    goToNext,
  ]);

  // Tilt handling on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasHoverSupport || isReducedMotion || !deckRef.current) return;
    const rect = deckRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -y * 8, // ±4° range
      ry: x * 8, // ±4° range
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (count <= 1) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev(true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext(true);
    }
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || count <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        goToNext(true);
      } else {
        goToPrev(true);
      }
    }
    touchStartX.current = null;
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    setHasManuallyInteracted(true);
  };

  return (
    <section
      aria-label="En-tête et articles à la une du Journal Class S"
      className="relative w-full overflow-hidden border-b border-white/5 pb-12 pt-6 lg:pb-16 lg:pt-10"
    >
      {/* Background ambient glow with slow drift */}
      <div
        aria-hidden="true"
        className={`absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-violet-imperial/20 blur-[120px] pointer-events-none ${
          !isReducedMotion ? 'animate-pulse transition-all duration-[8000ms]' : ''
        }`}
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-10 h-72 w-72 rounded-full bg-or-champagne/10 blur-[100px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[400px] lg:h-[clamp(420px,60vh,560px)]">
          {/* LEFT COLUMN: Editorial Text */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5 text-left">
            {/* Badge */}
            <motion.div
              initial={isReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/20 border border-violet-imperial/30 text-amethyste text-xs font-semibold uppercase tracking-widest w-fit"
            >
              <Sparkles className="w-3.5 h-3.5 text-or-champagne shrink-0" />
              <span>Éditorial & Stratégie Visuelle</span>
            </motion.div>

            {/* H1 Title */}
            <motion.h1
              initial={isReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]"
            >
              Le Journal <span className="text-or-champagne">Class S</span>
            </motion.h1>

            {/* Intro text */}
            <motion.p
              initial={isReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-body text-base sm:text-lg text-ivoire-violet/75 leading-relaxed max-w-xl"
            >
              Analyses, retours d'expérience et conseils concrets pour bâtir une
              marque singulière, crédible et mémorable.
            </motion.p>

            {/* Anchor link to filter/grid */}
            <motion.div
              initial={isReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2"
            >
              <a
                href="#filtres-blog"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('filtres-blog');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-amethyste hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-amethyste/50 rounded-lg min-h-[44px] py-2 px-1"
              >
                <span>Voir tous les articles</span>
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: 3D Animated Cards Stack */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative w-full max-w-lg mx-auto lg:max-w-none">
            {/* Screen reader announcement */}
            <div aria-live="polite" className="sr-only">
              {srAnnouncement}
            </div>

            {/* CASE 0: No articles */}
            {count === 0 && (
              <div className="w-full aspect-[16/10] max-h-[360px] rounded-3xl bg-gradient-to-br from-ardoise to-onyx border border-white/10 flex flex-col items-center justify-center p-8 text-center shadow-soft relative overflow-hidden">
                <img
                  src="/assets/logo/logo-blanc.png"
                  alt=""
                  aria-hidden="true"
                  className="w-20 h-20 opacity-20 object-contain mb-4 select-none pointer-events-none"
                />
                <p className="font-body text-sm sm:text-base text-ivoire-violet/75">
                  Les premiers articles arrivent bientôt.
                </p>
              </div>
            )}

            {/* CASE >= 1: The Stack */}
            {count > 0 && (
              <div className="w-full flex flex-col items-center">
                {/* 3D Container */}
                <div
                  ref={deckRef}
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="Articles récents mis en avant"
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={handleMouseLeave}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    perspective: isReducedMotion ? 'none' : '1000px',
                  }}
                  className="relative w-full aspect-[16/10] max-h-[360px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-amethyste/60 rounded-3xl"
                >
                  <div
                    style={{
                      transformStyle: isReducedMotion ? 'flat' : 'preserve-3d',
                      transform: isReducedMotion
                        ? 'none'
                        : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                      transition: isHovered
                        ? 'transform 0.1s ease-out'
                        : 'transform 0.5s ease-out',
                    }}
                    className="relative w-full h-full"
                  >
                    {recentArticles.map((article, idx) => {
                      // Relative position: 0 = front, 1 = middle, 2 = back
                      const relPos = (idx - activeIndex + count) % count;
                      const isTop = relPos === 0;

                      // Visual stacking offsets
                      const yOffset =
                        relPos === 0 ? 0 : relPos === 1 ? 16 : 30;
                      const scale =
                        relPos === 0 ? 1 : relPos === 1 ? 0.94 : 0.88;
                      const zIndex =
                        relPos === 0 ? 30 : relPos === 1 ? 20 : 10;
                      const opacity =
                        relPos === 0 ? 1 : relPos === 1 ? 0.85 : 0.65;
                      const brightness =
                        relPos === 0 ? '100%' : relPos === 1 ? '82%' : '65%';

                      return (
                        <motion.div
                          key={article.id || article.slug}
                          role="group"
                          aria-roledescription="slide"
                          aria-label={`Article ${idx + 1} sur ${count} : ${article.title}`}
                          aria-hidden={!isTop}
                          initial={
                            isReducedMotion
                              ? false
                              : {
                                  opacity: 0,
                                  y: yOffset + 40,
                                  scale: scale * 0.9,
                                }
                          }
                          animate={{
                            y: yOffset,
                            scale,
                            opacity,
                            filter: `brightness(${brightness})`,
                          }}
                          transition={
                            isReducedMotion
                              ? { duration: 0.25 }
                              : {
                                  duration: 0.7,
                                  ease: [0.25, 0.8, 0.25, 1],
                                }
                          }
                          style={{
                            zIndex,
                            transformOrigin: 'bottom center',
                          }}
                          className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-soft-lg bg-onyx transition-shadow duration-300"
                        >
                          <Link
                            to={`/blog/${article.slug}`}
                            tabIndex={isTop ? 0 : -1}
                            className="block relative w-full h-full group"
                          >
                            {/* Image or fallback */}
                            {article.cover_image ? (
                              <img
                                src={article.cover_image}
                                alt={article.cover_image_alt || article.title}
                                loading={isTop ? 'eager' : 'lazy'}
                                fetchPriority={isTop ? 'high' : 'low'}
                                draggable={false}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none select-none"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-ardoise to-onyx flex items-center justify-center relative">
                                <img
                                  src="/assets/logo/logo-blanc.png"
                                  alt=""
                                  aria-hidden="true"
                                  className="w-16 h-16 opacity-20 object-contain select-none pointer-events-none"
                                />
                              </div>
                            )}

                            {/* Rubrique pill (top left) */}
                            <div className="absolute top-4 left-4 z-20">
                              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-onyx/85 backdrop-blur-md text-amethyste border border-amethyste/40 shadow-sm">
                                {getRubriqueName(article.rubrique) ||
                                  'Identité Visuelle'}
                              </span>
                            </div>

                            {/* Gradient backdrop for WCAG AA readability */}
                            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-onyx via-onyx/85 to-transparent z-10 pointer-events-none" />

                            {/* Card content */}
                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 flex flex-col justify-end space-y-2">
                              {/* Date & Reading time */}
                              <div className="flex items-center gap-3 text-xs text-ivoire-violet/75">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-amethyste" />
                                  <span>
                                    {formatDate(
                                      article.published_at || article.created_at
                                    )}
                                  </span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-amethyste" />
                                  <span>
                                    {article.reading_time || 1} min de lecture
                                  </span>
                                </div>
                              </div>

                              {/* Title (Jost bold, not H1/H2) */}
                              <span className="block font-body font-bold text-white text-base sm:text-lg lg:text-xl leading-snug group-hover:text-or-champagne transition-colors line-clamp-2 drop-shadow-sm">
                                {article.title}
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Controls bar (only if count >= 2) */}
                {count >= 2 && (
                  <div className="flex items-center justify-between w-full mt-4 px-2">
                    {/* Progress dots */}
                    <div
                      role="tablist"
                      aria-label="Sélection d'article"
                      className="flex items-center gap-2"
                    >
                      {recentArticles.map((art, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                          <button
                            key={art.id || art.slug}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-label={`Article ${idx + 1} : ${art.title}`}
                            onClick={() => selectIndex(idx)}
                            className="relative h-2 rounded-full transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-amethyste"
                            style={{
                              width: isActive ? '32px' : '8px',
                              backgroundColor: 'rgba(248, 245, 255, 0.2)',
                            }}
                          >
                            {isActive && (
                              <motion.div
                                initial={{ width: '0%' }}
                                animate={{
                                  width:
                                    isPlaying &&
                                    !isHovered &&
                                    !isFocused &&
                                    !hasManuallyInteracted
                                      ? '100%'
                                      : '100%',
                                }}
                                transition={{
                                  duration:
                                    isPlaying &&
                                    !isHovered &&
                                    !isFocused &&
                                    !hasManuallyInteracted
                                      ? 5
                                      : 0.3,
                                  ease: 'linear',
                                }}
                                className="h-full bg-amethyste rounded-full"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation buttons: Play/Pause, Prev, Next */}
                    <div className="flex items-center gap-1.5">
                      {/* Play / Pause button */}
                      <button
                        type="button"
                        onClick={togglePlayPause}
                        aria-label={
                          isPlaying
                            ? "Mettre en pause l'animation des articles"
                            : "Reprendre l'animation des articles"
                        }
                        className="p-2 rounded-full text-ivoire-violet/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amethyste"
                      >
                        {isPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Prev */}
                      <button
                        type="button"
                        onClick={() => goToPrev(true)}
                        aria-label="Article précédent"
                        className="p-2 rounded-full text-ivoire-violet/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amethyste"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Next */}
                      <button
                        type="button"
                        onClick={() => goToNext(true)}
                        aria-label="Article suivant"
                        className="p-2 rounded-full text-ivoire-violet/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amethyste"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
