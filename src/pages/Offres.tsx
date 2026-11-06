import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ArrowUpRight,
  Clock,
  Layers,
  Share2,
  Calendar,
  Globe,
  Zap,
  Info
} from 'lucide-react';
import {
  offerFamilies,
  websiteFormats,
    Formula
} from '../data/offres';
import { OffresGuide } from '../components/offres/OffresGuide';
import { OffresNav } from '../components/offres/OffresNav';
import { RhythmDotsAnimation } from '../components/offres/RhythmDotsAnimation';
import { SpeedBarsAnimation } from '../components/offres/SpeedBarsAnimation';
import { ComparisonMatrix } from '../components/offres/ComparisonMatrix';
import { CtaButton } from '../components/ui/CtaButton';
import { FaqSection } from '../components/sections/FaqSection';
import { useSeo } from '../hooks/useSeo';

export const Offres: React.FC = () => {
  useSeo({
    title: 'Nos Formules & Accompagnement | Class S — Scott Nana',
    description:
      'Découvrez nos 5 familles d’accompagnement stratégique : Logo & Identité Visuelle, Branding Social Media, Communication Événementielle, Sites Web et Visuels 24h à Ouagadougou.',
    canonicalUrl: 'https://www.wendclass.com/offres',
  });

  // State to track formula highlighting when clicking from the guide
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // State for mobile formula tabs (Famille 01 Logo)
  const [mobileLogoTab, setMobileLogoTab] = useState<'essentiel' | 'standard' | 'signature'>('standard');

  // State for website format toggles (Famille 04 Sites Web)
  const [vitrineVariant, setVitrineVariant] = useState<'essentiel' | 'premium'>('essentiel');
  const [multiVariant, setMultiVariant] = useState<'essentiel' | 'premium'>('essentiel');

  // Smooth scroll and temporary highlight helper
  const scrollToTarget = (targetId: string) => {
    // If it's a mobile logo tab, switch tab first
    if (targetId === 'formule-logo-essentiel') setMobileLogoTab('essentiel');
    if (targetId === 'formule-logo-standard') setMobileLogoTab('standard');
    if (targetId === 'formule-logo-signature') setMobileLogoTab('signature');

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(targetId);
      setTimeout(() => {
        setHighlightedId(null);
      }, 2500);
    }
  };

  const familyLogo = offerFamilies.find((f) => f.id === 'logo-identite')!;
  const familySocial = offerFamilies.find((f) => f.id === 'branding-social-media')!;
  const familyEvent = offerFamilies.find((f) => f.id === 'communication-evenementielle')!;
  const familyWeb = offerFamilies.find((f) => f.id === 'sites-web')!;
  const familyPrint = offerFamilies.find((f) => f.id === 'visuels-a-lunite')!;

  const formatVitrine = websiteFormats.find((f) => f.id === 'vitrine')!;
  const formatMulti = websiteFormats.find((f) => f.id === 'multipages')!;

  return (
    <div className="py-10 sm:py-16 overflow-hidden font-body">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* ================================================================= */}
        {/* 1. ENTÊTE COMPACT (TEXTES INCHANGÉS)                              */}
        {/* ================================================================= */}
        <header className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
            Nos formules d'accompagnement
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-title font-semibold text-onyx leading-tight text-balance">
            Des formules conçues pour faire grandir votre activité
          </h1>

          <p className="text-base sm:text-lg text-onyx/75 font-body leading-relaxed text-pretty">
            Chaque offre est calibrée pour apporter une réponse graphique stratégique à un besoin précis. 
            Aucun tarif générique : chaque collaboration fait l’objet d’un échange préalable pour adapter le dispositif à vos objectifs.
          </p>

          {/* Engagement Class S (Textes conservés) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-violet-imperial/10 via-white to-or-champagne/10 border border-violet-imperial/20 shadow-soft text-center mt-6">
            <p className="text-base sm:text-lg lg:text-xl font-title font-medium text-onyx italic leading-relaxed">
              « Chaque élément de votre identité sera construit pour qu'elle s'impose dans votre marché et ne se noie pas parmi vos concurrents. »
            </p>
            <span className="text-xs text-violet-imperial font-semibold uppercase tracking-wider mt-2.5 block font-body">
              — Engagement de conception Class S
            </span>
          </div>
        </header>

        {/* ================================================================= */}
        {/* 2. GUIDE « QUELLE OFFRE POUR VOUS ? »                             */}
        {/* ================================================================= */}
        <OffresGuide onSelectSituation={scrollToTarget} />

        {/* ================================================================= */}
        {/* 3. NAVIGATION PAR ANCRES (5 FAMILLES)                             */}
        {/* ================================================================= */}
        <OffresNav onNavClick={scrollToTarget} />

        {/* ================================================================= */}
        {/* 4. LES 5 FAMILLES D'OFFRES DANS L'ORDRE STRICT                    */}
        {/* ================================================================= */}
        <div className="space-y-20 sm:space-y-28">
          {/* --------------------------------------------------------------- */}
          {/* FAMILLE 01 : LOGO & IDENTITÉ VISUELLE                           */}
          {/* --------------------------------------------------------------- */}
          <section
            id={familyLogo.anchorId}
            aria-labelledby="heading-logo"
            className="scroll-mt-28 space-y-8"
          >
            {/* Header de la famille */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-violet-imperial/10 pb-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-imperial/10 text-violet-imperial flex items-center justify-center font-bold text-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-or-champagne uppercase tracking-widest">
                    Famille {familyLogo.number}
                  </span>
                </div>
                <h2 id="heading-logo" className="text-2xl sm:text-3xl lg:text-4xl font-title font-semibold text-onyx">
                  {familyLogo.title}
                </h2>
                <p className="text-sm sm:text-base text-onyx/75 leading-relaxed font-body">
                  {familyLogo.subtitle}
                </p>
              </div>

              <div className="shrink-0 pt-2">
                <CtaButton
                  to="/#contact?type=logo"
                  variant="primary"
                  size="md"
                  icon={<ArrowUpRight className="w-4 h-4" />}
                >
                  {familyLogo.ctaText}
                </CtaButton>
              </div>
            </div>

            {/* Mobile Tab Selector for Logo Formulas (1 visible at a time on mobile) */}
            <div className="block md:hidden">
              <div className="flex rounded-2xl bg-ivoire-violet p-1.5 border border-violet-imperial/10 mb-4">
                {(['essentiel', 'standard', 'signature'] as const).map((tab) => {
                  const label = tab === 'essentiel' ? 'Essentiel' : tab === 'standard' ? 'Standard' : 'Signature';
                  const isActive = mobileLogoTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMobileLogoTab(tab)}
                      className={`flex-1 min-h-[44px] py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-violet-imperial text-white shadow-sm'
                          : 'text-onyx/70 hover:text-violet-imperial'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cards Grid: 3 columns on Desktop, 1 active card on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {familyLogo.formulas?.map((formula: Formula) => {
                const isMobileVisible =
                  mobileLogoTab === formula.id;
                const isHighlighted = highlightedId === formula.slugAnchor;

                return (
                  <article
                    key={formula.id}
                    id={formula.slugAnchor}
                    className={`scroll-mt-32 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                      !isMobileVisible ? 'hidden md:flex' : 'flex'
                    } ${
                      isHighlighted
                        ? 'ring-2 ring-violet-imperial ring-offset-4 shadow-glow scale-[1.01]'
                        : ''
                    } ${
                      formula.id === 'signature'
                        ? 'bg-gradient-to-b from-white via-white to-or-champagne/10 border-2 border-or-champagne/40 shadow-soft-lg'
                        : formula.id === 'standard'
                        ? 'bg-white border-2 border-violet-imperial/30 shadow-soft'
                        : 'bg-white border border-violet-imperial/15 shadow-xs'
                    }`}
                  >
                    <div className="space-y-5">
                      {/* Badge / Title */}
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl sm:text-2xl font-title font-semibold text-onyx">
                          {formula.name}
                        </h3>
                        {formula.badge && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                              formula.id === 'signature'
                                ? 'bg-or-champagne/15 text-[#8A5E2E] border-or-champagne/30'
                                : 'bg-violet-imperial/10 text-violet-imperial border-violet-imperial/20'
                            }`}
                          >
                            {formula.badge}
                          </span>
                        )}
                      </div>

                      {/* Ligne Idéal si... (Section 3.2) */}
                      <div className="p-3.5 rounded-2xl bg-ivoire-violet/80 border border-violet-imperial/10 text-xs sm:text-sm text-onyx/85 font-medium leading-relaxed">
                        {formula.idealFor}
                      </div>

                      {/* Key Points */}
                      <ul className="space-y-3 pt-2 text-xs sm:text-sm text-onyx/80">
                        {formula.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-violet-imperial/10 text-violet-imperial flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </span>
                            <span className="leading-snug">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer card */}
                    <div className="pt-6 mt-6 border-t border-violet-imperial/10 space-y-4">
                      {formula.deliveryTime && (
                        <div className="flex items-center gap-1.5 text-xs text-onyx/65">
                          <Clock className="w-3.5 h-3.5 text-or-champagne" />
                          <span>Délai moyen : <strong className="text-onyx font-semibold">{formula.deliveryTime}</strong></span>
                        </div>
                      )}

                      <CtaButton
                        to="/#contact?type=logo"
                        variant={formula.id === 'signature' ? 'champagne' : 'secondary'}
                        size="md"
                        className="w-full justify-center"
                        icon={<ArrowUpRight className="w-4 h-4" />}
                      >
                        Choisir la formule {formula.name}
                      </CtaButton>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Naming Option Note */}
            {familyLogo.namingOptionNote && (
              <div className="p-4 sm:p-5 rounded-2xl bg-ivoire-violet/60 border border-violet-imperial/15 flex items-start gap-3 text-xs sm:text-sm text-onyx/80 font-body">
                <Info className="w-4 h-4 text-violet-imperial shrink-0 mt-0.5" />
                <p>{familyLogo.namingOptionNote}</p>
              </div>
            )}

            {/* Matrice de comparaison Logo */}
            {familyLogo.comparisonHeaders && familyLogo.comparisonRows && (
              <ComparisonMatrix
                id="logo"
                title={familyLogo.title}
                headers={familyLogo.comparisonHeaders}
                rows={familyLogo.comparisonRows}
              />
            )}
          </section>

          {/* --------------------------------------------------------------- */}
          {/* FAMILLE 02 : BRANDING SOCIAL MEDIA                              */}
          {/* --------------------------------------------------------------- */}
          <section
            id={familySocial.anchorId}
            aria-labelledby="heading-social"
            className="scroll-mt-28 space-y-8 bg-ivoire-violet/40 p-6 sm:p-10 rounded-3xl border border-violet-imperial/10"
          >
            {/* Header de la famille */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-violet-imperial/10 pb-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amethyste/15 text-amethyste flex items-center justify-center font-bold text-xs">
                    <Share2 className="w-4 h-4 text-violet-imperial" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-or-champagne uppercase tracking-widest">
                    Famille {familySocial.number}
                  </span>
                  {familySocial.badge && (
                    <span className="px-3 py-0.5 rounded-full bg-violet-imperial/10 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
                      {familySocial.badge}
                    </span>
                  )}
                </div>
                <h2 id="heading-social" className="text-2xl sm:text-3xl lg:text-4xl font-title font-semibold text-onyx">
                  {familySocial.title}
                </h2>
                <p className="text-sm sm:text-base text-onyx/75 leading-relaxed font-body">
                  {familySocial.subtitle}
                </p>
              </div>

              <div className="shrink-0 pt-2">
                <CtaButton
                  to="/#contact?type=social"
                  variant="primary"
                  size="md"
                  icon={<ArrowUpRight className="w-4 h-4" />}
                >
                  {familySocial.ctaText}
                </CtaButton>
              </div>
            </div>

            {/* 2 Formulas Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {familySocial.formulas?.map((formula: Formula) => {
                const isHighlighted = highlightedId === formula.slugAnchor;
                const dotsCount = formula.id === 'presence' ? 2 : 4;

                return (
                  <article
                    key={formula.id}
                    id={formula.slugAnchor}
                    className={`scroll-mt-32 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative bg-white border ${
                      isHighlighted
                        ? 'ring-2 ring-violet-imperial ring-offset-4 shadow-glow scale-[1.01]'
                        : ''
                    } ${
                      formula.highlighted
                        ? 'border-2 border-violet-imperial/30 shadow-soft-lg'
                        : 'border-violet-imperial/15 shadow-soft'
                    }`}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl sm:text-2xl font-title font-semibold text-onyx">
                          {formula.name}
                        </h3>
                        {formula.badge && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-imperial/10 text-violet-imperial border border-violet-imperial/20 uppercase tracking-wider">
                            {formula.badge}
                          </span>
                        )}
                      </div>

                      {/* Ligne Idéal si... (Section 3.2) */}
                      <div className="p-3.5 rounded-2xl bg-ivoire-violet/80 border border-violet-imperial/10 text-xs sm:text-sm text-onyx/85 font-medium leading-relaxed">
                        {formula.idealFor}
                      </div>

                      {/* Illustration animée du rythme mensuel (Section 4.2) */}
                      <RhythmDotsAnimation
                        dotsPerWeek={dotsCount}
                        label={
                          formula.id === 'presence'
                            ? 'Cadence idéale pour installer votre présence de marque dans la durée'
                            : 'Forte intensité pour lancer une offre et stimuler des ventes continues'
                        }
                        accentColor={formula.id === 'croissance' ? '#6600CC' : '#A87FE8'}
                      />

                      {/* Points clés */}
                      <ul className="space-y-3 pt-2 text-xs sm:text-sm text-onyx/80">
                        {formula.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-violet-imperial/10 text-violet-imperial flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </span>
                            <span className="leading-snug">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 mt-6 border-t border-violet-imperial/10">
                      <CtaButton
                        to="/#contact?type=social"
                        variant={formula.highlighted ? 'primary' : 'secondary'}
                        size="md"
                        className="w-full justify-center"
                        icon={<ArrowUpRight className="w-4 h-4" />}
                      >
                        Activer {formula.name}
                      </CtaButton>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Matrice de comparaison Réseaux sociaux */}
            {familySocial.comparisonHeaders && familySocial.comparisonRows && (
              <ComparisonMatrix
                id="social"
                title={familySocial.title}
                headers={familySocial.comparisonHeaders}
                rows={familySocial.comparisonRows}
              />
            )}
          </section>

          {/* --------------------------------------------------------------- */}
          {/* FAMILLE 03 : COMMUNICATION ÉVÉNEMENTIELLE                       */}
          {/* --------------------------------------------------------------- */}
          <section
            id={familyEvent.anchorId}
            aria-labelledby="heading-event"
            className={`scroll-mt-28 bg-white rounded-3xl p-6 sm:p-10 border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 relative ${
              highlightedId === familyEvent.anchorId
                ? 'ring-2 ring-or-champagne ring-offset-4 shadow-glow'
                : ''
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-or-champagne/15 text-[#8A5E2E] flex items-center justify-center font-bold text-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-or-champagne uppercase tracking-widest font-body">
                    Famille {familyEvent.number}
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-or-champagne/15 text-[#8A5E2E] border border-or-champagne/30 text-xs font-semibold uppercase tracking-wider">
                    {familyEvent.badge}
                  </span>
                </div>

                <h2 id="heading-event" className="text-2xl sm:text-3xl lg:text-4xl font-title font-semibold text-onyx">
                  {familyEvent.title}
                </h2>

                <div className="p-3.5 rounded-2xl bg-or-champagne/10 border border-or-champagne/25 text-xs sm:text-sm text-onyx font-medium">
                  {familyEvent.idealFor}
                </div>

                <p className="text-sm sm:text-base text-onyx/75 font-body leading-relaxed">
                  {familyEvent.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-onyx/70 italic">
                  Chaque événement a son calendrier et ses supports spécifiques (affichage grand format, roll-ups, badges, tickets, dossiers de partenariat, campagne digitale). Le devis est établi sur mesure après analyse précise de votre dispositif.
                </p>
              </div>

              <div className="shrink-0">
                <CtaButton
                  to="/#contact?type=event"
                  variant="champagne"
                  size="lg"
                  icon={<ArrowUpRight className="w-4 h-4" />}
                >
                  {familyEvent.ctaText}
                </CtaButton>
              </div>
            </div>
          </section>

          {/* --------------------------------------------------------------- */}
          {/* FAMILLE 04 : SITES WEB (MOMENT FORT — BANDE SOMBRE ONYX)        */}
          {/* --------------------------------------------------------------- */}
          <section
            id={familyWeb.anchorId}
            aria-labelledby="heading-web"
            className="scroll-mt-28 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-[#0D0A18] text-white border-y border-white/10 relative overflow-hidden"
          >
            {/* Soft decorative background glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-imperial/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-or-champagne/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-12 relative z-10">
              {/* Header de la bande sombre */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/10 text-or-champagne flex items-center justify-center font-bold text-xs">
                      <Globe className="w-4 h-4 text-or-champagne" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-or-champagne uppercase tracking-widest">
                      Famille {familyWeb.number}
                    </span>
                  </div>

                  <h2 id="heading-web" className="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-white leading-tight">
                    {familyWeb.title}
                  </h2>

                  <p className="text-base sm:text-lg text-white/75 font-body leading-relaxed">
                    {familyWeb.subtitle}
                  </p>
                </div>

                <div className="shrink-0 pt-2">
                  <CtaButton
                    to="/#contact?type=website"
                    variant="champagne"
                    size="md"
                    icon={<ArrowUpRight className="w-4 h-4" />}
                  >
                    {familyWeb.ctaText}
                  </CtaButton>
                </div>
              </div>

              {/* Illustration de rapidité (Section 4.4) */}
              <SpeedBarsAnimation />

              {/* 2 Formats avec Sélecteurs Essentiel / Premium */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Format 1 : Site Vitrine */}
                <article
                  id={formatVitrine.slugAnchor}
                  className={`rounded-3xl p-6 sm:p-8 bg-white/5 border border-white/15 flex flex-col justify-between transition-all duration-300 ${
                    highlightedId === formatVitrine.slugAnchor
                      ? 'ring-2 ring-or-champagne ring-offset-4 ring-offset-onyx shadow-glow'
                      : ''
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-title font-semibold text-white">
                          {formatVitrine.title}
                        </h3>
                        <p className="text-xs text-white/60 font-body mt-0.5">
                          Format synthétique à conversion directe
                        </p>
                      </div>

                      {/* Toggle Essentiel / Premium */}
                      <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/10 self-start sm:self-auto">
                        {(['essentiel', 'premium'] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setVitrineVariant(v)}
                            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                              vitrineVariant === v
                                ? 'bg-or-champagne text-onyx shadow-xs font-bold'
                                : 'text-white/70 hover:text-white'
                            }`}
                          >
                            {v === 'essentiel' ? 'Essentiel' : 'Premium'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ligne Idéal si... */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/85 font-medium leading-relaxed">
                      {formatVitrine.variants[vitrineVariant].idealFor}
                    </div>

                    {/* Points clés de la variante choisie */}
                    <ul className="space-y-3 pt-2 text-xs sm:text-sm text-white/80">
                      {formatVitrine.variants[vitrineVariant].keyPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-or-champagne/20 text-or-champagne flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                          <span className="leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-4">
                    <div className="text-xs text-white/65">
                      Livraison : <strong className="text-or-champagne font-semibold">{formatVitrine.variants[vitrineVariant].deliveryTime}</strong>
                    </div>

                    <CtaButton
                      to="/#contact?type=website"
                      variant="champagne"
                      size="sm"
                      icon={<ArrowUpRight className="w-4 h-4" />}
                    >
                      Choisir Vitrine {vitrineVariant}
                    </CtaButton>
                  </div>
                </article>

                {/* Format 2 : Site Multi-pages */}
                <article
                  id={formatMulti.slugAnchor}
                  className={`rounded-3xl p-6 sm:p-8 bg-white/5 border border-white/15 flex flex-col justify-between transition-all duration-300 ${
                    highlightedId === formatMulti.slugAnchor
                      ? 'ring-2 ring-or-champagne ring-offset-4 ring-offset-onyx shadow-glow'
                      : ''
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-title font-semibold text-white">
                          {formatMulti.title}
                        </h3>
                        <p className="text-xs text-white/60 font-body mt-0.5">
                          Plateforme d'autorité & catalogue complet
                        </p>
                      </div>

                      {/* Toggle Essentiel / Premium */}
                      <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/10 self-start sm:self-auto">
                        {(['essentiel', 'premium'] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setMultiVariant(v)}
                            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                              multiVariant === v
                                ? 'bg-or-champagne text-onyx shadow-xs font-bold'
                                : 'text-white/70 hover:text-white'
                            }`}
                          >
                            {v === 'essentiel' ? 'Essentiel' : 'Premium'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ligne Idéal si... */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/85 font-medium leading-relaxed">
                      {formatMulti.variants[multiVariant].idealFor}
                    </div>

                    {/* Points clés de la variante choisie */}
                    <ul className="space-y-3 pt-2 text-xs sm:text-sm text-white/80">
                      {formatMulti.variants[multiVariant].keyPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-or-champagne/20 text-or-champagne flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                          <span className="leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-4">
                    <div className="text-xs text-white/65">
                      Délai : <strong className="text-or-champagne font-semibold">{formatMulti.variants[multiVariant].deliveryTime}</strong>
                    </div>

                    <CtaButton
                      to="/#contact?type=website"
                      variant="champagne"
                      size="sm"
                      icon={<ArrowUpRight className="w-4 h-4" />}
                    >
                      Choisir Multi-pages {multiVariant}
                    </CtaButton>
                  </div>
                </article>
              </div>

              {/* Hosting & Domain Note */}
              {familyWeb.hostingDomainNote && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/75 flex items-start gap-3">
                  <Info className="w-4 h-4 text-or-champagne shrink-0 mt-0.5" />
                  <p>{familyWeb.hostingDomainNote}</p>
                </div>
              )}

              {/* Matrice de comparaison Sites Web */}
              {familyWeb.comparisonHeaders && familyWeb.comparisonRows && (
                <ComparisonMatrix
                  id="web"
                  title="Sites Web"
                  headers={familyWeb.comparisonHeaders}
                  rows={familyWeb.comparisonRows}
                  isDark={true}
                />
              )}
            </div>
          </section>

          {/* --------------------------------------------------------------- */}
          {/* FAMILLE 05 : VISUELS À L'UNITÉ (BANDE FINE SOBRE)               */}
          {/* --------------------------------------------------------------- */}
          <section
            id={familyPrint.anchorId}
            aria-labelledby="heading-print"
            className={`scroll-mt-28 bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 ${
              highlightedId === familyPrint.anchorId
                ? 'ring-2 ring-violet-imperial ring-offset-4 shadow-glow'
                : ''
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-ardoise/10 text-ardoise flex items-center justify-center font-bold text-xs">
                    <Zap className="w-4 h-4 text-violet-imperial" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-ardoise uppercase tracking-widest font-body">
                    Famille {familyPrint.number}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-or-champagne/15 text-[#8A5E2E] border border-or-champagne/30 text-xs font-semibold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    {familyPrint.deliveryTime}
                  </span>
                </div>

                <h2 id="heading-print" className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
                  {familyPrint.title}
                </h2>

                <p className="text-xs sm:text-sm font-semibold text-violet-imperial">
                  {familyPrint.idealFor}
                </p>

                <p className="text-sm text-onyx/75 font-body leading-relaxed">
                  {familyPrint.subtitle}
                </p>
              </div>

              <div className="shrink-0">
                <CtaButton
                  to="/#contact?type=print"
                  variant="champagne"
                  size="md"
                  icon={<ArrowUpRight className="w-4 h-4" />}
                >
                  {familyPrint.ctaText}
                </CtaButton>
              </div>
            </div>
          </section>
        </div>

        {/* ================================================================= */}
        {/* 5. FAQ INTÉGRÉE (SECTION CONSERVÉE)                               */}
        {/* ================================================================= */}
        <FaqSection />

        {/* ================================================================= */}
        {/* 6. BANDEAU FINAL D'APPEL À L'ACTION VERS /#contact                */}
        {/* ================================================================= */}
        <div className="text-center bg-white p-8 sm:p-12 rounded-3xl border border-violet-imperial/15 shadow-soft space-y-5 max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
            Une question sur la formule la plus adaptée à votre situation ?
          </h3>
          <p className="text-sm sm:text-base text-onyx/75 font-body max-w-xl mx-auto leading-relaxed">
            Remplissez le court formulaire de contact : j’analyserai vos objectifs et vous orienterai vers le dispositif le plus efficace et cohérent.
          </p>
          <div className="pt-2">
            <CtaButton
              to="/#contact"
              variant="champagne"
              size="lg"
              icon={<ArrowUpRight className="w-5 h-5" />}
            >
              Prendre contact pour échanger
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offres;
