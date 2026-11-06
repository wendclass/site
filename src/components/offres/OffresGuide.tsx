import React from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { GUIDE_SITUATIONS } from '../../data/offres';

interface OffresGuideProps {
  onSelectSituation: (targetId: string) => void;
}

export const OffresGuide: React.FC<OffresGuideProps> = ({ onSelectSituation }) => {
  return (
    <section
      aria-labelledby="guide-heading"
      className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-violet-imperial/15 shadow-soft"
    >
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-imperial/10 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-violet-imperial" />
          Aide au choix
        </div>
        <h2
          id="guide-heading"
          className="text-2xl sm:text-3xl font-title font-semibold text-onyx"
        >
          Quelle offre est faite pour vous ?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-onyx/75 font-body leading-relaxed">
          Sélectionnez la situation qui décrit votre besoin actuel pour accéder directement à la formule adaptée et visualiser ses détails.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {GUIDE_SITUATIONS.map((sit) => (
          <button
            key={sit.id}
            type="button"
            onClick={() => onSelectSituation(sit.targetId)}
            className="group p-4 sm:p-4.5 rounded-2xl bg-ivoire-violet/70 hover:bg-white border border-violet-imperial/10 hover:border-violet-imperial/30 hover:shadow-soft text-left transition-all duration-200 flex items-center justify-between gap-3 min-h-[52px] focus:outline-none focus:ring-2 focus:ring-violet-imperial focus:ring-offset-2"
          >
            <div className="min-w-0">
              <span className="text-xs font-semibold text-violet-imperial uppercase tracking-wide block font-body truncate">
                {sit.category}
              </span>
              <p className="text-sm sm:text-base font-medium text-onyx group-hover:text-violet-imperial transition-colors font-body mt-0.5">
                « {sit.text} »
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white border border-violet-imperial/10 group-hover:border-violet-imperial/30 flex items-center justify-center shrink-0 text-violet-imperial group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
