import React, { useState, useEffect } from 'react';
import { Sparkles, Target, Compass, Trophy, MessageSquareQuote, AlertTriangle, ArrowUpRight, X, ZoomIn, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { projectsData, Project } from '../data/projets';
import { fetchPublicProjects } from '../lib/supabase';
import { CtaButton } from '../components/ui/CtaButton';

export const Projets: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [activeGallery, setActiveGallery] = useState<{
    projectTitle: string;
    items: { src: string; caption: string }[];
    currentIndex: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchPublicProjects().then((data) => {
      if (isMounted && data.length > 0) {
        setProjects(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeGallery) return;
      if (e.key === 'Escape') setActiveGallery(null);
      if (e.key === 'ArrowRight') {
        setActiveGallery((prev) =>
          prev
            ? {
                ...prev,
                currentIndex: (prev.currentIndex + 1) % prev.items.length,
              }
            : null
        );
      }
      if (e.key === 'ArrowLeft') {
        setActiveGallery((prev) =>
          prev
            ? {
                ...prev,
                currentIndex:
                  (prev.currentIndex - 1 + prev.items.length) % prev.items.length,
              }
            : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGallery]);

  const openLightbox = (project: Project, index: number) => {
    setActiveGallery({
      projectTitle: project.title,
      items: project.gallery,
      currentIndex: index,
    });
  };

  const nextImage = () => {
    if (!activeGallery) return;
    setActiveGallery({
      ...activeGallery,
      currentIndex: (activeGallery.currentIndex + 1) % activeGallery.items.length,
    });
  };

  const prevImage = () => {
    if (!activeGallery) return;
    setActiveGallery({
      ...activeGallery,
      currentIndex:
        (activeGallery.currentIndex - 1 + activeGallery.items.length) %
        activeGallery.items.length,
    });
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
            Réalisations & Études de cas
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight">
            Chaque visuel a une mission commerciale
          </h1>

          <p className="text-base sm:text-lg text-onyx/75 font-body leading-relaxed">
            Découvrez l’intégralité des visuels et dispositifs conçus pour chaque projet, avec leur intention stratégique et leur impact.
          </p>
        </div>

        {/* The Project Deep Dives */}
        <div className="space-y-16">
          {projects.map((project: Project, index: number) => (
            <article
              id={project.slug}
              key={project.id}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 scroll-mt-28"
            >
              <div className="space-y-8">
                {/* Project Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-violet-imperial/10">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-or-champagne tracking-widest uppercase font-body">
                        Projet 0{index + 1}
                      </span>
                      <span className="px-3 py-0.5 rounded-full bg-violet-imperial/10 text-violet-imperial text-xs font-semibold uppercase tracking-wider font-body">
                        {project.category}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-semibold text-onyx">
                      {project.title}
                    </h2>

                    <p className="text-sm sm:text-base text-onyx/75 font-body italic">
                      {project.tagline}
                    </p>
                  </div>

                  <CtaButton
                    to="/#contact"
                    variant="secondary"
                    size="sm"
                    icon={<ArrowUpRight className="w-4 h-4" />}
                  >
                    Projet similaire ?
                  </CtaButton>
                </div>

                {/* 3-Part Case Study Grid (But -> Conception -> Résultat) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 1. But */}
                  <div className="bg-ivoire-violet/70 rounded-2xl p-5 border border-violet-imperial/10 space-y-2">
                    <div className="flex items-center gap-2 text-violet-imperial font-semibold text-xs uppercase tracking-wider font-body">
                      <Target className="w-4 h-4" />
                      <span>1. But du client</span>
                    </div>
                    <p className="text-sm text-onyx/85 font-body leading-relaxed">
                      {project.clientGoal}
                    </p>
                  </div>

                  {/* 2. Conception */}
                  <div className="bg-ivoire-violet/70 rounded-2xl p-5 border border-violet-imperial/10 space-y-2">
                    <div className="flex items-center gap-2 text-violet-imperial font-semibold text-xs uppercase tracking-wider font-body">
                      <Compass className="w-4 h-4" />
                      <span>2. Ce qui a été conçu</span>
                    </div>
                    <p className="text-sm text-onyx/85 font-body leading-relaxed">
                      {project.designedSolution}
                    </p>
                  </div>

                  {/* 3. Résultat */}
                  <div className="bg-ivoire-violet/70 rounded-2xl p-5 border border-violet-imperial/10 space-y-2">
                    <div className="flex items-center gap-2 text-violet-imperial font-semibold text-xs uppercase tracking-wider font-body">
                      <Trophy className="w-4 h-4" />
                      <span>3. Résultat obtenu</span>
                    </div>
                    <p className="text-sm text-onyx/85 font-body leading-relaxed">
                      {project.result}
                    </p>
                  </div>
                </div>

                {/* Mandatory Disclaimer for Off Day */}
                {project.disclaimer && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-body flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="leading-relaxed font-medium">
                        {project.disclaimer}
                      </p>
                    </div>
                  </div>
                )}

                {/* Visual Gallery Grid - All Works */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-onyx/80 font-body">
                      <Layers className="w-4 h-4 text-violet-imperial" />
                      <span>Galerie complète des réalisations ({project.gallery.length} visuels)</span>
                    </div>
                    <span className="text-[11px] text-onyx/50 font-body hidden sm:inline">
                      Cliquez pour afficher en plein écran
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {project.gallery.map((img, imgIdx) => (
                      <button
                        type="button"
                        key={imgIdx}
                        onClick={() => openLightbox(project, imgIdx)}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-onyx border border-violet-imperial/15 shadow-sm hover:shadow-md hover:border-violet-imperial/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-imperial"
                        aria-label={`Agrandir ${img.caption}`}
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                          <ZoomIn className="w-5 h-5 mb-1" />
                          <span className="text-[10px] line-clamp-2 leading-tight font-body">{img.caption}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Testimonial Quote Block */}
                {project.testimonialPlaceholder && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-imperial/5 via-white to-or-champagne/5 border border-violet-imperial/10 flex items-start gap-3">
                    <MessageSquareQuote className="w-5 h-5 text-or-champagne shrink-0 mt-1" />
                    <p className="text-xs sm:text-sm text-onyx/80 italic font-body leading-relaxed">
                      {project.testimonialPlaceholder}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Global CTA Section */}
        <div className="text-center bg-white p-8 sm:p-12 rounded-3xl border border-violet-imperial/15 shadow-soft space-y-6 max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
            Votre activité mérite elle aussi une image qui fait vendre
          </h3>
          <p className="text-base text-onyx/75 font-body max-w-xl mx-auto">
            Discutons ensemble de vos besoins et définissons le dispositif visuel adapté pour vous imposer sur votre marché.
          </p>
          <div>
            <CtaButton to="/#contact" variant="primary" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
              Prendre contact pour mon projet
            </CtaButton>
          </div>
        </div>
      </div>

      {/* Lightbox Modal with Full Navigation */}
      {activeGallery && (
        <div
          className="fixed inset-0 z-50 bg-onyx/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none"
          onClick={() => setActiveGallery(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActiveGallery(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
              aria-label="Fermer la vue plein écran"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev button */}
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/25 transition-all focus:outline-none"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/25 transition-all focus:outline-none"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Current Image */}
            <div className="relative max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-onyx shadow-2xl border border-white/20">
              <img
                src={activeGallery.items[activeGallery.currentIndex].src}
                alt={activeGallery.items[activeGallery.currentIndex].caption}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Image caption and counter */}
            <div className="mt-4 text-center text-white space-y-1 max-w-xl">
              <p className="text-sm sm:text-base font-semibold font-body">
                {activeGallery.items[activeGallery.currentIndex].caption}
              </p>
              <p className="text-xs text-white/60 font-body">
                {activeGallery.projectTitle} • Visuel {activeGallery.currentIndex + 1} sur {activeGallery.items.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
