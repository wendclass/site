import React from 'react';
import { XCircle, CheckCircle2, Sparkles, ArrowUpRight, TrendingUp, AlertOctagon } from 'lucide-react';
import { CtaButton } from '../ui/CtaButton';

export const ContrastSection: React.FC = () => {
  const amateurPoints = [
    'Le visiteur passe quelques secondes sur vos visuels, puis s’en va.',
    'Vous ressemblez à vos concurrents, vous perdez en crédibilité.',
    'Votre offre paraît confuse, le prospect hésite.',
    'À offre égale, le prospect choisit celui qui a su se montrer sérieux.'
  ];

  const classSPoints = [
    'Le visiteur s’arrête, comprend, vous fait confiance avant même de vous contacter.',
    'Votre image s’impose, elle ne se noie plus parmi vos concurrents.',
    'Votre offre devient évidente, vous vendez plus.',
    'Face à un concurrent à l’image amateur, c’est vous qu’on retient.'
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-ivoire-violet to-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-violet-imperial/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
            L'impact commercial d'une vraie image
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight">
            Pourquoi votre image décide de vos ventes
          </h2>

          <p className="text-base sm:text-lg text-onyx/75 font-body leading-relaxed">
            Votre public vous juge en moins de 3 secondes. Deux entreprises offrant le même service n'obtiendront jamais les mêmes résultats si leur image n'inspire pas le même niveau de sérieux.
          </p>
        </div>

        {/* The 2-Column High Contrast Battle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Column 1: Image Amateur (Dark Slate, Dimmed, Friction) */}
          <div className="bg-ardoise rounded-3xl p-8 sm:p-10 text-ivoire-violet flex flex-col justify-between border border-white/10 shadow-soft-lg relative overflow-hidden group">
            {/* Top Tag */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5 text-red-300 font-semibold text-xs uppercase tracking-wider font-body">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  <span>Sans stratégie de marque</span>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/10 text-white/70 px-2.5 py-0.5 rounded-full font-body">
                  Image amateur
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-title font-semibold text-white leading-snug">
                Ce qui se passe quand votre image est négligée :
              </h3>

              {/* Points */}
              <ul className="space-y-4 pt-2">
                {amateurPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-ivoire-violet/75 font-body leading-relaxed">
                    <XCircle className="w-5 h-5 text-red-400/80 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Status */}
            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-ivoire-violet/50 font-body flex items-center justify-between">
              <span>Résultat : Perte de clients invisibles</span>
              <span className="text-red-300/80 font-medium">Faible conversion</span>
            </div>
          </div>

          {/* Column 2: Image Class S (Light Ivory Violet, Imperial Violet, High Impact) */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 text-onyx flex flex-col justify-between border-2 border-violet-imperial shadow-soft-lg ring-4 ring-violet-imperial/10 relative overflow-hidden group">
            {/* Corner Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-or-champagne to-amethyste text-onyx font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl font-body shadow-sm">
              Standard Class S
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-violet-imperial/10">
                <div className="flex items-center gap-2.5 text-violet-imperial font-bold text-xs uppercase tracking-wider font-body">
                  <TrendingUp className="w-4 h-4 text-violet-imperial" />
                  <span>Avec l'identité Class S</span>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-violet-imperial/10 text-violet-imperial px-2.5 py-0.5 rounded-full font-body">
                  Image qui fait vendre
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-title font-semibold text-onyx leading-snug">
                Ce qui se passe quand chaque visuel est pensé :
              </h3>

              {/* Points */}
              <ul className="space-y-4 pt-2">
                {classSPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-onyx/90 font-medium font-body leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-violet-imperial shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom CTA Bridge */}
            <div className="mt-8 pt-6 border-t border-violet-imperial/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-onyx/70 font-body">
                <strong className="text-violet-imperial font-semibold">Résultat direct :</strong> Plus de prises de contact qualifiées
              </div>
              <CtaButton
                to="/#contact"
                variant="primary"
                size="sm"
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                Passer au standard Class S
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
