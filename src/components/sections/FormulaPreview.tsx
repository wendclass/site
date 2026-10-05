import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers, Share2, Calendar, Globe, Zap } from 'lucide-react';
import { offersData } from '../../data/offres';

export const FormulaPreview: React.FC = () => {
  const icons = [Layers, Share2, Globe, Calendar, Zap];

  return (
    <section className="py-20 bg-white relative overflow-hidden border-y border-violet-imperial/10">
      {/* Background soft glow */}
      <div className="absolute -top-24 right-0 w-80 h-80 bg-amethyste/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
              Solutions sur mesure
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx">
              Aperçu des formules
            </h2>
            <p className="mt-3 text-base sm:text-lg text-onyx/75 font-body">
              Chaque formule est construite autour d’un seul objectif : maximiser l’impact commercial de votre activité.
            </p>
          </div>

          <Link
            to="/offres"
            className="inline-flex items-center gap-2 text-violet-imperial font-semibold hover:text-[#7818e8] group text-sm sm:text-base font-body"
          >
            <span>Découvrir toutes les offres en détail</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offersData.map((offer, idx) => {
            const IconComponent = icons[idx % icons.length];
            return (
              <div
                key={offer.id}
                className="group relative bg-ivoire-violet rounded-3xl p-7 border border-violet-imperial/10 hover:border-violet-imperial/30 hover:shadow-soft transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-violet-imperial/15 flex items-center justify-center text-violet-imperial group-hover:scale-105 transition-transform">
                      <IconComponent className="w-6 h-6 text-violet-imperial" />
                    </div>
                    <span className="text-xs font-bold text-or-champagne tracking-widest uppercase">
                      {offer.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-title font-semibold text-onyx mb-2 group-hover:text-violet-imperial transition-colors">
                    {offer.title}
                  </h3>

                  <p className="text-sm text-onyx/75 leading-relaxed font-body mb-6">
                    {offer.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-violet-imperial/10 flex items-center justify-between">
                  <Link
                    to="/offres"
                    className="text-xs font-semibold uppercase tracking-wider text-violet-imperial inline-flex items-center gap-1.5 group-hover:underline underline-offset-4"
                  >
                    <span>Voir le détail</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  {offer.deliveryTime && (
                    <span className="text-[11px] font-semibold text-or-champagne bg-or-champagne/10 px-2.5 py-1 rounded-full border border-or-champagne/20">
                      {offer.deliveryTime}
                    </span>
                  )}
                  {offer.badge && (
                    <span className="text-[11px] font-semibold text-violet-imperial bg-violet-imperial/10 px-2.5 py-1 rounded-full border border-violet-imperial/20">
                      {offer.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
