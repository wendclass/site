import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  ArrowUpRight,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DbArticle, fetchPublicArticles } from '../lib/supabase';
import { useSeo } from '../hooks/useSeo';
import { CtaButton } from '../components/ui/CtaButton';
import { BlogHero } from '../components/blog/BlogHero';
import { BlogFilterBar } from '../components/blog/BlogFilterBar';
import {
  RUBRIQUES,
  getRubriqueName,
  inferRubriqueFromTags,
} from '../config/rubriques';

export const Blog: React.FC = () => {
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Active query parameters
  const selectedRubrique = searchParams.get('rubrique') || 'tous';
  const urlSearchQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(urlSearchQuery);

  // Synchronize local search input if URL changes (e.g. Browser Back / Forward)
  useEffect(() => {
    setSearchInput(urlSearchQuery);
  }, [urlSearchQuery]);

  // Load published articles
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchPublicArticles();
        if (isMounted) {
          setArticles(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching blog articles:', err);
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Debounced search query synchronization with URL (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      const cleanInput = searchInput.trim();

      if (cleanInput) {
        if (nextParams.get('q') !== cleanInput) {
          nextParams.set('q', cleanInput);
          setSearchParams(nextParams);
        }
      } else {
        if (nextParams.has('q')) {
          nextParams.delete('q');
          setSearchParams(nextParams);
        }
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  // Handle rubrique selection
  const handleSelectRubrique = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug === 'tous') {
      nextParams.delete('rubrique');
    } else {
      nextParams.set('rubrique', slug);
    }
    setSearchParams(nextParams);
  };

  // Handle complete reset of all filters
  const handleResetFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('rubrique');
    nextParams.delete('q');
    setSearchInput('');
    setSearchParams(nextParams);
  };

  // SEO configuration: canonical always points to /blog.
  // When filters are active, set noindex, follow to avoid duplicate content penalty.
  const hasFilterParams = searchParams.has('rubrique') || searchParams.has('q');

  useSeo({
    title: 'Journal & Analyses | Stratégie Visuelle, Branding & Design',
    description:
      "Analyses, décryptages et principes graphiques pour transformer l'identité visuelle de votre entreprise en levier de conversion commerciale. Par Scott Nana.",
    canonicalUrl: 'https://www.wendclass.com/blog',
    ogImage: 'https://www.wendclass.com/og/banniere-class-s.png',
    ogType: 'website',
    noIndexFollow: hasFilterParams,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Le Journal Class S · Scott Nana',
      description:
        "Articles de référence sur le branding de luxe, la création de logos stratégiques et l'identité visuelle.",
      url: 'https://www.wendclass.com/blog',
      author: {
        '@type': 'Person',
        name: 'Scott Nana',
        jobTitle: 'Brand & Graphic Designer',
      },
    },
  });

  // Calculate article counts per rubrique (published only)
  const rubriqueCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    RUBRIQUES.forEach((r) => {
      counts[r.slug] = 0;
    });

    articles.forEach((a) => {
      if (a.status !== 'publie') return;
      const rub = a.rubrique || inferRubriqueFromTags(a.tags);
      if (rub && counts[rub] !== undefined) {
        counts[rub]++;
      }
    });

    return counts;
  }, [articles]);

  const totalPublishedCount = useMemo(() => {
    return articles.filter((a) => a.status === 'publie').length;
  }, [articles]);

  // Normalize string for case & accent insensitive comparison
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  // Filtered articles
  const filteredArticles = useMemo(() => {
    const q = normalize(searchInput);

    return articles.filter((a) => {
      if (a.status !== 'publie') return false;

      const artRubrique = a.rubrique || inferRubriqueFromTags(a.tags);
      const matchRubrique =
        selectedRubrique === 'tous' || artRubrique === selectedRubrique;

      if (!q) return matchRubrique;

      const rubricName = getRubriqueName(artRubrique);
      const matchTitle = normalize(a.title || '').includes(q);
      const matchExcerpt = normalize(a.excerpt || '').includes(q);
      const matchRub =
        normalize(artRubrique || '').includes(q) ||
        normalize(rubricName || '').includes(q);
      const matchTags = (a.tags || []).some((tag) =>
        normalize(tag).includes(q)
      );

      const matchSearch = matchTitle || matchExcerpt || matchRub || matchTags;

      return matchRubrique && matchSearch;
    });
  }, [articles, selectedRubrique, searchInput]);

  // Reading time helper
  const calculateReadingTime = (content: string): number => {
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const wordCount = plainText.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  return (
    <div className="min-h-screen bg-onyx text-ivoire-violet pt-24 pb-20 relative overflow-hidden font-body">
      {/* 1. HERO SECTION */}
      <BlogHero articles={articles} />

      {/* 2. FILTER & SEARCH BAR */}
      <div className="mt-8 mb-10">
        <BlogFilterBar
          selectedRubrique={selectedRubrique}
          onSelectRubrique={handleSelectRubrique}
          searchQuery={searchInput}
          onSearchChange={setSearchInput}
          rubriqueCounts={rubriqueCounts}
          totalCount={totalPublishedCount}
          filteredCount={filteredArticles.length}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* 3. ARTICLES GRID SECTION */}
      <div id="articles-grille" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-ardoise/40 border border-white/5 p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-video rounded-2xl bg-white/5" />
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-6 bg-white/10 rounded w-4/5" />
                <div className="h-4 bg-white/5 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 px-6 rounded-3xl bg-ardoise/30 border border-white/5 space-y-4 max-w-xl mx-auto">
            <BookOpen className="w-12 h-12 text-ivoire-violet/30 mx-auto" />
            <h3 className="text-xl font-serif text-white">
              Aucun article ne correspond à votre recherche
            </h3>
            <p className="text-sm text-ivoire-violet/60 leading-relaxed">
              {hasFilterParams
                ? 'Essayez de modifier votre mot-clé ou réinitialisez les filtres pour découvrir toutes nos publications.'
                : 'Les prochains articles stratégiques seront bientôt publiés.'}
            </p>
            {hasActiveFilters(hasFilterParams) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-imperial text-white text-xs font-semibold hover:bg-violet-imperial/80 transition-colors shadow-glow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser les filtres</span>
              </button>
            )}
          </div>
        ) : (
          /* Animated articles grid */
          <motion.div
            layout
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article) => {
                const readTime =
                  article.reading_time ||
                  calculateReadingTime(article.content || '');
                const formattedDate = new Date(
                  article.published_at || article.created_at
                ).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const artRubrique =
                  article.rubrique || inferRubriqueFromTags(article.tags);

                return (
                  <motion.article
                    key={article.id || article.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="group rounded-3xl bg-ardoise/60 border border-white/10 hover:border-violet-imperial/50 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
                  >
                    <div className="space-y-4">
                      {/* Cover image container */}
                      <Link
                        to={`/blog/${article.slug}`}
                        className="block aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 relative"
                      >
                        {article.cover_image ? (
                          <img
                            src={article.cover_image}
                            alt={article.cover_image_alt || article.title}
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-ivoire-violet/30 gap-1 bg-gradient-to-br from-ardoise to-onyx">
                            <img
                              src="/assets/logo/logo-blanc.png"
                              alt=""
                              aria-hidden="true"
                              className="w-10 h-10 opacity-20 object-contain select-none pointer-events-none"
                            />
                            <span className="text-[10px] tracking-wider uppercase text-ivoire-violet/40">
                              Class S Journal
                            </span>
                          </div>
                        )}

                        {/* Rubrique pastille over image (replaces raw arbitrary tags) */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-onyx/85 backdrop-blur-md text-amethyste border border-amethyste/30">
                            {getRubriqueName(artRubrique)}
                          </span>
                        </div>
                      </Link>

                      {/* Meta bar: Date & Reading time */}
                      <div className="flex items-center gap-3 text-xs text-ivoire-violet/50">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formattedDate}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{readTime} min de lecture</span>
                        </div>
                      </div>

                      {/* Title (H2 Cormorant Garamond font-serif) */}
                      <Link to={`/blog/${article.slug}`} className="block">
                        <h2 className="text-xl font-serif font-bold text-white group-hover:text-amethyste transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-ivoire-violet/70 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Read more footer */}
                    <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-ivoire-violet/50">
                        Par Scott Nana
                      </span>
                      <Link
                        to={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-or-champagne group-hover:text-amethyste transition-colors group-hover:translate-x-1"
                      >
                        <span>Lire l'article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 4. BOTTOM CTA BANNER */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-ardoise via-ardoise to-violet-imperial/30 border border-violet-imperial/30 shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Besoin d'une identité visuelle qui vous impose ?
            </h3>
            <p className="text-sm text-ivoire-violet/75 leading-relaxed">
              Ne laissez pas un design approximatif dévaluer vos compétences.
              Discutons de vos objectifs et créons un univers visuel à la hauteur
              de votre ambition.
            </p>
          </div>

          <CtaButton
            to="/#contact"
            variant="champagne"
            size="lg"
            icon={<ArrowUpRight className="w-5 h-5" />}
          >
            Prendre contact avec Scott
          </CtaButton>
        </div>
      </div>
    </div>
  );
};

// Helper for conditional rendering
function hasActiveFilters(val: boolean): boolean {
  return val;
}
