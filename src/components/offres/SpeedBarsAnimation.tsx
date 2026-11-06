import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Zap, Clock } from 'lucide-react';

export const SpeedBarsAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [inView, setInView] = useState<boolean>(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5 font-body"
      aria-label="Comparaison de délai d'exécution : cycle court et réactif avec Class S face aux délais longs du marché"
    >
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="uppercase tracking-wider font-semibold text-or-champagne flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-or-champagne" />
          Réactivité & Vitesse de livraison
        </span>
        <span className="text-white/60">Sans compromis sur la qualité</span>
      </div>

      <div className="space-y-4">
        {/* Barre 1 : Le marché conventionnel (long & lent) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-white/80">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span>Pratiques habituelles du marché</span>
            </span>
            <span className="text-white/50 text-[11px]">Délais longs, allers-retours dispersés</span>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/30 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: inView ? '95%' : '0%',
                transitionDuration: prefersReducedMotion ? '0ms' : '1200ms'
              }}
            />
          </div>
        </div>

        {/* Barre 2 : Avec Class S (court & rapide) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-white font-medium">
            <span className="flex items-center gap-1.5 text-or-champagne">
              <Zap className="w-3.5 h-3.5 text-or-champagne fill-or-champagne" />
              <span className="font-semibold">Avec Class S</span>
            </span>
            <span className="text-or-champagne font-semibold text-[11px]">Livré en quelques jours</span>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-imperial via-amethyste to-or-champagne rounded-full transition-all duration-700 ease-out"
              style={{
                width: inView ? '32%' : '0%',
                transitionDuration: prefersReducedMotion ? '0ms' : '700ms'
              }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-white/65 italic pt-1">
        Une méthode de conception agile éprouvée : vous commencez à convertir vos visiteurs sans attendre des semaines.
      </p>
    </div>
  );
};
