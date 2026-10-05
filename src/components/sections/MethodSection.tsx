import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Eye, Target, ArrowRight } from 'lucide-react';
import { CtaButton } from '../ui/CtaButton';

interface MethodStep {
  id: number;
  number: string;
  verb: string;
  title: string;
  description: string;
  details: string;
  icon: React.ElementType;
  previewImage: string;
  previewTag: string;
}

const STEPS: MethodStep[] = [
  {
    id: 1,
    number: '01',
    verb: 'Comprendre',
    title: 'Comprendre le but du client à travers le visuel',
    description: 'Avant de tracer la moindre ligne, nous identifions précisément ce que cette image doit accomplir pour votre entreprise (attirer, rassurer, vendre, faire mémoriser).',
    details: 'Un visuel sans intention commerciale claire est juste une dépense. Notre échange initial permet de cadrer l’objectif précis et le profil de votre client idéal.',
    icon: Compass,
    previewImage: '/assets/projets/bang/Présentation_bang_logo.png',
    previewTag: 'Phase Stratégique • Cadrage'
  },
  {
    id: 2,
    number: '02',
    verb: 'Définir',
    title: 'Définir le schéma idéal de ce que le public doit faire en voyant le visuel',
    description: 'Nous modélisons le parcours mental de la personne qui regarde votre visuel : quel est le premier élément qu’elle doit lire ? Quelle émotion doit-elle ressentir ? Quel bouton ou numéro doit-elle composer ?',
    details: 'La hiérarchie visuelle est calculée pour diriger le regard en quelques fractions de seconde vers l’action attendue.',
    icon: Target,
    previewImage: '/assets/projets/72h-cj-2026/Carrousel 0 72h 2026.png',
    previewTag: 'Architecture Visuelle • Conversion'
  },
  {
    id: 3,
    number: '03',
    verb: 'Capter',
    title: 'Veille et création d’accroches qui captivent et poussent à l’action',
    description: 'Veille approfondie sur l’univers du client pour dénicher les images, éléments graphiques distinctifs et surtout les accroches textuelles qui stoppent le scroll.',
    details: 'L’esthétique sert de crochet, le message fait la vente. Chaque composition graphique finale s’impose face à la concurrence.',
    icon: Eye,
    previewImage: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Visuel_Principal.jpg',
    previewTag: 'Production & Direction Artistique'
  }
];

export const MethodSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const currentStepData = STEPS.find((s) => s.id === activeStep) || STEPS[0];

  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-violet-imperial/10">
      {/* Subtle ambient light */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-violet-imperial/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
            Méthode de conception
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight">
            Une réflexion en 3 temps avant chaque coup de crayon
          </h2>

          <p className="mt-4 text-base sm:text-lg text-onyx/75 font-body leading-relaxed">
            Ce n’est pas le hasard qui rend une image percutante : c’est une méthode structurée pour que chaque élément visuel devienne un levier de vente.
          </p>
        </div>

        {/* 2-Column Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Steps Selection */}
          <div className="lg:col-span-6 space-y-4">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              const IconComp = step.icon;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-ivoire-violet border-violet-imperial/40 shadow-soft ring-1 ring-violet-imperial/20'
                      : 'bg-white border-violet-imperial/10 hover:border-violet-imperial/25 hover:bg-ivoire-violet/30'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveStep(step.id);
                    }
                  }}
                  aria-pressed={isActive}
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    {/* Big Numeral */}
                    <span
                      className={`text-3xl sm:text-4xl font-title font-bold leading-none transition-colors ${
                        isActive ? 'text-violet-imperial' : 'text-onyx/25'
                      }`}
                    >
                      {step.number}
                    </span>

                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComp
                            className={`w-4 h-4 ${
                              isActive ? 'text-violet-imperial' : 'text-onyx/40'
                            }`}
                          />
                          <span
                            className={`text-xs font-bold uppercase tracking-wider font-body ${
                              isActive ? 'text-violet-imperial' : 'text-onyx/60'
                            }`}
                          >
                            Étape {step.id} — {step.verb}
                          </span>
                        </div>

                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-violet-imperial animate-ping" />
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-title font-semibold text-onyx">
                        {step.title}
                      </h3>

                      <p className="text-sm text-onyx/75 font-body leading-relaxed">
                        {step.description}
                      </p>

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-2 text-xs text-onyx/65 font-body border-t border-violet-imperial/10 mt-3"
                        >
                          {step.details}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Stage Showcase */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative bg-onyx rounded-3xl p-4 sm:p-6 border border-white/15 shadow-soft-lg overflow-hidden text-white">
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs text-ivoire-violet/70">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amethyste" />
                  <span className="text-or-champagne font-semibold uppercase tracking-wider text-[11px]">
                    {currentStepData.previewTag}
                  </span>
                </div>
                <span className="text-[11px] text-white/50 font-body">
                  Étape {currentStepData.number} / 03
                </span>
              </div>

              {/* Dynamic Image with Smooth Crossfade */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-onyx/80">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentStepData.id}
                    src={currentStepData.previewImage}
                    alt={currentStepData.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.45 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent opacity-60" />
              </div>

              {/* Bottom Insight Card */}
              <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amethyste text-xs font-semibold uppercase tracking-wider font-body">
                  <Target className="w-3.5 h-3.5" />
                  <span>Résultat de l’étape {currentStepData.number}</span>
                </div>
                <p className="text-xs sm:text-sm text-ivoire-violet/85 font-body leading-relaxed">
                  {currentStepData.title}
                </p>
              </div>

              {/* Action Bridge */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs border-t border-white/10">
                <span className="text-white/60">Prêt à appliquer cette méthode à votre image ?</span>
                <CtaButton
                  to="/#contact"
                  variant="champagne"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Démarrer
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
