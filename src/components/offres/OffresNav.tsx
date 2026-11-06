import React, { useEffect, useState } from 'react';
import { offerFamilies } from '../../data/offres';

interface OffresNavProps {
  onNavClick: (anchorId: string) => void;
}

export const OffresNav: React.FC<OffresNavProps> = ({ onNavClick }) => {
  const [activeAnchor, setActiveAnchor] = useState<string>(offerFamilies[0].anchorId);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220; // Offset for sticky header & nav
      for (let i = offerFamilies.length - 1; i >= 0; i--) {
        const el = document.getElementById(offerFamilies[i].anchorId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveAnchor(offerFamilies[i].anchorId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      aria-label="Navigation des familles d'offres"
      className="md:sticky md:top-20 z-30 transition-all duration-200 py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-violet-imperial/15 shadow-sm md:shadow-soft">
        {/* Mobile: 2 lines grid (flex-wrap), Desktop: 1 single row */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
          {offerFamilies.map((fam) => {
            const isActive = activeAnchor === fam.anchorId;
            return (
              <button
                key={fam.anchorId}
                type="button"
                onClick={() => onNavClick(fam.anchorId)}
                aria-current={isActive ? 'location' : undefined}
                className={`flex-1 min-w-[calc(50%-0.375rem)] md:min-w-0 min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center text-center font-body focus:outline-none focus:ring-2 focus:ring-violet-imperial ${
                  isActive
                    ? 'bg-violet-imperial text-white shadow-sm'
                    : 'bg-ivoire-violet/80 hover:bg-violet-imperial/10 text-onyx hover:text-violet-imperial'
                }`}
              >
                <span>{fam.navLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
