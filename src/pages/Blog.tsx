import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { DbArticle, fetchPublicArticles } from '../lib/supabase';
import { useSeo } from '../hooks/useSeo';
import { CtaButton } from '../components/ui/CtaButton';

export const Blog: React.FC = () => {
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Tous');

  // Load articles
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

  // SEO configuration
  useSeo({
    title: 'Journal & Analyses — Stratégie Visuelle, Branding & Design',
    description:
      'Analyses, décryptages et principes graphiques pour transformer l\'identité visuelle de votre entreprise en levier de conversion commerciale. Par Scott Nana.',
    canonicalUrl: 'https://www.wendclass.com/blog',
    ogImage: 'https://www.wendclass.com/assets/logo/logo-violet.png',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Le Journal Class S — Scott Nana',
      description:
        'Articles de référence sur le branding de luxe, la création de logos stratégiques et l\'identité visuelle.',
      url: 'https://www.wendclass.com/blog',
      author: {
        '@type': 'Person',
        name: 'Scott Nana',
        jobTitle: 'Brand & Graphic Designer',
      },
    },
  });

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      (a.tags || []).forEach((t) => set.add(t));
    });
    return ['Tous', ...Array.from(set)];
  }, [articles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchTag =
        selectedTag === 'Tous' || (a.tags && a.tags.includes(selectedTag));
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)));
      return matchTag && matchSearch;
    });
  }, [articles, selectedTag, searchQuery]);

  // Reading time calculator
  const calculateReadingTime = (content: string): number => {
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const wordCount = plainText.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  return (
    <div className="min-h-screen bg-onyx text-ivoire-violet pt-28 pb-20 relative overflow-hidden font-body">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-violet-imperial/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-or-champagne/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-imperial/20 border border-violet-imperial/30 text-amethyste text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-or-champagne" />
            <span>Éditorial & Stratégie Visuelle</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
            Le Journal <span className="text-or-champagne">Class S</span>
          </h1>

          <p className="text-base sm:text-lg text-ivoire-violet/70 leading-relaxed font-body">
            Analyses, décryptages et principes graphiques pour transformer votre image de marque en levier d'affaires indiscutable.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-3xl bg-ardoise/60 border border-white/10 shadow-soft backdrop-blur-md space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Tag chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <Filter className="w-4 h-4 text-ivoire-violet/40 shrink-0 ml-1" />
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    selectedTag === tag
                      ? 'bg-violet-imperial text-white shadow-glow'
                      : 'bg-white/5 text-ivoire-violet/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-ivoire-violet/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une analyse..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-ivoire-violet/40 focus:outline-none focus:border-violet-imperial/80 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Articles Grid */}
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
          <div className="text-center py-20 px-4 rounded-3xl bg-ardoise/30 border border-white/5 space-y-4">
            <BookOpen className="w-12 h-12 text-ivoire-violet/30 mx-auto" />
            <h3 className="text-xl font-serif text-white">Aucun article trouvé</h3>
            <p className="text-sm text-ivoire-violet/60 max-w-md mx-auto">
              Aucune publication ne correspond à vos filtres actuels. Essayez un autre mot-clé ou réinitialisez le filtre.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedTag('Tous');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-violet-imperial/50 hover:bg-violet-imperial text-white text-xs font-semibold transition-colors"
            >
              Afficher tous les articles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => {
              const readTime = calculateReadingTime(article.content);
              const formattedDate = new Date(
                article.published_at || article.created_at
              ).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <article
                  key={article.id}
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
                          alt={article.title}
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-ivoire-violet/30 gap-1 bg-gradient-to-br from-violet-imperial/20 to-black/60">
                          <BookOpen className="w-8 h-8 text-amethyste/40" />
                          <span className="text-xs">Class S Editorial</span>
                        </div>
                      )}

                      {/* Primary Tag badge over image */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-onyx/85 backdrop-blur-md text-or-champagne border border-or-champagne/30">
                            {article.tags[0]}
                          </span>
                        </div>
                      )}
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

                    {/* Title */}
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
                    <span className="text-xs text-ivoire-violet/50">Par Scott Nana</span>
                    <Link
                      to={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-or-champagne group-hover:text-amethyste transition-colors group-hover:translate-x-1"
                    >
                      <span>Lire l'article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-ardoise via-ardoise to-violet-imperial/30 border border-violet-imperial/30 shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Besoin d'une identité visuelle qui vous impose ?
            </h3>
            <p className="text-sm text-ivoire-violet/75 leading-relaxed">
              Ne laissez pas un design approximatif dévaluer vos compétences. Discutons de vos objectifs et créons un univers visuel à la hauteur de votre ambition.
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
