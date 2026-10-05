import React from 'react';
import { Sparkles, Check, ArrowUpRight, Clock } from 'lucide-react';
import { offersData } from '../data/offres';
import { Accordion } from '../components/ui/Accordion';
import { CtaButton } from '../components/ui/CtaButton';
import { FaqSection } from '../components/sections/FaqSection';

export const Offres: React.FC = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
            Nos formules d'accompagnement
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight">
            Des formules conçues pour faire grandir votre activité
          </h1>

          <p className="text-base sm:text-lg text-onyx/75 font-body leading-relaxed">
            Chaque offre est calibrée pour apporter une réponse graphique stratégique à un besoin précis. 
            Aucun tarif générique : chaque collaboration fait l’objet d’un échange préalable pour adapter le dispositif à vos objectifs.
          </p>
        </div>

        {/* Global Highlight Promise for Brand Identity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-imperial/10 via-white to-or-champagne/10 border border-violet-imperial/20 shadow-soft text-center max-w-4xl mx-auto">
          <p className="text-lg sm:text-xl font-title font-medium text-onyx italic leading-relaxed">
            « Chaque élément de votre identité sera construit pour qu'elle s'impose dans votre marché et ne se noie pas parmi vos concurrents. »
          </p>
          <span className="text-xs text-violet-imperial font-semibold uppercase tracking-wider mt-2 block font-body">
            — Engagement de conception Class S
          </span>
        </div>

        {/* The 5 Offer Cards */}
        <div className="space-y-8">
          {offersData.map((offer) => {
            // Case 1: Communication Événementielle (Famille 4 - Aucun détail, sur devis)
            if (offer.isCustomQuoteOnly) {
              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl p-6 sm:p-10 border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-or-champagne uppercase tracking-widest font-body">
                          {offer.number}
                        </span>
                        <span className="px-3 py-0.5 rounded-full bg-or-champagne/15 text-[#8A5E2E] border border-or-champagne/30 text-xs font-semibold uppercase tracking-wider">
                          Sur devis personnalisé
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
                        {offer.title}
                      </h2>

                      <p className="text-sm sm:text-base text-onyx/75 font-body leading-relaxed">
                        {offer.subtitle}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <CtaButton
                        to="/#contact"
                        variant="champagne"
                        size="md"
                        icon={<ArrowUpRight className="w-4 h-4" />}
                      >
                        {offer.ctaText}
                      </CtaButton>
                    </div>
                  </div>
                </div>
              );
            }

            // Case 2: Visuels à l'unité (Famille 5 - Single line with 24h guarantee)
            if (offer.isSingleLine) {
              return (
                <div
                  key={offer.id}
                  className="bg-onyx text-ivoire-violet rounded-3xl p-6 sm:p-8 border border-white/15 shadow-soft-lg relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-amethyste uppercase tracking-widest font-body">
                          {offer.number}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-or-champagne/20 text-or-champagne border border-or-champagne/30 text-xs font-semibold uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          {offer.deliveryTime}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-title font-semibold text-white">
                        {offer.title}
                      </h2>

                      <p className="text-sm text-ivoire-violet/80 font-body leading-relaxed">
                        {offer.subtitle}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <CtaButton
                        to="/#contact"
                        variant="champagne"
                        size="md"
                        icon={<ArrowUpRight className="w-4 h-4" />}
                      >
                        {offer.ctaText}
                      </CtaButton>
                    </div>
                  </div>
                </div>
              );
            }

            // Case 3: Standard Families (1, 2, 3) - 3 Highlighted details + Accordion
            return (
              <div
                key={offer.id}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 space-y-6"
              >
                {/* Header of offer */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-violet-imperial/10 pb-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-or-champagne uppercase tracking-widest font-body">
                        Formule {offer.number}
                      </span>
                      {offer.badge && (
                        <span className="px-3 py-0.5 rounded-full bg-violet-imperial/10 text-violet-imperial border border-violet-imperial/20 text-xs font-semibold uppercase tracking-wider">
                          {offer.badge}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-semibold text-onyx">
                      {offer.title}
                    </h2>

                    <p className="text-sm sm:text-base text-onyx/75 font-body leading-relaxed">
                      {offer.subtitle}
                    </p>
                  </div>

                  <div className="shrink-0 pt-2">
                    <CtaButton
                      to="/#contact"
                      variant="primary"
                      size="md"
                      icon={<ArrowUpRight className="w-4 h-4" />}
                    >
                      {offer.ctaText}
                    </CtaButton>
                  </div>
                </div>

                {/* 3 Highlighted details */}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-imperial block font-body">
                    Ce qui fait la différence dans cette formule :
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {offer.highlightDetails.map((detail, idx) => (
                      <div
                        key={idx}
                        className="bg-ivoire-violet/60 p-4 rounded-2xl border border-violet-imperial/10 flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-violet-imperial/15 text-violet-imperial flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs sm:text-sm text-onyx/85 font-body leading-relaxed">
                          {detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accordion for additional deliverables */}
                {offer.accordionDetails && offer.accordionDetails.length > 0 && (
                  <Accordion
                    title="Voir tous les livrables & détails inclus dans cette offre"
                    id={`accordion-${offer.id}`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {offer.accordionDetails[0].items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <span className="text-amethyste font-bold">•</span>
                          <span className="text-xs sm:text-sm text-onyx/80 font-body">{item}</span>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                )}
              </div>
            );
          })}
        </div>

        {/* Integrated FAQ */}
        <FaqSection />

        {/* Bottom Contact Anchor Reminder */}
        <div className="text-center bg-white p-8 rounded-3xl border border-violet-imperial/15 shadow-soft space-y-4">
          <h3 className="text-2xl font-title font-semibold text-onyx">
            Une question sur la formule la plus adaptée à votre situation ?
          </h3>
          <p className="text-sm text-onyx/75 font-body max-w-xl mx-auto">
            Remplissez le court formulaire de contact : je prendrai le temps d'analyser vos besoins et de vous conseiller la meilleure direction.
          </p>
          <div className="pt-2">
            <CtaButton to="/#contact" variant="champagne" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
              Discuter de mon projet sans engagement
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  );
};
