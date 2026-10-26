import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  Copy,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  DbArticle,
  fetchPublicArticleBySlug,
  fetchPublicArticles,
} from '../lib/supabase';
import { useSeo } from '../hooks/useSeo';
import { NotFound } from './NotFound';
import { SITE_CONFIG } from '../config/site';
import { CtaButton } from '../components/ui/CtaButton';
import DOMPurify from 'dompurify';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<DbArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [foundArticle, allArticles] = await Promise.all([
          fetchPublicArticleBySlug(slug),
          fetchPublicArticles(),
        ]);

        if (isMounted) {
          setArticle(foundArticle);
          // Set 2 related articles excluding the current one
          setRelatedArticles(allArticles.filter((a) => a.slug !== slug).slice(0, 2));
          setLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // SEO
  const currentUrl = `https://wendclass.vercel.app/blog/${article?.slug || slug || ''}`;
  const ogImage =
    article?.cover_image || SITE_CONFIG.ogImageUrl;

  useSeo({
    title: article?.title ? article.title : 'Article de Blog',
    description: article?.meta_description || article?.excerpt,
    canonicalUrl: currentUrl,
    ogImage,
    ogType: 'article',
    publishedTime: article?.published_at,
    modifiedTime: article?.updated_at,
    tags: article?.tags,
    jsonLd: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.meta_description || article.excerpt,
          image: [ogImage],
          datePublished: article.published_at || article.created_at,
          dateModified: article.updated_at || article.published_at || article.created_at,
          author: {
            '@type': 'Person',
            name: 'Scott Nana',
            jobTitle: 'Brand & Graphic Designer',
            url: 'https://wendclass.vercel.app/a-propos',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Class S',
            logo: {
              '@type': 'ImageObject',
              url: 'https://wendclass.vercel.app/assets/logo/logo-violet.png',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': currentUrl,
          },
        }
      : undefined,
  });

  const calculateReadingTime = (content: string): number => {
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const wordCount = plainText.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-onyx text-ivoire-violet pt-32 pb-20 max-w-4xl mx-auto px-4 space-y-8 animate-pulse font-body">
        <div className="h-6 w-36 bg-white/5 rounded-full" />
        <div className="h-12 w-4/5 bg-white/10 rounded-2xl" />
        <div className="h-6 w-1/2 bg-white/5 rounded-xl" />
        <div className="aspect-video w-full bg-white/5 rounded-3xl" />
        <div className="space-y-4 pt-4">
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-5/6 bg-white/5 rounded" />
          <div className="h-4 w-4/6 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (!article) {
    return <NotFound />;
  }

  const readTime = calculateReadingTime(article.content);
  const formattedDate = new Date(
    article.published_at || article.created_at
  ).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const shareText = `${article.title} — par Scott Nana (Class S)\n${currentUrl}`;

  return (
    <article className="min-h-screen bg-onyx text-ivoire-violet pt-28 pb-20 relative overflow-hidden font-body">
      {/* Subtle ambient lighting */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-violet-imperial/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Top Back Navigation Link */}
        <div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-ivoire-violet/60 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour aux articles</span>
          </Link>
        </div>

        {/* Article Header & Metadata */}
        <header className="space-y-6">
          {/* Tags list */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-imperial/20 text-amethyste border border-violet-imperial/30 tracking-wide uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-[1.15]">
            {article.title}
          </h1>

          {/* Meta & Author bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-6 border-b border-white/10">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-violet-imperial/30 border border-violet-imperial/50 flex items-center justify-center text-or-champagne font-serif font-bold text-base shadow-sm">
                SN
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Scott Nana</div>
                <div className="text-[11px] text-ivoire-violet/60">
                  Brand & Graphic Designer — Class S
                </div>
              </div>
            </div>

            {/* Date & Read time */}
            <div className="flex items-center gap-4 text-xs text-ivoire-violet/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-or-champagne" />
                <span>Publié le {formattedDate}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amethyste" />
                <span>{readTime} min de lecture</span>
              </div>
            </div>
          </div>
        </header>

        {/* Excerpt / Chapô quote block */}
        {article.excerpt && (
          <div className="p-6 rounded-3xl bg-ardoise/70 border-l-4 border-or-champagne border-white/10 shadow-soft">
            <p className="text-base sm:text-lg text-white/95 italic font-serif leading-relaxed">
              « {article.excerpt} »
            </p>
          </div>
        )}

        {/* Hero Cover Image */}
        {article.cover_image && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-soft-lg bg-black/40">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div
          className="prose prose-invert max-w-none text-base sm:text-lg text-ivoire-violet/90 leading-relaxed font-body
            [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:pt-4 [&>h2]:border-t [&>h2]:border-white/10
            [&>h3]:text-xl [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-or-champagne [&>h3]:mt-8 [&>h3]:mb-3
            [&>p]:mb-6 [&>p]:leading-relaxed
            [&>blockquote]:border-l-4 [&>blockquote]:border-or-champagne [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:text-lg [&>blockquote]:sm:text-xl [&>blockquote]:text-white [&>blockquote]:bg-white/5 [&>blockquote]:rounded-r-2xl [&>blockquote]:font-serif
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2
            [&>li]:text-ivoire-violet/90
            [&>strong]:text-white [&>strong]:font-semibold
            [&>a]:text-amethyste [&>a]:underline [&>a]:hover:text-white [&>a]:transition-colors"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
        />

        {/* Social Share Bar */}
        <div className="pt-8 pb-4 border-t border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-ivoire-violet/70 uppercase tracking-wider">
            <Share2 className="w-4 h-4 text-or-champagne" />
            <span>Partager cette analyse</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>WhatsApp</span>
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>LinkedIn</span>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>X (Twitter)</span>
            </a>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-xl bg-violet-imperial/20 hover:bg-violet-imperial/30 border border-violet-imperial/40 text-amethyste hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Lien copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier le lien</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-ardoise via-ardoise to-violet-imperial/30 border border-violet-imperial/30 shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 text-xs text-or-champagne font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Class S</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Prêt à concrétiser cette vision pour votre marque ?
            </h3>
            <p className="text-xs sm:text-sm text-ivoire-violet/75 leading-relaxed">
              Scott Nana conçoit des identités graphiques sur-mesure pour les entreprises exigeantes qui refusent de passer inaperçues.
            </p>
          </div>

          <CtaButton
            to="/#contact"
            variant="champagne"
            size="lg"
            icon={<ArrowUpRight className="w-5 h-5" />}
          >
            Échanger sur votre projet
          </CtaButton>
        </div>

        {/* Related Articles ("À lire également") */}
        {relatedArticles.length > 0 && (
          <div className="pt-8 space-y-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              À lire également
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group p-5 rounded-3xl bg-ardoise/60 border border-white/10 hover:border-violet-imperial/50 flex flex-col justify-between transition-all hover:-translate-y-1"
                >
                  <div className="space-y-2">
                    {rel.tags && rel.tags.length > 0 && (
                      <span className="text-[10px] text-or-champagne font-semibold uppercase tracking-wider">
                        {rel.tags[0]}
                      </span>
                    )}
                    <h4 className="font-serif text-lg font-bold text-white group-hover:text-amethyste transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-ivoire-violet/70 line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-ivoire-violet/50">
                    <span>Lire l'analyse</span>
                    <ArrowUpRight className="w-4 h-4 text-or-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
