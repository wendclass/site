import React, { useState } from 'react';
import { ChevronDown, Check, Minus } from 'lucide-react';
import { ComparisonRow } from '../../data/offres';

interface ComparisonMatrixProps {
  id: string;
  title: string;
  headers: { id: string; label: string }[];
  rows: ComparisonRow[];
  isDark?: boolean;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  id,
  title,
  headers,
  rows,
  isDark = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMobileFormula, setSelectedMobileFormula] = useState(headers[0].id);

  const totalCriteria = rows.length;

  return (
    <div className="pt-4 font-body">
      {/* Unfold button */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`matrix-${id}`}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-violet-imperial focus:ring-offset-2 ${
            isDark
              ? 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
              : 'bg-white hover:bg-ivoire-violet text-violet-imperial border border-violet-imperial/20 shadow-soft'
          }`}
        >
          <span>
            {isOpen
              ? `Masquer le tableau comparatif (${totalCriteria} critères)`
              : `Comparer en détail (${totalCriteria} critères)`}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Unfolded Content */}
      <div
        id={`matrix-${id}`}
        hidden={!isOpen}
        className={`mt-6 rounded-3xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'block' : 'hidden'
        } ${
          isDark
            ? 'bg-white/5 border border-white/15'
            : 'bg-white border border-violet-imperial/15 shadow-soft'
        }`}
      >
        {/* DESKTOP VIEW: Semantic HTML table with sticky headers */}
        <div className="hidden md:block overflow-x-auto max-h-[640px] relative">
          <table className="w-full text-left border-collapse">
            <caption className="sr-only">
              {title} — Comparaison détaillée des formules selon {totalCriteria} critères
            </caption>
            <thead className={`sticky top-0 z-10 backdrop-blur-md ${isDark ? 'bg-onyx/90 border-b border-white/10' : 'bg-white/95 border-b border-violet-imperial/15'}`}>
              <tr>
                <th
                  scope="col"
                  className={`p-4 sm:p-5 text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-white/60' : 'text-onyx/60'
                  }`}
                >
                  Critères de comparaison
                </th>
                {headers.map((h) => (
                  <th
                    key={h.id}
                    scope="col"
                    className={`p-4 sm:p-5 text-sm sm:text-base font-bold font-title text-center ${
                      isDark ? 'text-or-champagne' : 'text-violet-imperial'
                    }`}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-imperial/5">
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isDark
                      ? 'hover:bg-white/5 border-b border-white/5'
                      : 'hover:bg-ivoire-violet/50 border-b border-violet-imperial/5'
                  }`}
                >
                  <th
                    scope="row"
                    className={`p-4 sm:p-4.5 text-xs sm:text-sm font-medium ${
                      isDark ? 'text-white/85' : 'text-onyx/85'
                    }`}
                  >
                    {row.label}
                  </th>
                  {headers.map((h) => {
                    const val = row.values[h.id];
                    return (
                      <td key={h.id} className="p-4 sm:p-4.5 text-xs sm:text-sm text-center">
                        {val === true ? (
                          <span className="inline-flex items-center justify-center gap-1 text-emerald-600 font-bold">
                            <Check className="w-4 h-4 stroke-[2.5]" />
                            <span className="sr-only">Inclus</span>
                          </span>
                        ) : val === false || val === undefined ? (
                          <span className={`${isDark ? 'text-white/20' : 'text-onyx/20'} font-bold`}>
                            <Minus className="w-3.5 h-3.5 mx-auto" />
                            <span className="sr-only">Non inclus</span>
                          </span>
                        ) : (
                          <span className={`font-semibold ${isDark ? 'text-white/90' : 'text-onyx/90'}`}>
                            {val}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW: Formula tabs + vertical feature list (NO horizontal scroll) */}
        <div className="block md:hidden p-4 sm:p-5 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-onyx/50 pb-1">
            Sélectionnez une formule pour voir ses détails :
          </div>
          {/* Formula short tabs */}
          <div className="flex flex-wrap gap-2">
            {headers.map((h) => {
              const isActive = selectedMobileFormula === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedMobileFormula(h.id)}
                  aria-pressed={isActive}
                  className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-center ${
                    isActive
                      ? isDark
                        ? 'bg-or-champagne text-onyx shadow-sm'
                        : 'bg-violet-imperial text-white shadow-sm'
                      : isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-ivoire-violet text-onyx/80 hover:bg-violet-imperial/10'
                  }`}
                >
                  {h.label}
                </button>
              );
            })}
          </div>

          {/* List of items for selected formula */}
          <div className="space-y-2.5 pt-2">
            {rows.map((row, idx) => {
              const val = row.values[selectedMobileFormula];
              const isIncluded = val !== false && val !== undefined;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl flex items-start justify-between gap-3 text-xs sm:text-sm ${
                    isIncluded
                      ? isDark
                        ? 'bg-white/10 border border-white/10 text-white'
                        : 'bg-ivoire-violet/80 border border-violet-imperial/10 text-onyx'
                      : isDark
                      ? 'bg-white/5 opacity-50 text-white/50'
                      : 'bg-onyx/5 opacity-50 text-onyx/40'
                  }`}
                >
                  <span className="font-medium flex-1 leading-snug">
                    {row.label}
                  </span>
                  <div className="shrink-0 font-semibold text-right">
                    {val === true ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Inclus</span>
                      </span>
                    ) : val === false || val === undefined ? (
                      <span className="inline-flex items-center gap-1">
                        <Minus className="w-3.5 h-3.5" />
                        <span>Non inclus</span>
                      </span>
                    ) : (
                      <span className={isDark ? 'text-or-champagne' : 'text-violet-imperial'}>
                        {val}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
