import React from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { HeroAnimation } from '../components/sections/HeroAnimation';
import { MethodSection } from '../components/sections/MethodSection';
import { ContrastSection } from '../components/sections/ContrastSection';
import { FormulaPreview } from '../components/sections/FormulaPreview';
import { ProjectsProof } from '../components/sections/ProjectsProof';
import { SocialProofWall } from '../components/sections/SocialProofWall';
import { FaqSection } from '../components/sections/FaqSection';
import { ContactForm } from '../components/sections/ContactForm';
import { CtaButton } from '../components/ui/CtaButton';

export const Accueil: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-violet-imperial/10 via-amethyste/10 to-or-champagne/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
                <span>Brand & Graphic Design • Ouagadougou</span>
              </div>

              {/* H1 - Exact text validated */}
              <h1 className="text-[2.2rem] sm:text-5xl lg:text-6xl xl:text-7xl font-title font-semibold text-onyx leading-[1.1] tracking-tight">
                D'une image qui existe à une image qui fait vendre.
              </h1>

              {/* Subtitle - Exact text validated */}
              <p className="text-base sm:text-lg lg:text-xl text-onyx/80 font-normal leading-relaxed font-body max-w-xl mx-auto lg:mx-0">
                Avant chaque projet, je définis ce que vos clients doivent faire, puis je conçois chaque élément pour les y conduire.
              </p>

              {/* CTAs - Responsive and balanced on mobile */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                <CtaButton
                  to="/#contact"
                  variant="primary"
                  size="md"
                  className="!py-3 sm:!py-3.5 sm:!px-8 !text-sm sm:!text-base justify-center"
                  icon={<ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                >
                  Prendre contact
                </CtaButton>
                <CtaButton
                  to="/projets"
                  variant="secondary"
                  size="md"
                  className="!py-3 sm:!py-3.5 sm:!px-8 !text-sm sm:!text-base justify-center"
                >
                  Voir mes réalisations
                </CtaButton>
              </div>

              {/* Guarantees & Social Proof mini bar */}
              <div className="pt-6 border-t border-violet-imperial/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-onyx/70 font-body">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-imperial" />
                  <span>Direction artistique sur mesure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-or-champagne" />
                  <span>Délais d'exécution rapides</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amethyste" />
                  <span>Zéro modèle générique</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Animation */}
            <div className="lg:col-span-6 w-full">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Global Promise Highlight Section */}
      <section className="py-14 bg-onyx text-ivoire-violet relative overflow-hidden border-y border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-semibold tracking-widest text-or-champagne">
            La promesse Class S
          </span>
          <p className="text-xl sm:text-2xl md:text-3xl font-title font-normal text-white leading-relaxed italic">
            « Si vous me confiez votre image, chaque visuel est pensé pour que celui qui le voit prenne contact, et que votre activité vende plus. »
          </p>
          <span className="text-xs text-amethyste font-body block font-medium">
            — Scott Nana, Fondateur de Class S
          </span>
        </div>
      </section>

      {/* 3. Méthode en 3 étapes (Nouveau - Scroll storytelling) */}
      <MethodSection />

      {/* 4. Bloc de contraste Sans / Avec (Nouveau - 2nd moment fort) */}
      <ContrastSection />

      {/* 5. Aperçu des formules (5 cartes compactes sans prix) */}
      <FormulaPreview />

      {/* 6. Preuve par les projets */}
      <ProjectsProof />

      {/* 7. Mur de Témoignages & Preuve Sociale (Nouveau) */}
      <SocialProofWall />

      {/* 8. FAQ en accordéon (Nouveau) */}
      <FaqSection />

      {/* 9. Formulaire de contact (id="contact") */}
      <ContactForm />
    </div>
  );
};
