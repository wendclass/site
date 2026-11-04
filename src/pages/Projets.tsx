import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Layers,
  FolderOpen,
} from 'lucide-react';
import { projectsData, Project } from '../data/projets';
import { fetchPublicProjects } from '../lib/supabase';
import { CtaButton } from '../components/ui/CtaButton';
import { getOptimizedImage } from '../lib/images';
import { useSeo } from '../hooks/useSeo';
import {
  getProjectAccroche,
  mapLegacyAnchorToSlug,
  normalizeProjectSlug,
} from '../lib/projectHelpers';

export const Projets: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Redirect legacy anchor hash (e.g. /projets#off-day) to /projets/:slug
  useEffect(() => {
    if (window.location.hash) {
      const mappedSlug = mapLegacyAnchorToSlug(window.location.hash);
      if (mappedSlug) {
        navigate(`/projets/${mappedSlug}`, { replace: true });
      }
    }
  }, [navigate]);

  // 2. Fetch published projects and restore scroll position
  useEffect(() => {
    let isMounted = true;
    fetchPublicProjects().then((data) => {
      if (isMounted) {
        if (data && data.length > 0) {
          setProjects(data);
        }
        setLoading(false);

        // Restore scroll position when returning from detail page
        const savedPos = sessionStorage.getItem('class_s_projets_scroll');
        if (savedPos) {
          setTimeout(() => {
            window.scrollTo({
              top: parseInt(savedPos, 10),
              behavior: 'instant',
            });
            sessionStorage.removeItem('class_s_projets_scroll');
          }, 50);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Save scroll position when clicking a project card
  const handleProjectClick = () => {
    sessionStorage.setItem(
      'class_s_projets_scroll',
      window.scrollY.toString()
    );
  };

  // SEO configuration
  useSeo({
    title: 'Réalisations & Études de Cas | Class S',
    description:
      'Explorez nos réalisations et études de cas de marques à Ouagadougou : objectifs clients, conception graphique stratégique et résultats commerciaux obtenus.',
    canonicalUrl: 'https://www.wendclass.com/projets',
    ogImage: 'https://www.wendclass.com/og/banniere-class-s.png',
    ogType: 'website',
  });

  const featuredProject = projects[0] || null;
  const subsequentProjects = projects.slice(1);

  return (
    <div className="py-12 md:py-20 font-body">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
        {/* Page Header (Textes d'origine conservés mot pour mot) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider font-body">
            <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
            <span>Réalisations & Études de cas</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight">
            Chaque visuel a une mission commerciale
          </h1>

          <p className="text-base sm:text-lg text-onyx/75 font-body leading-relaxed">
            Découvrez l’intégralité des visuels et dispositifs conçus pour chaque
            projet, avec leur intention stratégique et leur impact.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && projects.length === 0 ? (
          <div className="space-y-6">
            <div className="aspect-[21/9] rounded-3xl bg-slate-100 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-[16/10] rounded-3xl bg-slate-100 animate-pulse" />
              <div className="aspect-[16/10] rounded-3xl bg-slate-100 animate-pulse" />
            </div>
          </div>
        ) : projects.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16 px-6 rounded-3xl bg-white border border-violet-imperial/10 shadow-soft max-w-md mx-auto space-y-4">
            <FolderOpen className="w-12 h-12 text-violet-imperial/40 mx-auto" />
            <h2 className="text-xl font-title font-semibold text-onyx">
              Les premiers projets arrivent bientôt
            </h2>
            <p className="text-sm text-onyx/70 leading-relaxed font-body">
              Nos nouvelles études de cas complètes seront bientôt publiées. En
              attendant, explorez nos offres ou prenez directement contact.
            </p>
            <div className="pt-2">
              <CtaButton to="/" variant="secondary" size="sm">
                Retour à l'Accueil
              </CtaButton>
            </div>
          </div>
        ) : (
          /* COMPACT PROJECTS GRID (1 + 2 + 2 layout) */
          <div className="space-y-6 md:space-y-8">
            {/* 1. FEATURED PROJECT (Grand format pleine largeur sur Desktop, standard sur Tablette/Mobile) */}
            {featuredProject && (
              <div className="hidden lg:block">
                <Link
                  to={`/projets/${normalizeProjectSlug(featuredProject.slug || featuredProject.id)}`}
                  onClick={handleProjectClick}
                  className="group block relative bg-white rounded-3xl border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg hover:border-violet-imperial/35 transition-all duration-300 overflow-hidden"
                >
                  <div className="grid grid-cols-12 items-center">
                    {/* Visual Media */}
                    <div className="col-span-7 relative aspect-[16/10] overflow-hidden bg-onyx">
                      {(() => {
                        const heroImg =
                          featuredProject.heroImage ||
                          featuredProject.gallery?.[0]?.src;
                        if (!heroImg) {
                          return (
                            <div className="w-full h-full bg-gradient-to-br from-ardoise to-onyx flex items-center justify-center">
                              <img
                                src="/assets/logo/logo-blanc.png"
                                alt=""
                                aria-hidden="true"
                                className="w-16 h-16 opacity-20 object-contain"
                              />
                            </div>
                          );
                        }
                        const opt = getOptimizedImage(heroImg, { width: 1200 });
                        return (
                          <img
                            src={opt.src}
                            srcSet={opt.srcSet}
                            sizes="(min-width: 1024px) 60vw, 100vw"
                            alt={featuredProject.title}
                            width={opt.width}
                            height={opt.height}
                            loading="eager"
                            fetchPriority="high"
                            draggable={false}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                          />
                        );
                      })()}

                      {/* Visuals count pill over image */}
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-onyx/85 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5 shadow-sm font-body">
                          <Layers className="w-3.5 h-3.5 text-amethyste" />
                          <span>
                            {featuredProject.gallery?.length || 0} visuels
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Content text */}
                    <div className="col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-or-champagne tracking-widest uppercase font-body">
                            Projet 01 • En vedette
                          </span>
                          <span className="px-3 py-0.5 rounded-full bg-violet-imperial/10 text-violet-imperial text-xs font-semibold uppercase tracking-wider font-body">
                            {featuredProject.category}
                          </span>
                        </div>

                        <h2 className="text-2xl lg:text-3xl font-title font-semibold text-onyx leading-snug group-hover:text-violet-imperial transition-colors">
                          {featuredProject.title}
                        </h2>

                        <p className="text-sm lg:text-base text-onyx/75 font-body leading-relaxed line-clamp-2">
                          {getProjectAccroche(featuredProject)}
                        </p>
                      </div>

                      {/* Footer link */}
                      <div className="pt-4 border-t border-violet-imperial/10 flex items-center justify-between">
                        <span className="text-sm font-semibold text-violet-imperial group-hover:text-amethyste transition-colors inline-flex items-center gap-1.5 font-body py-1">
                          <span>Voir le projet complet</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                        </span>
                        <span className="text-sm text-onyx/60 font-body">
                          Récit & Galerie complète →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* 2. SUBSEQUENT PROJECTS (2 Columns on Desktop & Tablet, 1 Column on Mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* On Tablet & Mobile: render the first project as a standard grid card too */}
              <div className="block lg:hidden">
                {featuredProject && (
                  <ProjectCard
                    project={featuredProject}
                    index={0}
                    onClick={handleProjectClick}
                    priorityImage={true}
                  />
                )}
              </div>

              {subsequentProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id || project.slug}
                  project={project}
                  index={idx + 1}
                  onClick={handleProjectClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Global CTA Section (Conservée à l'identique) */}
        <div className="text-center bg-white p-8 sm:p-12 rounded-3xl border border-violet-imperial/15 shadow-soft space-y-6 max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
            Votre activité mérite elle aussi une image qui fait vendre
          </h3>
          <p className="text-base text-onyx/75 font-body max-w-xl mx-auto">
            Discutons ensemble de vos besoins et définissons le dispositif visuel
            adapté pour vous imposer sur votre marché.
          </p>
          <div>
            <CtaButton
              to="/#contact"
              variant="primary"
              size="lg"
              icon={<ArrowUpRight className="w-5 h-5" />}
            >
              Prendre contact pour mon projet
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual project card in the compact grid
interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
  priorityImage?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onClick,
  priorityImage = false,
}) => {
  const heroImg = project.heroImage || project.gallery?.[0]?.src;
  const opt = heroImg ? getOptimizedImage(heroImg, { width: 800 }) : null;

  return (
    <Link
      to={`/projets/${normalizeProjectSlug(project.slug || project.id)}`}
      onClick={onClick}
      className="group flex flex-col justify-between bg-white rounded-3xl border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg hover:border-violet-imperial/35 transition-all duration-300 overflow-hidden h-full"
    >
      <div>
        {/* Thumbnail media with 16:10 or 4:3 fixed ratio */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-onyx border-b border-violet-imperial/10">
          {opt ? (
            <img
              src={opt.src}
              srcSet={opt.srcSet}
              sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
              alt={project.title}
              width={opt.width}
              height={opt.height}
              loading={priorityImage ? 'eager' : 'lazy'}
              fetchPriority={priorityImage ? 'high' : 'auto'}
              draggable={false}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ardoise to-onyx flex items-center justify-center">
              <img
                src="/assets/logo/logo-blanc.png"
                alt=""
                aria-hidden="true"
                className="w-12 h-12 opacity-20 object-contain"
              />
            </div>
          )}

          {/* Visuals count pill */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-onyx/85 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5 shadow-sm font-body">
              <Layers className="w-3 h-3 text-amethyste" />
              <span>{project.gallery?.length || 0} visuels</span>
            </span>
          </div>

          {/* Category pill */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/95 backdrop-blur-md text-violet-imperial shadow-sm font-body">
              {project.category}
            </span>
          </div>
        </div>

        {/* Text body */}
        <div className="p-6 sm:p-7 space-y-3">
          <span className="text-xs font-bold text-or-champagne tracking-widest uppercase block font-body">
            Projet 0{index + 1}
          </span>

          <h2 className="text-xl sm:text-2xl font-title font-semibold text-onyx leading-snug group-hover:text-violet-imperial transition-colors line-clamp-1">
            {project.title}
          </h2>

          <p className="text-sm sm:text-base text-onyx/80 font-body leading-relaxed line-clamp-2">
            {getProjectAccroche(project)}
          </p>
        </div>
      </div>

      {/* Card action footer */}
      <div className="px-6 pb-6 pt-2 sm:px-7 sm:pb-7 flex items-center justify-between border-t border-violet-imperial/5">
        <span className="text-xs font-semibold text-violet-imperial group-hover:text-amethyste transition-colors inline-flex items-center gap-1.5 font-body">
          <span>Voir le projet</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
        </span>
        <span className="text-xs text-onyx/40 font-body">
          Galerie complète →
        </span>
      </div>
    </Link>
  );
};
