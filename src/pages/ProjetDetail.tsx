import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Target,
  Compass,
  Trophy,
  AlertTriangle,
  MessageSquareQuote,
  Layers,
  ZoomIn,
} from 'lucide-react';
import { projectsData, Project } from '../data/projets';
import { fetchPublicProjects, fetchPublicProjectBySlug } from '../lib/supabase';
import { getOptimizedImage } from '../lib/images';
import { useSeo } from '../hooks/useSeo';
import { getProjectAccroche, normalizeProjectSlug } from '../lib/projectHelpers';
import { ProjectLightbox } from '../components/ui/ProjectLightbox';
import { CtaButton } from '../components/ui/CtaButton';
import { NotFound } from './NotFound';

export const ProjetDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const initialProject = React.useMemo(() => {
    if (!slug) return null;
    const norm = normalizeProjectSlug(slug);
    return projectsData.find((p) => normalizeProjectSlug(p.slug || p.id) === norm) || null;
  }, [slug]);

  const [project, setProject] = useState<Project | null>(initialProject);
  const [allProjects, setAllProjects] = useState<Project[]>(projectsData);
  const [loading, setLoading] = useState(!initialProject);
  const [notFound, setNotFound] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 1. Load project data and all projects (for prev/next loop)
  useEffect(() => {
    let isMounted = true;
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (!initialProject) {
      setLoading(true);
    }
    setNotFound(false);

    // Fetch project by slug
    fetchPublicProjectBySlug(slug).then((res: { project: Project | null; redirectSlug?: string }) => {
      if (!isMounted) return;

      if (res.redirectSlug) {
        navigate(`/projets/${res.redirectSlug}`, { replace: true });
        return;
      }

      if (res.project) {
        setProject(res.project);
        setNotFound(false);
      } else if (!initialProject) {
        setProject(null);
        setNotFound(true);
      }
      setLoading(false);
    });

    // Fetch all published projects for prev/next loop
    fetchPublicProjects().then((list) => {
      if (isMounted && list && list.length > 0) {
        setAllProjects(list);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  // 2. SEO configuration
  const projectAccroche = project ? getProjectAccroche(project) : '';
  const heroImgOpt = project?.heroImage
    ? getOptimizedImage(project.heroImage, { width: 1200 })
    : null;

  useSeo({
    title: project ? `${project.title} | Class S` : 'Projet | Class S',
    description:
      projectAccroche ||
      (project ? `${project.title} - Réalisation et étude de cas par Scott Nana.` : ''),
    canonicalUrl: project ? `https://www.wendclass.com/projets/${project.slug}` : undefined,
    ogImage: project ? `https://www.wendclass.com/og/projets/${project.slug}.jpg` : 'https://www.wendclass.com/og/banniere-class-s.jpg',
    ogType: 'article',
    jsonLd: project
      ? {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: projectAccroche,
          image: heroImgOpt?.src,
          creator: {
            '@type': 'Person',
            name: 'Scott Nana',
            jobTitle: 'Brand & Graphic Designer',
          },
          provider: {
            '@type': 'ProfessionalService',
            name: 'Class S',
            url: 'https://www.wendclass.com',
          },
        }
      : undefined,
  });

  if (loading) {
    return (
      <div className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse font-body">
        <div className="h-6 w-32 bg-slate-200 rounded-full" />
        <div className="h-12 w-3/4 bg-slate-200 rounded-2xl" />
        <div className="aspect-[16/9] w-full bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (notFound || !project) {
    return <NotFound />;
  }

  // Prev / Next project calculation (in display loop)
  const currentIndex = allProjects.findIndex(
    (p) => p.slug === project.slug || p.id === project.id
  );
  const totalProjects = allProjects.length;
  const prevProject =
    totalProjects > 1
      ? allProjects[(currentIndex - 1 + totalProjects) % totalProjects]
      : null;
  const nextProject =
    totalProjects > 1
      ? allProjects[(currentIndex + 1) % totalProjects]
      : null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="py-10 sm:py-16 font-body">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* 1. Fil d'Ariane & Navigation de retour */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 text-xs font-semibold text-onyx/60 font-body"
        >
          <Link
            to="/projets"
            className="inline-flex items-center gap-1.5 text-violet-imperial hover:text-amethyste transition-colors py-1 focus:outline-none focus:ring-2 focus:ring-amethyste rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tous les projets</span>
          </Link>
          <span className="text-onyx/30">/</span>
          <span className="text-onyx/80 truncate max-w-xs sm:max-w-md">
            {project.title}
          </span>
        </nav>

        {/* 2. Entête du projet */}
        <header className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-or-champagne tracking-widest uppercase font-body">
                Projet 0{currentIndex >= 0 ? currentIndex + 1 : 1}
              </span>
              <span className="px-3 py-1 rounded-full bg-violet-imperial/10 text-violet-imperial text-xs font-semibold uppercase tracking-wider font-body">
                {project.category}
              </span>
              <span className="text-xs text-onyx/40 font-body">
                {project.gallery.length} visuels
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight">
              {project.title}
            </h1>

            {project.tagline && (
              <p className="text-base sm:text-lg text-onyx/75 font-body italic leading-relaxed max-w-3xl">
                « {project.tagline} »
              </p>
            )}
          </div>

          {/* Image principale en grand format - Affichage complet, sans rognage ni déformation */}
          {project.heroImage && (
            <div className="relative w-full rounded-3xl overflow-hidden bg-[#0D0A18] border border-violet-imperial/15 shadow-soft-lg flex items-center justify-center p-3 sm:p-6 md:p-8 min-h-[320px] sm:min-h-[460px] md:min-h-[540px]">
              {(() => {
                const opt = getOptimizedImage(project.heroImage, { width: 1920 });
                return (
                  <>
                    {/* Fond ambiant feutré reprenant les couleurs du visuel pour une mise en valeur studio haut de gamme */}
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-25 scale-110 pointer-events-none select-none"
                      style={{ backgroundImage: `url(${opt.src})` }}
                      aria-hidden="true"
                    />

                    {/* Le visuel entier, préservé à 100%, sans coupure, centré et net */}
                    <img
                      src={opt.src}
                      srcSet={opt.srcSet}
                      sizes="(min-width: 1024px) 80vw, 100vw"
                      alt={project.title}
                      width={opt.width}
                      height={opt.height}
                      loading="eager"
                      fetchPriority="high"
                      draggable={false}
                      className="relative z-10 max-h-[580px] sm:max-h-[680px] md:max-h-[760px] w-auto max-w-full h-auto rounded-2xl shadow-soft-lg object-contain select-none pointer-events-none mx-auto"
                    />
                  </>
                );
              })()}
            </div>
          )}
        </header>

        {/* 3. Récit en trois blocs (But -> Conception -> Résultat) */}
        <section aria-label="Étude de cas détaillée" className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-violet-imperial font-body flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-or-champagne" />
            <span>Récit stratégique du projet</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. But du client */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-violet-imperial/15 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-violet-imperial font-semibold text-xs uppercase tracking-wider font-body">
                <Target className="w-4 h-4 shrink-0" />
                <span>1. But du client</span>
              </div>
              <p className="text-sm text-onyx/85 font-body leading-relaxed">
                {project.clientGoal}
              </p>
            </div>

            {/* 2. Ce qui a été conçu */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-violet-imperial/15 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-violet-imperial font-semibold text-xs uppercase tracking-wider font-body">
                <Compass className="w-4 h-4 shrink-0" />
                <span>2. Ce qui a été conçu</span>
              </div>
              <p className="text-sm text-onyx/85 font-body leading-relaxed">
                {project.designedSolution}
              </p>
            </div>

            {/* 3. Résultat */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-violet-imperial/15 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider font-body">
                <Trophy className="w-4 h-4 shrink-0" />
                <span>3. Résultat</span>
              </div>
              <p className="text-sm text-onyx/85 font-body leading-relaxed">
                {project.result}
              </p>
            </div>
          </div>
        </section>

        {/* 4. Précision de paternité graphique (indispensable pour Off Day) */}
        {project.disclaimer && (
          <aside
            aria-label="Précision importante sur le projet"
            className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-onyx/85"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed font-body">
                <strong className="font-semibold block text-onyx mb-1">
                  Précision de paternité graphique
                </strong>
                {project.disclaimer}
              </div>
            </div>
          </aside>
        )}

        {/* 5. Témoignage client associé (si présent) */}
        {project.testimonialPlaceholder && (
          <section
            aria-label="Témoignage client"
            className="bg-gradient-to-br from-violet-imperial/10 via-white to-or-champagne/10 rounded-3xl p-6 sm:p-10 border border-violet-imperial/20 shadow-soft"
          >
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-imperial/10 text-violet-imperial mx-auto">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <blockquote className="text-lg sm:text-xl font-title italic text-onyx leading-relaxed">
                « {project.testimonialPlaceholder} »
              </blockquote>
              <footer className="text-xs text-onyx/60 font-body">
                <span className="font-semibold text-onyx block text-sm">
                  {project.title}
                </span>
                <span>Retour d'expérience client</span>
              </footer>
            </div>
          </section>
        )}

        {/* 6. Galerie complète des réalisations (Masonry & zéro déformation) */}
        <section aria-label="Galerie des œuvres" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-or-champagne uppercase tracking-wider font-body mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Galerie intégrale</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
                Toutes les réalisations du projet ({project.gallery.length} visuels)
              </h2>
            </div>
            <p className="text-xs text-onyx/50 font-body">
              Cliquez sur un visuel pour l'ouvrir en plein écran
            </p>
          </div>

          {/* Grille Masonry responsive préservant le ratio naturel de chaque image */}
          <div className="columns-2 md:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {project.gallery.map((img, idx) => {
              const opt = getOptimizedImage(img.src, { width: 1200 });
              return (
                <div
                  key={`${img.src}-${idx}`}
                  className="break-inside-avoid rounded-2xl overflow-hidden bg-onyx border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg group relative cursor-pointer transition-all duration-300"
                >
                  <button
                    ref={(el) => (triggerRefs.current[idx] = el)}
                    type="button"
                    onClick={() => openLightbox(idx)}
                    className="block w-full text-left relative focus:outline-none focus:ring-2 focus:ring-violet-imperial rounded-2xl"
                    aria-label={`Agrandir le visuel ${idx + 1} : ${img.caption || project.title}`}
                  >
                    <img
                      src={opt.src}
                      srcSet={opt.srcSet}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 50vw"
                      alt={img.caption || `${project.title} - visuel ${idx + 1}`}
                      width={opt.width}
                      height={opt.height}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="w-full h-auto block select-none group-hover:scale-[1.02] transition-transform duration-500"
                    />

                    {/* Anti-download shield overlay */}
                    <div
                      className="absolute inset-0 z-10"
                      onContextMenu={(e) => e.preventDefault()}
                      aria-hidden="true"
                    />

                    {/* Hover Overlay with Zoom Icon */}
                    <div className="absolute inset-0 z-20 bg-onyx/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-violet-imperial shadow-lg scale-90 group-hover:scale-100 transition-transform">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>

                    {img.caption && (
                      <div className="p-3 bg-white border-t border-violet-imperial/10 text-[11px] text-onyx/75 font-body line-clamp-1">
                        {img.caption}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Navigation Précédent / Suivant (en boucle) */}
        {totalProjects > 1 && (
          <nav
            aria-label="Projets voisins"
            className="pt-8 border-t border-violet-imperial/10 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {prevProject && (() => {
              const prevOpt = getOptimizedImage(prevProject.heroImage || prevProject.gallery?.[0]?.src || '', { width: 480 });
              return (
                <Link
                  to={`/projets/${normalizeProjectSlug(prevProject.slug || prevProject.id)}`}
                  className="group p-4 sm:p-5 rounded-2xl bg-white border border-violet-imperial/10 hover:border-violet-imperial/30 transition-all flex items-center gap-4 text-left shadow-sm"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-onyx shrink-0 border border-violet-imperial/10 relative">
                    <img
                      src={prevOpt.src}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.onerror = null;
                        t.src = '/assets/logo/logo-violet.png';
                        t.className = 'w-full h-full object-contain p-2 bg-ivoire-violet';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-violet-imperial uppercase flex items-center gap-1 font-body">
                      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                      <span>Projet précédent</span>
                    </span>
                    <p className="text-sm font-title font-semibold text-onyx truncate group-hover:text-violet-imperial transition-colors">
                      {prevProject.title}
                    </p>
                  </div>
                </Link>
              );
            })()}

            {nextProject && (() => {
              const nextOpt = getOptimizedImage(nextProject.heroImage || nextProject.gallery?.[0]?.src || '', { width: 480 });
              return (
                <Link
                  to={`/projets/${normalizeProjectSlug(nextProject.slug || nextProject.id)}`}
                  className="group p-4 sm:p-5 rounded-2xl bg-white border border-violet-imperial/10 hover:border-violet-imperial/30 transition-all flex items-center justify-between gap-4 text-right shadow-sm sm:col-start-2"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold text-violet-imperial uppercase inline-flex items-center gap-1 font-body">
                      <span>Projet suivant</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <p className="text-sm font-title font-semibold text-onyx truncate group-hover:text-violet-imperial transition-colors">
                      {nextProject.title}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-onyx shrink-0 border border-violet-imperial/10 relative">
                    <img
                      src={nextOpt.src}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.onerror = null;
                        t.src = '/assets/logo/logo-violet.png';
                        t.className = 'w-full h-full object-contain p-2 bg-ivoire-violet';
                      }}
                    />
                  </div>
                </Link>
              );
            })()}
          </nav>
        )}

        {/* 8. Appel à l'action vers /#contact */}
        <section aria-label="Prendre contact pour un projet">
          <div className="text-center bg-white p-8 sm:p-12 rounded-3xl border border-violet-imperial/15 shadow-soft space-y-6 max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
              Vous avez un projet ambitieux à valoriser ?
            </h3>
            <p className="text-base text-onyx/75 font-body max-w-xl mx-auto">
              Chaque détail compte pour asseoir votre crédibilité. Discutons de vos
              objectifs et créons un dispositif graphique à la hauteur de vos
              ambitions.
            </p>
            <div>
              <CtaButton
                to="/#contact"
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-5 h-5" />}
              >
                Prendre contact avec Scott
              </CtaButton>
            </div>
          </div>
        </section>
      </div>

      {/* Visionneuse plein écran modale */}
      <ProjectLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={project.gallery}
        currentIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
        projectTitle={project.title}
        triggerElement={triggerRefs.current[lightboxIndex]}
      />
    </div>
  );
};

export default ProjetDetail;
