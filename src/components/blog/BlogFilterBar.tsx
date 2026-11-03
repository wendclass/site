import React, { useRef, useEffect } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { RUBRIQUES, RubriqueConfig } from '../../config/rubriques';

interface BlogFilterBarProps {
  selectedRubrique: string; // 'tous' or rubrique slug
  onSelectRubrique: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  rubriqueCounts: Record<string, number>;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
}

export const BlogFilterBar: React.FC<BlogFilterBarProps> = ({
  selectedRubrique,
  onSelectRubrique,
  searchQuery,
  onSearchChange,
  rubriqueCounts,
  totalCount,
  filteredCount,
  onResetFilters,
}) => {
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement>(null);

  // Auto-center active pill on mobile when it changes
  useEffect(() => {
    if (activePillRef.current && pillsContainerRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedRubrique]);

  // Only show rubriques that have at least 1 article
  const availableRubriques = RUBRIQUES.filter(
    (rub) => (rubriqueCounts[rub.slug] || 0) > 0
  );

  const hasActiveFilters = selectedRubrique !== 'tous' || searchQuery.trim().length > 0;

  const currentRubriqueName =
    selectedRubrique === 'tous'
      ? 'Tous'
      : RUBRIQUES.find((r) => r.slug === selectedRubrique)?.name || selectedRubrique;

  return (
    <div id="filtres-blog" className="w-full space-y-4">
      {/* Sticky Bar on Desktop/Tablet, Static on Mobile */}
      <div className="relative static md:sticky md:top-20 z-20 backdrop-blur-md bg-onyx/90 border-y border-white/5 py-3 transition-colors shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            {/* Rubrique Pills with Scroll-Snap & Faded Edges */}
            <div className="relative flex-1 min-w-0">
              {/* Left edge shadow gradient */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-onyx to-transparent pointer-events-none z-10 md:hidden"
              />
              {/* Right edge shadow gradient */}
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-onyx to-transparent pointer-events-none z-10 md:hidden"
              />

              {/* Horizontal pills container */}
              <div
                ref={pillsContainerRef}
                role="tablist"
                aria-label="Filtrer les articles par rubrique"
                className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 px-1 scrollbar-none"
              >
                {/* Pill: Tous */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedRubrique === 'tous'}
                  ref={selectedRubrique === 'tous' ? activePillRef : null}
                  onClick={() => onSelectRubrique('tous')}
                  className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap snap-center transition-all duration-200 shrink-0 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amethyste/60 ${
                    selectedRubrique === 'tous'
                      ? 'bg-amethyste text-onyx shadow-glow font-bold'
                      : 'bg-white/5 text-ivoire-violet/75 border border-white/10 hover:text-white hover:border-amethyste/40'
                  }`}
                >
                  <span>Tous</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                      selectedRubrique === 'tous'
                        ? 'bg-onyx/20 text-onyx font-bold'
                        : 'bg-white/10 text-ivoire-violet/60'
                    }`}
                  >
                    {totalCount}
                  </span>
                </button>

                {/* Specific Rubriques */}
                {availableRubriques.map((rub: RubriqueConfig) => {
                  const isActive = selectedRubrique === rub.slug;
                  const count = rubriqueCounts[rub.slug] || 0;

                  return (
                    <button
                      key={rub.slug}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      ref={isActive ? activePillRef : null}
                      onClick={() =>
                        onSelectRubrique(isActive ? 'tous' : rub.slug)
                      }
                      className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap snap-center transition-all duration-200 shrink-0 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amethyste/60 ${
                        isActive
                          ? 'bg-amethyste text-onyx shadow-glow font-bold'
                          : 'bg-white/5 text-ivoire-violet/75 border border-white/10 hover:text-white hover:border-amethyste/40'
                      }`}
                    >
                      <span>{rub.name}</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-onyx/20 text-onyx font-bold'
                            : 'bg-white/10 text-ivoire-violet/60'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <label htmlFor="blog-search-input" className="sr-only">
                Rechercher un article
              </label>
              <Search
                aria-hidden="true"
                className="w-4 h-4 text-ivoire-violet/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                id="blog-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher un article..."
                className="min-h-[44px] w-full pl-10 pr-9 py-2.5 rounded-2xl bg-black/50 border border-white/10 text-xs sm:text-sm text-white placeholder-ivoire-violet/40 focus:outline-none focus:border-amethyste focus:ring-1 focus:ring-amethyste transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-ivoire-violet/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary Bar & Active Filter Chips */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ivoire-violet/60 pt-1">
          {/* Count and Screen reader live announcement */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ivoire-violet/90">
              {filteredCount === 0
                ? 'Aucun article'
                : filteredCount === 1
                ? '1 article'
                : `${filteredCount} articles`}
            </span>

            {/* Polite screen reader live region */}
            <div aria-live="polite" className="sr-only">
              {`${filteredCount} articles trouvés`}
            </div>
          </div>

          {/* Active filter chips & reset */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Active Rubrique chip */}
              {selectedRubrique !== 'tous' && (
                <button
                  type="button"
                  onClick={() => onSelectRubrique('tous')}
                  aria-label={`Retirer le filtre rubrique ${currentRubriqueName}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amethyste/20 text-amethyste border border-amethyste/30 hover:bg-amethyste/30 transition-colors text-xs font-medium"
                >
                  <span>Rubrique : {currentRubriqueName}</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Active Query chip */}
              {searchQuery.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label={`Retirer la recherche "${searchQuery}"`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-ivoire-violet border border-white/15 hover:bg-white/20 transition-colors text-xs font-medium"
                >
                  <span>Recherche : « {searchQuery} »</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Reset All */}
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-xs text-or-champagne hover:text-amethyste transition-colors ml-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
