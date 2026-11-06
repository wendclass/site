import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RhythmDotsAnimationProps {
  dotsPerWeek: 2 | 4; // 2 for Presence Continue (8 total), 4 for Croissance Acceleree (16 total)
  label: string;
  accentColor?: string;
}

export const RhythmDotsAnimation: React.FC<RhythmDotsAnimationProps> = ({
  dotsPerWeek,
  label,
  accentColor = '#6600CC'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [filledCount, setFilledCount] = useState<number>(prefersReducedMotion ? dotsPerWeek * 4 : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setFilledCount(dotsPerWeek * 4);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Animate fill one by one
          let current = 0;
          const total = dotsPerWeek * 4;
          const interval = setInterval(() => {
            current++;
            setFilledCount(current);
            if (current >= total) {
              clearInterval(interval);
            }
          }, 80);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [dotsPerWeek, prefersReducedMotion]);

  const totalDots = dotsPerWeek * 4;

  return (
    <div
      ref={containerRef}
      className="p-4 rounded-2xl bg-ivoire-violet/80 border border-violet-imperial/10 space-y-3 font-body"
      aria-label={`Rythme mensuel : ${totalDots} visuels répartis sur 4 semaines (${dotsPerWeek} par semaine)`}
    >
      <div className="flex items-center justify-between text-xs text-onyx/70 font-medium">
        <span className="uppercase tracking-wider font-semibold text-violet-imperial">
          Rythme mensuel
        </span>
        <span className="font-semibold text-onyx">
          {totalDots} visuels ({dotsPerWeek}/semaine)
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-1">
        {[1, 2, 3, 4].map((week) => (
          <div key={week} className="space-y-1.5 text-center">
            <span className="text-[11px] font-semibold text-onyx/50 uppercase block">
              S{week}
            </span>
            <div className={`grid ${dotsPerWeek === 4 ? 'grid-cols-2' : 'grid-cols-2'} gap-1.5 justify-items-center bg-white p-1.5 rounded-xl border border-violet-imperial/10 shadow-xs`}>
              {Array.from({ length: dotsPerWeek }).map((_, dotIdx) => {
                const globalIndex = (week - 1) * dotsPerWeek + dotIdx + 1;
                const isFilled = globalIndex <= filledCount;
                return (
                  <div
                    key={dotIdx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      isFilled
                        ? 'scale-100 shadow-xs'
                        : 'bg-onyx/10 scale-90'
                    }`}
                    style={{
                      backgroundColor: isFilled ? accentColor : undefined
                    }}
                    title={`Publication ${globalIndex}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[12px] text-onyx/65 text-center italic">
        {label}
      </p>
    </div>
  );
};
