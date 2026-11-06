import fs from 'fs';
import path from 'path';
import { offerFamilies, websiteFormats, GUIDE_SITUATIONS } from './data/offres';
import { projectsData, Project } from './data/projets';
import { FAQ_ITEMS } from './data/faq';
import { SITE_URL, SITE_CONFIG } from './config/site';
import { getOptimizedImage } from './lib/images';
import { getRubriqueName, inferRubriqueFromTags } from './config/rubriques';
import { getProjectAccroche } from './lib/projectHelpers';

// Supabase configuration
const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://mtinydrkpxffrlsuwpzh.supabase.co';
const supabaseKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

// Fallback mock articles for resilience
const fallbackArticles: Record<string, any> = {
  'identite-visuelle-definition-entrepreneur': {
    title: "Identité visuelle : à quoi sert-elle à un entrepreneur ?",
    meta_title: "Identité visuelle : à quoi sert-elle à un entrepreneur ?",
    meta_description: "Identité visuelle : définition, éléments, différence avec la charte graphique et raisons pour lesquelles un entrepreneur en a besoin.",
    excerpt: "Votre identité visuelle est la première chose que vos clients voient de votre entreprise. Elle ne se résume pas au logo : couleurs, typographies et images en font aussi partie. Entrepreneur au Burkina Faso, découvrez comment elle construit votre image de marque.",
    published_at: "2026-11-03T09:00:00Z",
    rubrique: "identite-visuelle",
    status: "publie",
    tags: ["Identité visuelle", "Charte graphique", "Logo", "Branding", "Burkina Faso"],
    reading_time: 4,
    created_at: "2026-10-31T01:46:00.000Z",
    updated_at: "2026-10-31T01:46:00.000Z",
    content: `<p>Imaginez deux boutiques de vêtements sur Facebook. Elles vendent les mêmes articles au même prix. L’une a des couleurs, une police et un logo cohérents, l’autre change d’allure à chaque publication.</p>
<p>Laquelle semble la plus sérieuse ? Laquelle reconnaissez-vous en un coup d’œil ? La réponse vient presque toujours sans effort.</p>
<p>Cette différence porte un nom : l’identité visuelle. Dans cet article, vous découvrez ce qu’elle contient et pourquoi elle compte pour votre entreprise. Vous repartez avec des signes concrets pour savoir si la vôtre est à revoir.</p>
<h2>L’identité visuelle, c’est bien plus qu’un logo</h2>
<p>L’identité visuelle désigne l’ensemble des éléments visuels qui représentent une marque. On y trouve le logo, les couleurs, les typographies, les images et les icônes. Ensemble, ils distinguent l’entreprise de ses concurrents.</p>
<p>Le logo n’en est que la partie la plus visible. Beaucoup d’entrepreneurs s’arrêtent à lui et oublient le reste. Un logo seul ne construit pas une marque reconnaissable.</p>
<p>Pensez à la manière dont vous reconnaissez un ami dans une foule. Vous ne vous fiez pas seulement à son visage, mais aussi à sa silhouette, sa démarche et son parfum. Une marque se reconnaît de la même façon.</p>
<h2>Les éléments qui composent une identité visuelle</h2>
<p>Le logo reste le point d’entrée. Il doit rester lisible en grand comme en petit. Il doit aussi fonctionner en couleur comme en noir et blanc.</p>
<p>La palette de couleurs donne le ton. Deux ou trois couleurs principales suffisent souvent. Une identité visuelle repose en général sur deux ou trois polices au maximum.</p>
<p>Viennent ensuite les images, les icônes, les motifs et la mise en page. Ces éléments donnent un style propre à vos affiches, vos publications et votre site. Ils forment la signature visuelle de votre entreprise.</p>
<h2>Identité visuelle, charte graphique, branding : quelle différence ?</h2>
<p>Ces trois termes se confondent souvent. Pourtant, chacun désigne une chose précise. Les distinguer vous évite des malentendus avec un graphiste.</p>
<p>L’identité visuelle est la personnalité graphique d’une marque, et la charte graphique en est le <a href="https://www.canva.com/fr_fr/decouvrir/identite-visuelle-et-charte-graphique/" target="_blank" rel="noopener noreferrer">mode d’emploi</a>. Cette charte fixe les règles d’usage du logo, des couleurs et des polices. Elle garantit que les graphistes, les imprimeurs et les responsables des réseaux sociaux appliquent l’identité de la même façon.</p>
<p>Le branding est plus large. C’est le processus qui définit le message et l’identité de marque que vous souhaitez transmettre au public. L’identité visuelle en est l’expression graphique.</p>
<h2>Pourquoi un entrepreneur en a besoin</h2>
<p>Une identité visuelle cohérente rend votre entreprise reconnaissable. Vos clients vous repèrent plus vite dans un fil d’actualité chargé. Ils vous associent à une qualité précise.</p>
<p>La cohérence inspire aussi confiance. Une étude de Lucidpress, aujourd’hui Marq, avance qu’une présentation cohérente de la marque peut accroître les revenus jusqu’à 33 %. Ce chiffre vient d’un éditeur de logiciels de marque : lisez-le comme une tendance, pas comme une promesse.</p>
<p>Elle vous fait enfin gagner du temps. Avec des règles claires, chaque affiche ou publication se crée plus vite. Vous évitez de repartir de zéro à chaque fois.</p>
<h2>Vos clients vous voient d’abord sur les réseaux sociaux</h2>
<p>Facebook domine largement parmi les réseaux sociaux mesurés au Burkina Faso. Selon <a href="https://napoleoncat.com/stats/facebook-users-in-burkina-faso/" target="_blank" rel="noopener noreferrer">NapoleonCat</a>, le pays comptait environ 4,8 millions d’utilisateurs en septembre 2026. Cela représente un peu plus de 19 % de la population.</p>
<p>À titre de comparaison, LinkedIn comptait environ 600 000 membres et Instagram environ 231 000 à la même date. Chaque plateforme n’a pas le même public. Votre identité visuelle doit pourtant rester la même partout.</p>
<p>Votre première impression se joue donc souvent sur un écran de téléphone, en quelques instants. Votre photo de profil, votre couverture et vos visuels parlent avant vous. Un ensemble soigné donne une image sérieuse dès le premier regard.</p>
<h2>Les signes qu’il est temps de revoir votre identité</h2>
<p>Votre logo est flou ou illisible en petit format. Vos couleurs changent d’une publication à l’autre. Chaque support semble venir d’une entreprise différente.</p>
<p>Vos clients vous confondent avec un concurrent. Vous hésitez à montrer votre marque à de gros clients. Votre site, vos affiches et vos réseaux n’ont aucun point commun.</p>
<p>Un seul de ces signes mérite déjà votre attention. Plusieurs d’entre eux annoncent le moment de structurer votre identité. Mieux vaut le faire avant d’imprimer ou de publier en masse.</p>
<h2>Par où commencer ?</h2>
<p>Commencez par clarifier ce que votre entreprise représente et pour qui. Choisissez ensuite vos couleurs, vos typographies et votre logo. Rassemblez enfin ces règles dans une charte graphique.</p>
<p>Vous pouvez le faire seul, mais un graphiste vous évite les erreurs de départ. Il traduit vos valeurs en éléments visuels cohérents. Il vous remet aussi un document pour garder le cap.</p>
<p>Chez Class S, je crée des <a href="/offres">identités visuelles</a> pour entrepreneurs et startups. Si vous préparez la vôtre, parlons de votre projet. Le <a href="/contact">formulaire de contact</a> est à votre disposition.</p>`,
  },

  'pourquoi-un-logo-seul-ne-sauvera-pas-votre-entreprise': {
    title: "Pourquoi un logo seul ne sauvera jamais votre entreprise (et ce qu'il vous faut vraiment)",
    excerpt: "Beaucoup d'entrepreneurs pensent qu'un joli logo suffit à attirer des clients haut de gamme. En réalité, un logo sans système d'identité visuelle est une coquille vide. Décryptage d'une erreur coûteuse.",
    meta_description: "Découvrez pourquoi un logo seul ne suffit pas à asseoir votre crédibilité et comment un véritable système d'identité visuelle transforme la perception de votre entreprise.",
    cover_image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
    published_at: '2026-10-09T10:00:00.000Z',
    rubrique: 'strategie-de-marque',
    content: "<p>Un logo sans écosystème visuel ne crée aucune valeur perçue. Bâtissez un univers complet pour inspirer confiance et justifier des tarifs premium.</p>",
  },
  '5-erreurs-graphiques-reseaux-sociaux-credibilite': {
    title: 'Les 5 erreurs graphiques sur les réseaux sociaux qui détruisent votre crédibilité',
    excerpt: "Des visuels saturés, des polices illisibles, une incohérence de couleurs d'un post à l'autre... Voici les faux pas visuels qui font fuir vos prospects qualifiés et comment les corriger sans tarder.",
    meta_description: "Typographies illisibles, manque de cohérence chromatique, surcharge d'informations : évitez ces 5 erreurs graphiques qui font fuir vos prospects sur les réseaux sociaux.",
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    published_at: '2026-10-05T10:00:00.000Z',
    rubrique: 'reseaux-sociaux',
    content: "<p>Sur les réseaux sociaux, 1,7 seconde décide de l'attention d'un prospect. Évitez les erreurs graphiques qui ruinent votre professionnalisme.</p>",
  },
  'transformer-identite-visuelle-en-levier-de-conversion': {
    title: 'Comment transformer une identité visuelle en levier de conversion commerciale',
    excerpt: "Le design n'est pas une simple décoration esthétique : c'est un outil de vente puissant. Découvrez comment structurer votre univers de marque pour inspirer confiance et justifier des tarifs premium.",
    meta_description: "Le design graphique n'est pas une simple dépense esthétique : c'est un investissement stratégique qui réduit les frictions de vente et justifie des tarifs élevés.",
    cover_image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
    published_at: '2026-09-28T10:00:00.000Z',
    rubrique: 'business-conversion',
    content: "<p>Le design graphique est un multiplicateur de conversion commerciale. Découvrez comment structurer votre marque pour réduire les objections de prix.</p>",
  },
};

// Fetch published projects from Supabase with local fallback
async function getProjects(): Promise<Project[]> {
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/projets?select=*,projet_images(*)&status=eq.publie&order=display_order.asc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((p: any) => {
            const sortedImages = (p.projet_images || []).sort(
              (a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)
            );
            const hero = sortedImages.find((img: any) => img.is_hero) || sortedImages[0];
            return {
              id: p.id,
              slug: normalizeProjectSlug(p.slug || p.id),
              title: p.title,
              category: p.category,
              tagline: p.tagline,
              accroche: p.accroche,
              clientGoal: p.client_goal,
              designedSolution: p.designed_solution,
              result: p.result,
              disclaimer: p.disclaimer,
              heroImage: hero ? hero.image_url : '/assets/logo/logo-violet.png',
              gallery: sortedImages.map((img: any) => ({
                src: img.image_url,
                caption: img.caption || p.title,
              })),
            };
          });
        }
      }
    } catch (err) {
      console.warn('[SSR] Supabase projects fetch fallback:', err);
    }
  }
  return projectsData;
}

// Fetch published testimonials from Supabase with local fallback
async function getTestimonials(): Promise<any[]> {
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/temoignages?select=*&status=eq.publie&order=display_order.asc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[SSR] Supabase testimonials fetch fallback:', err);
    }
  }
  return projectsData
    .filter((p) => p.testimonialPlaceholder)
    .map((p) => ({
      id: `testim-${p.id}`,
      author_name: p.title.includes('72') ? 'Comité 72h CJ' : p.title.includes('Bang') ? 'Fondateur' : 'Client',
      author_role_company: p.title,
      content: p.testimonialPlaceholder || '',
      rating: 5,
      impact_result: p.result,
    }));
}

// Fetch single article or list from Supabase
async function getArticle(slug: string): Promise<any> {
  let art = fallbackArticles[slug] || null;
  if (slug && supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.publie&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          art = list[0];
        }
      }
    } catch (err) {
      console.warn('[SSR] Supabase article fetch fallback:', err);
    }
  }
  if (!art) return null;
  if (art.status !== 'publie') return null;
  if (art.published_at && new Date(art.published_at).getTime() > Date.now()) {
    return null; // Scheduled publication: not available yet -> 404
  }
  return art;
}

async function getArticlesList(): Promise<any[]> {
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=slug,title,excerpt,cover_image,cover_image_alt,published_at,rubrique,reading_time,tags&status=eq.publie&order=published_at.desc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      }
    } catch (err) {
      console.warn('[SSR] Supabase articles list fetch fallback:', err);
    }
  }
  return Object.keys(fallbackArticles).map((slug) => ({
    slug,
    ...fallbackArticles[slug],
  }));
}




export function normalizeProjectSlug(idOrSlug: string): string {
  if (!idOrSlug) return '';
  const clean = idOrSlug.toLowerCase().trim();
  if (clean === '72h-cj-2026' || clean.includes('72h') || clean.includes('72-heures') || clean.includes('72')) {
    return '72-heures-cj-2026';
  }
  if (clean.includes('frere') || clean.includes('frère')) {
    return 'mon-frere-parle';
  }
  if (clean.includes('off') || clean.includes('day')) {
    return 'off-day';
  }
  if (clean.includes('cafe') || clean.includes('café') || clean.includes('inspire')) {
    return 'cafe-inspire';
  }
  if (clean.includes('bang')) {
    return 'bang';
  }
  return clean;
}

// Fetch 301 redirect for project slugs
async function getProjectRedirect(slug: string): Promise<string | null> {
  if (slug === '72h-cj-2026' || slug === '72h') return '72-heures-cj-2026';
  if (slug && supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/projet_redirects?select=new_slug&old_slug=eq.${encodeURIComponent(slug)}&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0 && list[0]?.new_slug) {
          return list[0].new_slug;
        }
      }
    } catch (err) {
      console.warn('[SSR] Supabase project redirect fetch fallback:', err);
    }
  }
  return null;
}

// Fetch 301 redirect for article slugs
async function getArticleRedirect(slug: string): Promise<string | null> {
  if (slug && supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/article_redirects?select=new_slug&old_slug=eq.${encodeURIComponent(slug)}&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0 && list[0]?.new_slug) {
          return list[0].new_slug;
        }
      }
    } catch (err) {
      console.warn('[SSR] Supabase redirect fetch fallback:', err);
    }
  }
  return null;
}

// Server-side strict HTML sanitizer
function sanitizeServerHtml(html: string): string {
  if (!html) return '';

  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '');

  clean = clean.replace(/\s+on[a-z0-9_-]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
  clean = clean.replace(/\s+style\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  clean = clean.replace(/<h1(\b[^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');
  clean = clean.replace(/<h[4-6](\b[^>]*)>/gi, '<h3$1>').replace(/<\/h[4-6]>/gi, '</h3>');

  clean = clean.replace(/<a\b([^>]*)>/gi, (_, attrs) => {
    const hrefMatch = attrs.match(/href\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+))/i);
    const href = hrefMatch ? (hrefMatch[1] || hrefMatch[2] || hrefMatch[3] || '') : '';
    const lowerHref = href.toLowerCase().trim();

    if (
      lowerHref.startsWith('javascript:') ||
      lowerHref.startsWith('data:') ||
      lowerHref.startsWith('vbscript:')
    ) {
      return '<span>';
    }

    const isExternal = lowerHref.startsWith('http://') || lowerHref.startsWith('https://');
    let newAttrs = attrs
      .replace(/\s+rel\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
      .replace(/\s+target\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

    if (isExternal) {
      newAttrs += ' target="_blank" rel="noopener noreferrer"';
    }

    return `<a ${newAttrs.trim()}>`;
  });

  clean = clean.replace(/<img\b([^>]*)>/gi, (_, attrs) => {
    const getAttr = (name: string) => {
      const m = attrs.match(new RegExp(`${name}\\s*=\\s*(?:'([^']*)'|"([^"]*)"|([^\\s>]+))`, 'i'));
      return m ? (m[1] || m[2] || m[3] || '') : null;
    };

    const src = getAttr('src');
    if (!src) return '';

    const alt = getAttr('alt') || '';
    const srcset = getAttr('srcset');
    const sizes = getAttr('sizes');
    const width = getAttr('width');
    const height = getAttr('height');

    let out = `<img src="${src}" alt="${alt.replace(/"/g, '&quot;')}" loading="lazy" decoding="async"`;
    if (srcset) out += ` srcset="${srcset.replace(/"/g, '&quot;')}"`;
    if (sizes) out += ` sizes="${sizes.replace(/"/g, '&quot;')}"`;
    if (width) out += ` width="${width}"`;
    if (height) out += ` height="${height}"`;
    out += ' class="rounded-2xl w-full my-6 border border-white/10 shadow-lg object-cover" />';
    return out;
  });

  return clean.trim();
}

function render404Content(): string {
  return `
    <main class="min-h-[85vh] flex flex-col justify-center py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 font-body" style="font-family:'Jost', sans-serif; color:#0D0A18;">
      <span class="sr-only">Erreur 404 : Page introuvable</span>

      <div class="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider" style="background-color:rgba(102,0,204,0.1); border:1px solid rgba(102,0,204,0.2); color:#6600CC; display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:9999px;">
          <span>Erreur 404 • Hors piste</span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-[1.15] tracking-tight" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18; font-size:2.5rem; line-height:1.15; margin:1rem 0;">
          Page introuvable. Votre image, elle, ne devrait jamais l’être.
        </h1>

        <p class="text-sm sm:text-base text-onyx/75 max-w-xl mx-auto leading-relaxed" style="color:rgba(13,10,24,0.75); font-size:1rem; max-width:36rem; margin:0 auto; line-height:1.6;">
          L’adresse demandée n’existe pas ou a été déplacée. En attendant de retrouver votre chemin, esquivez les visuels sans âme pour les corriger avec l’identité Class S.
        </p>
      </div>

      <div class="w-full max-w-4xl mx-auto mb-8 aspect-[16/6] min-h-[260px] rounded-3xl bg-onyx/5 border border-violet-imperial/10 flex flex-col items-center justify-center space-y-3" style="background-color:rgba(13,10,24,0.04); border:1px solid rgba(102,0,204,0.15); border-radius:1.5rem; min-height:260px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <span class="text-xs text-onyx/60" style="color:rgba(13,10,24,0.6); font-size:0.875rem;">Chargement du jeu runner...</span>
      </div>

      <div class="text-center pt-2">
        <a href="/" class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-onyx/70 hover:text-violet-imperial transition-colors" style="color:rgba(13,10,24,0.7); font-size:0.875rem; text-decoration:none; font-weight:600;">
          ← Ou quitter le jeu et revenir directement à l’accueil
        </a>
      </div>
    </main>
  `;
}

export default async function handler(req: any, res: any) {
  const baseUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || SITE_URL;
  const rawRoute = (req.query?.route as string) || req.url?.split('?')[0] || '/';
  // Clean and normalize incoming route
  const cleanPath = (rawRoute.split('?')[0] || '/').replace(/\/+$/, '') || '/';

  // Section 9.7: Missing static files return raw 404 text/plain without full page
  if (/\.(js|css|png|jpg|jpeg|webp|svg|ico|map|woff|woff2|ttf|json|txt|xml|pdf)$/i.test(cleanPath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(404).send('404 Not Found');
  }
  const slug =
    (cleanPath.startsWith('/blog/')
      ? cleanPath.slice('/blog/'.length)
      : (req.query?.slug as string) || '');
  const projectSlug =
    (cleanPath.startsWith('/projets/')
      ? cleanPath.slice('/projets/'.length)
      : '');

  let normalizedRoute = '/';
  if (cleanPath === '/contact') {
    res.setHeader('Location', `${baseUrl}/#contact`);
    return res.status(301).end();
  }
  if (cleanPath === '/') normalizedRoute = '/';
  else if (cleanPath === '/offres') normalizedRoute = '/offres';
  else if (cleanPath === '/projets') normalizedRoute = '/projets';
  else if (cleanPath.startsWith('/projets/')) normalizedRoute = '/projets/:slug';
  else if (cleanPath === '/a-propos') normalizedRoute = '/a-propos';
  else if (cleanPath.startsWith('/blog/')) normalizedRoute = '/blog/:slug';
  else if (cleanPath === '/blog') normalizedRoute = '/blog';
  else normalizedRoute = '404';

  // Load HTML template
  let html = '';
  const candidatePaths = [
    path.join(process.cwd(), 'dist', 'app.html'),
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(process.cwd(), 'index.html'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        html = fs.readFileSync(p, 'utf-8');
        break;
      } catch {}
    }
  }

  if (!html) {
    html = `<!doctype html><html lang="fr"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Class S</title></head><body class="bg-ivoire-violet text-onyx font-body"><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`;
  }

  let pageTitle = SITE_CONFIG.defaultTitle;
  let pageDesc = SITE_CONFIG.defaultDescription;
  let pageCanonical = `${baseUrl}/`;
  let pageImage = SITE_CONFIG.ogImageUrl;
  let pageImageWidth = 1200;
  let pageImageHeight = 630;
  let pageImageAlt = "Class S — Studio d'Identité Visuelle & Brand Design par Scott Nana";
  let pageType = 'website';
  let ssrContent = '';
  let jsonLd: any = null;
  let statusCode = 200;
  let isNoIndex = false;
  let isNoIndexFollow = false;
  let extraMetaTags = '';

  // ROUTE 1: ACCUEIL (/)
  if (normalizedRoute === '/') {
    pageTitle = "Class S — L'identité visuelle qui vous impose | Scott Nana";
    pageDesc =
      "Class S est un studio d'identité visuelle à Ouagadougou, au service des entrepreneurs et des PME. D'une image qui existe à une image qui fait vendre.";
    pageCanonical = `${baseUrl}/`;

    const projects = await getProjects();
    const testimonials = await getTestimonials();

    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfessionalService',
          '@id': `${baseUrl}/#organization`,
          name: SITE_CONFIG.name,
          alternateName: SITE_CONFIG.alternateName,
          url: `${baseUrl}/`,
          logo: SITE_CONFIG.logoUrl,
          image: pageImage,
          description: SITE_CONFIG.anchorPhrase,
          founder: {
            '@type': 'Person',
            name: SITE_CONFIG.founder,
            jobTitle: SITE_CONFIG.jobTitle,
            sameAs: Object.values(SITE_CONFIG.socialLinks),
          },
          areaServed: {
            '@type': 'AdministrativeArea',
            name: 'Ouagadougou, Burkina Faso',
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: SITE_CONFIG.name,
          url: `${baseUrl}/`,
          description: pageDesc,
          publisher: {
            '@id': `${baseUrl}/#organization`,
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${baseUrl}/#faq`,
          mainEntity: FAQ_ITEMS.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        },
      ],
    };

    ssrContent = `
      <main class="space-y-0" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- 1. Hero Section: Exact parity with Accueil.tsx 2-column grid -->
        <section class="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <!-- Left Copy: lg:col-span-6 matching React component perfectly -->
              <div class="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
                  <span>Brand & Graphic Design • Ouagadougou</span>
                </div>

                <h1 class="text-[2.2rem] sm:text-5xl lg:text-6xl xl:text-7xl font-title font-semibold text-onyx leading-[1.1] tracking-tight" style="font-family:'Cormorant Garamond', Georgia, serif;">
                  D'une image qui existe à une image qui fait vendre.
                </h1>

                <p class="text-base sm:text-lg lg:text-xl text-onyx/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Avant chaque projet, je définis ce que vos clients doivent faire, puis je conçois chaque élément pour les y conduire.
                </p>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <a href="/#contact" class="px-6 py-3.5 bg-[#6600CC] text-white font-semibold rounded-full inline-block text-center text-sm sm:text-base">Prendre contact</a>
                  <a href="/projets" class="px-6 py-3.5 border border-onyx/20 text-onyx font-semibold rounded-full inline-block text-center text-sm sm:text-base">Voir mes réalisations</a>
                </div>

                <div class="pt-6 border-t border-violet-imperial/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-onyx/70">
                  <span>✓ Direction artistique sur mesure</span>
                  <span>✓ Délais d'exécution rapides</span>
                  <span>✓ Zéro modèle générique</span>
                </div>
              </div>

              <!-- Right Visual Showcase: aligned on first React mount (bg-onyx container SANS image with aria-label) -->
              <div class="lg:col-span-6 w-full">
                <div class="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
                  <div class="relative bg-onyx rounded-2xl md:rounded-3xl p-3 sm:p-4 shadow-soft-lg border border-violet-imperial/20 overflow-hidden">
                    <div class="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-white/10 text-xs text-ivoire-violet/70">
                      <div class="flex items-center gap-2">
                        <span class="inline-block w-2.5 h-2.5 rounded-full bg-amethyste"></span>
                        <span class="font-medium tracking-wide uppercase text-[11px] text-or-champagne">Vitrine de projets Class S</span>
                      </div>
                      <span class="text-[11px] text-ivoire-violet/50">Direction Artistique</span>
                    </div>
                    <div class="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-xl overflow-hidden bg-onyx/90" aria-label="Vitrine animée des projets Class S">
                      <div class="w-full h-full grid grid-cols-4 grid-rows-4 gap-[2px] bg-onyx"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Promesse -->
        <section class="py-12 bg-[#0D0A18] text-white text-center px-4">
          <span class="text-xs uppercase font-semibold tracking-widest text-[#C9A070] block mb-2">La promesse Class S</span>
          <p class="text-xl sm:text-2xl font-title italic max-w-3xl mx-auto mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
            « Si vous me confiez votre image, chaque visuel est pensé pour que celui qui le voit prenne contact, et que votre activité vende plus. »
          </p>
          <span class="text-xs text-[#A87FE8]">— Scott Nana, Fondateur de Class S</span>
        </section>

        <!-- Méthode en 3 étapes -->
        <section class="py-16 max-w-6xl mx-auto px-4">
          <h2 class="text-2xl sm:text-3xl font-title font-semibold text-center mb-10" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Une méthode rigoureuse en 3 étapes
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 bg-white rounded-2xl border border-violet-imperial/10 shadow-soft">
              <span class="text-xs font-bold text-[#C9A070] uppercase">Étape 01</span>
              <h3 class="text-xl font-title font-semibold my-2">Le Cadrage Stratégique</h3>
              <p class="text-sm text-onyx/75">Avant d'ouvrir un logiciel de création, nous identifions précisément qui sont vos clients idéaux, quel message doit passer et quelle action concrète ils doivent accomplir.</p>
            </div>
            <div class="p-6 bg-white rounded-2xl border border-violet-imperial/10 shadow-soft">
              <span class="text-xs font-bold text-[#C9A070] uppercase">Étape 02</span>
              <h3 class="text-xl font-title font-semibold my-2">La Conception Sans Modèle</h3>
              <p class="text-sm text-onyx/75">Création sur mesure d'une identité originale : typographies, palettes de couleurs, hiérarchies visuelles. Zéro modèle générique pour que votre marque ne ressemble à aucune autre.</p>
            </div>
            <div class="p-6 bg-white rounded-2xl border border-violet-imperial/10 shadow-soft">
              <span class="text-xs font-bold text-[#C9A070] uppercase">Étape 03</span>
              <h3 class="text-xl font-title font-semibold my-2">La Livraison Opérationnelle</h3>
              <p class="text-sm text-onyx/75">Remise de l'ensemble des fichiers prêts à l'emploi (print et digital), guide d'utilisation clair et accompagnement pour un déploiement fluide et immédiat.</p>
            </div>
          </div>
        </section>

        <!-- Preuve par les projets récents -->
        <section class="py-16 max-w-7xl mx-auto px-4 bg-white/50">
          <h2 class="text-2xl sm:text-3xl font-title font-semibold text-center mb-8" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Des images conçues pour faire vendre
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${projects.slice(0, 3).map((p) => `
              <article class="bg-white rounded-2xl p-6 border border-violet-imperial/10 shadow-soft">
                <span class="text-xs uppercase font-semibold text-[#C9A070]">${p.category}</span>
                <h3 class="text-xl font-title font-semibold my-2">${p.title}</h3>
                <p class="text-sm text-onyx/75 mb-3">${p.tagline}</p>
                <div class="text-xs text-onyx/80 space-y-1">
                  <p><strong>But :</strong> ${p.clientGoal}</p>
                  <p><strong>Résultat :</strong> ${p.result}</p>
                </div>
              </article>
            `).join('')}
          </div>
          <div class="text-center mt-8">
            <a href="/projets" class="text-[#6600CC] font-semibold hover:underline">Découvrir toutes les réalisations →</a>
          </div>
        </section>

        <!-- Mur de témoignages -->
        ${testimonials.length > 0 ? `
          <section class="py-16 bg-[#0D0A18] text-white px-4">
            <h2 class="text-2xl sm:text-3xl font-title font-semibold text-center mb-8 text-white" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Ce que disent les dirigeants accompagnés
            </h2>
            <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              ${testimonials.slice(0, 4).map((t) => `
                <blockquote class="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p class="text-sm italic mb-4 text-[#F8F5FF]/90">« ${t.content} »</p>
                  <footer class="text-xs text-[#C9A070] font-semibold">${t.author_name} ${t.author_role_company ? `— ${t.author_role_company}` : ''}</footer>
                </blockquote>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- FAQ -->
        <section class="py-16 max-w-4xl mx-auto px-4">
          <h2 class="text-2xl sm:text-3xl font-title font-semibold text-center mb-8" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Questions fréquentes
          </h2>
          <div class="space-y-4">
            ${FAQ_ITEMS.map((faq) => `
              <div class="p-5 bg-white rounded-2xl border border-violet-imperial/10">
                <h3 class="font-semibold text-base mb-2 text-onyx">${faq.question}</h3>
                <p class="text-sm text-onyx/80 leading-relaxed">${faq.answer}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Ancrage Footer -->
        <footer class="py-10 border-t border-violet-imperial/10 text-center text-xs text-onyx/70 max-w-4xl mx-auto px-4">
          <p class="font-medium text-onyx mb-1">${SITE_CONFIG.anchorPhrase}</p>
          <p>© ${new Date().getFullYear()} Class S • Scott Nana. Tous droits réservés.</p>
        </footer>
      </main>
    `;
  }

  // ROUTE 2: OFFRES (/offres)
  else if (normalizedRoute === '/offres') {
    pageTitle = "Formules & Accompagnement Brand Design | Class S";
    pageDesc =
      "Découvrez nos 5 forfaits d'accompagnement : Logo & Identité Visuelle, Branding Social Media, Communication Événementielle, Sites Web et Visuels 24h à Ouagadougou.";
    pageCanonical = `${baseUrl}/offres`;

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      url: pageCanonical,
      description: pageDesc,
      provider: {
        '@type': 'ProfessionalService',
        name: SITE_CONFIG.name,
        url: baseUrl,
      },
      mainEntity: {
        '@type': 'OfferCatalog',
        name: "Catalogue des forfaits d'accompagnement Class S",
        numberOfItems: offerFamilies.length,
        itemListElement: offerFamilies.map((fam, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Service',
            name: fam.title,
            description: fam.subtitle,
            provider: {
              '@type': 'ProfessionalService',
              name: SITE_CONFIG.name,
            },
          },
        })),
      },
    };

    const renderTable = (headers: { id: string; label: string }[], rows: { label: string; values: Record<string, string | boolean> }[], caption: string, isDark = false) => {
      const borderCol = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(102,0,204,0.15)';
      const bgHeader = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(102,0,204,0.05)';
      const textCol = isDark ? '#F8F5FF' : '#0D0A18';
      return `
        <div style="overflow-x:auto; margin: 2rem 0;">
          <table style="width:100%; border-collapse:collapse; font-size:0.875rem; text-align:left; border:1px solid ${borderCol}; color:${textCol};">
            <caption style="text-align:left; font-weight:600; padding:0.5rem 0; font-size:1rem;">${caption}</caption>
            <thead>
              <tr style="background:${bgHeader}; border-bottom:2px solid ${borderCol};">
                <th scope="col" style="padding:12px 16px;">Critère</th>
                ${headers.map(h => `<th scope="col" style="padding:12px 16px; text-align:center;">${h.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(r => `
                <tr style="border-bottom:1px solid ${borderCol};">
                  <th scope="row" style="padding:10px 16px; font-weight:500;">${r.label}</th>
                  ${headers.map(h => {
                    const val = r.values[h.id];
                    let text = '-';
                    if (val === true) text = '✓ Inclus';
                    else if (val === false) text = '-';
                    else if (val) text = String(val);
                    return `<td style="padding:10px 16px; text-align:center;">${text}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    };

    const familyLogo = offerFamilies.find(f => f.id === 'logo-identite')!;
    const familySocial = offerFamilies.find(f => f.id === 'branding-social-media')!;
    const familyEvent = offerFamilies.find(f => f.id === 'communication-evenementielle')!;
    const familyWeb = offerFamilies.find(f => f.id === 'sites-web')!;
    const familySingle = offerFamilies.find(f => f.id === 'visuels-a-lunite')!;

    ssrContent = `
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Entête compact -->
        <header class="text-center max-w-3xl mx-auto mb-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Nos formules d'accompagnement</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Des formules conçues pour faire grandir votre activité
          </h1>
          <p class="text-base sm:text-lg text-onyx/75 leading-relaxed mb-6">
            Chaque offre est calibrée pour apporter une réponse graphique stratégique à un besoin précis. Aucun tarif générique : chaque collaboration fait l'objet d'un échange préalable pour adapter le dispositif à vos objectifs.
          </p>
          <div class="p-5 rounded-2xl bg-gradient-to-r from-violet-imperial/10 via-white to-or-champagne/10 border border-violet-imperial/20 text-center">
            <p class="text-base sm:text-lg font-title italic" style="font-family:'Cormorant Garamond', Georgia, serif;">
              « Chaque élément de votre identité sera construit pour qu'elle s'impose dans votre marché et ne se noie pas parmi vos concurrents. »
            </p>
            <span class="text-xs text-violet-imperial font-semibold uppercase tracking-wider mt-1 block">• Engagement de conception Class S</span>
          </div>
        </header>

        <!-- Guide : Quelle offre pour vous ? -->
        <section aria-labelledby="guide-heading" class="mb-12 p-6 sm:p-8 rounded-3xl bg-white border border-violet-imperial/15 shadow-soft">
          <h2 id="guide-heading" class="text-2xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Quelle offre pour vous ?
          </h2>
          <p class="text-sm text-onyx/75 mb-6">
            Sélectionnez votre situation actuelle pour accéder directement à la formule adaptée :
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${GUIDE_SITUATIONS.map(s => `
              <a href="#${s.targetId}" class="p-3.5 rounded-2xl bg-ivoire-violet/50 border border-violet-imperial/10 hover:border-violet-imperial/30 block text-sm font-medium text-onyx transition-colors">
                <span>${s.text}</span>
                <span class="block text-xs text-violet-imperial font-semibold mt-1">→ ${s.category}</span>
              </a>
            `).join('')}
          </div>
        </section>

        <!-- Navigation ancres -->
        <nav aria-label="Forfaits d'offres" class="mb-14 flex flex-wrap gap-2.5 justify-center">
          ${offerFamilies.map(fam => `
            <a href="#${fam.anchorId}" class="px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-white border border-violet-imperial/20 text-onyx hover:bg-violet-imperial hover:text-white transition-colors">
              ${fam.navLabel}
            </a>
          `).join('')}
        </nav>

        <!-- Forfait 01 : Logo & Identité Visuelle -->
        <section id="famille-logo" class="mb-20 scroll-mt-28">
          <div class="mb-8">
            <span class="text-xs font-bold text-violet-imperial uppercase tracking-wider">01 · Forfait Logo & Identité</span>
            <h2 class="text-3xl sm:text-4xl font-title font-semibold text-onyx mt-1 mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
              ${familyLogo.title}
            </h2>
            <p class="text-base text-onyx/75 max-w-2xl">${familyLogo.subtitle}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            ${(familyLogo.formulas || []).map(f => `
              <article id="${f.slugAnchor}" class="p-6 rounded-3xl bg-white border border-violet-imperial/15 shadow-soft flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider text-violet-imperial">Formule</span>
                    ${f.badge ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-or-champagne/20 text-onyx">${f.badge}</span>` : ''}
                  </div>
                  <h3 class="text-2xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
                    ${f.name}
                  </h3>
                  <p class="text-sm italic text-violet-imperial/90 mb-4 bg-ivoire-violet/60 p-3 rounded-xl border border-violet-imperial/10">
                    ${f.idealFor}
                  </p>
                  <ul class="space-y-2 text-sm text-onyx/80 mb-6">
                    ${f.keyPoints.map(kp => `<li class="flex items-start gap-2"><span class="text-[#6600CC]">✓</span><span>${kp}</span></li>`).join('')}
                  </ul>
                </div>
                <div class="pt-4 border-t border-violet-imperial/10">
                  ${f.deliveryTime ? `<p class="text-xs text-onyx/65 mb-3">Délai moyen : <strong>${f.deliveryTime}</strong></p>` : ''}
                  <a href="/#contact?type=logo" class="block w-full text-center px-4 py-2.5 bg-violet-imperial text-white font-medium text-sm rounded-full">
                    Choisir la formule ${f.name}
                  </a>
                </div>
              </article>
            `).join('')}
          </div>

          ${familyLogo.namingOptionNote ? `
            <div class="p-4 rounded-2xl bg-ivoire-violet/70 border border-violet-imperial/15 text-xs text-onyx/80 mb-8">
              <strong>Option Naming :</strong> ${familyLogo.namingOptionNote}
            </div>
          ` : ''}

          <!-- Matrice Logo -->
          <div class="mt-8">
            <h3 class="text-xl font-title font-semibold mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Comparer les formules Logo & Identité en détail
            </h3>
            ${renderTable(familyLogo.comparisonHeaders!, familyLogo.comparisonRows!, 'Matrice comparative : Logo & Identité')}
          </div>
        </section>

        <!-- Forfait 02 : Branding Social Media -->
        <section id="famille-social" class="mb-20 scroll-mt-28">
          <div class="mb-8">
            <span class="text-xs font-bold text-violet-imperial uppercase tracking-wider">02 · Forfait Réseaux Sociaux</span>
            <h2 class="text-3xl sm:text-4xl font-title font-semibold text-onyx mt-1 mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
              ${familySocial.title}
            </h2>
            <p class="text-base text-onyx/75 max-w-2xl">${familySocial.subtitle}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            ${(familySocial.formulas || []).map(f => `
              <article id="${f.slugAnchor}" class="p-6 sm:p-8 rounded-3xl bg-white border border-violet-imperial/15 shadow-soft flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider text-violet-imperial">Formule Mensuelle</span>
                    ${f.badge ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-imperial/10 text-violet-imperial">${f.badge}</span>` : ''}
                  </div>
                  <h3 class="text-2xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
                    ${f.name}
                  </h3>
                  <p class="text-sm italic text-violet-imperial/90 mb-4 bg-ivoire-violet/60 p-3 rounded-xl border border-violet-imperial/10">
                    ${f.idealFor}
                  </p>
                  <ul class="space-y-2 text-sm text-onyx/80 mb-6">
                    ${f.keyPoints.map(kp => `<li class="flex items-start gap-2"><span class="text-[#6600CC]">✓</span><span>${kp}</span></li>`).join('')}
                  </ul>
                </div>
                <div class="pt-4 border-t border-violet-imperial/10">
                  ${f.deliveryTime ? `<p class="text-xs text-onyx/65 mb-3">Rythme : <strong>${f.deliveryTime}</strong></p>` : ''}
                  <a href="/#contact?type=social" class="block w-full text-center px-4 py-2.5 bg-violet-imperial text-white font-medium text-sm rounded-full">
                    Activer ${f.name}
                  </a>
                </div>
              </article>
            `).join('')}
          </div>

          <!-- Matrice Social Media -->
          <div class="mt-8">
            <h3 class="text-xl font-title font-semibold mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Comparer les formules Réseaux Sociaux en détail
            </h3>
            ${renderTable(familySocial.comparisonHeaders!, familySocial.comparisonRows!, 'Matrice comparative : Branding Social Media')}
          </div>
        </section>

        <!-- Forfait 03 : Communication Événementielle -->
        <section id="famille-evenementiel" class="mb-20 scroll-mt-28">
          <div class="p-6 sm:p-10 rounded-3xl bg-white border border-or-champagne/30 shadow-soft">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span class="text-xs font-bold text-or-champagne uppercase tracking-wider">03 · Forfait Événementiel</span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-or-champagne/15 text-[#8A5E2E]">Sur devis personnalisé</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              ${familyEvent.title}
            </h2>
            <p class="text-base text-onyx/75 max-w-2xl mb-4">${familyEvent.subtitle}</p>
            <p class="text-sm italic text-violet-imperial mb-6 bg-ivoire-violet/60 p-3 rounded-xl border border-violet-imperial/10 max-w-2xl">
              ${familyEvent.idealFor}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm text-onyx/80">
              <div class="p-4 rounded-2xl bg-ivoire-violet/40">
                <h4 class="font-semibold text-onyx mb-2">Supports Print & Signalétique</h4>
                <p>Affiches officielles, kakémonos, bâches, badges d'invités, programmes imprimés et signalétique d'orientation sur site.</p>
              </div>
              <div class="p-4 rounded-2xl bg-ivoire-violet/40">
                <h4 class="font-semibold text-onyx mb-2">Campagne Numérique & Médias</h4>
                <p>Visuels de teasing, compte à rebours, annonces d'intervenants, bannières partenaires et habillage vidéo d'écran scène.</p>
              </div>
            </div>
            <a href="/#contact?type=event" class="inline-block px-6 py-3 bg-or-champagne text-onyx font-semibold text-sm rounded-full">
              Demander un devis événementiel
            </a>
          </div>
        </section>

        <!-- Forfait 04 : Sites Web (Bande sombre Onyx) -->
        <section id="famille-sites-web" class="mb-20 scroll-mt-28 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16" style="background-color:#0D0A18; color:#F8F5FF;">
          <div class="max-w-6xl mx-auto">
            <div class="mb-10 text-center max-w-3xl mx-auto">
              <span class="text-xs font-bold uppercase tracking-wider" style="color:#C9A070;">04 · Forfait Sites Web Haute Performance</span>
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold mt-2 mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#F8F5FF;">
                ${familyWeb.title}
              </h2>
              <p class="text-base text-ivoire-violet/75 max-w-2xl mx-auto mb-6">${familyWeb.subtitle}</p>
              
              <!-- Vitesse comparative -->
              <div class="p-4 rounded-2xl border border-white/10 max-w-xl mx-auto text-left" style="background:rgba(255,255,255,0.03);">
                <p class="text-xs text-ivoire-violet/70 mb-2 font-medium">Temps moyen de chargement mobile sur réseau 3G/4G locale :</p>
                <div class="space-y-2 text-xs">
                  <div>
                    <div class="flex justify-between mb-1 text-ivoire-violet/60"><span>Standards marché classiques</span><span>4 à 8 secondes</span></div>
                    <div class="w-full bg-white/10 h-2 rounded-full"><div class="bg-red-400/80 h-2 rounded-full" style="width:85%"></div></div>
                  </div>
                  <div>
                    <div class="flex justify-between mb-1" style="color:#C9A070;"><span>Architecture Class S ultra-optimisée</span><span>~1 seconde</span></div>
                    <div class="w-full bg-white/10 h-2 rounded-full"><div class="h-2 rounded-full" style="width:20%; background-color:#C9A070;"></div></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2 Formats Web -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              ${websiteFormats.map(fmt => `
                <div class="p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between" style="background:rgba(255,255,255,0.03);">
                  <div>
                    <h3 class="text-2xl font-title font-semibold mb-2" style="font-family:'Cormorant Garamond', Georgia, serif; color:#F8F5FF;">
                      ${fmt.title}
                    </h3>
                    <p class="text-sm text-ivoire-violet/70 mb-6">${fmt.subtitle}</p>

                    <div class="space-y-6">
                      <!-- Variante Essentiel -->
                      <div class="p-4 rounded-2xl border border-white/10" style="background:rgba(255,255,255,0.02);">
                        <h4 class="text-sm font-bold uppercase tracking-wider text-or-champagne mb-1">${fmt.variants.essentiel.label}</h4>
                        <p class="text-xs italic text-ivoire-violet/70 mb-3">${fmt.variants.essentiel.idealFor}</p>
                        <ul class="space-y-1.5 text-xs text-ivoire-violet/80">
                          ${fmt.variants.essentiel.keyPoints.map(kp => `<li>• ${kp}</li>`).join('')}
                        </ul>
                      </div>

                      <!-- Variante Premium -->
                      <div class="p-4 rounded-2xl border border-or-champagne/30" style="background:rgba(201,160,112,0.05);">
                        <h4 class="text-sm font-bold uppercase tracking-wider text-or-champagne mb-1">${fmt.variants.premium.label}</h4>
                        <p class="text-xs italic text-ivoire-violet/70 mb-3">${fmt.variants.premium.idealFor}</p>
                        <ul class="space-y-1.5 text-xs text-ivoire-violet/80">
                          ${fmt.variants.premium.keyPoints.map(kp => `<li>• ${kp}</li>`).join('')}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="pt-6 mt-6 border-t border-white/10">
                    <a href="/#contact?type=website" class="block w-full text-center px-4 py-3 bg-white text-onyx font-semibold text-sm rounded-full">
                      Commander mon site ${fmt.title}
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>

            ${familyWeb.hostingDomainNote ? `
              <p class="text-xs text-center text-ivoire-violet/60 mb-8 max-w-2xl mx-auto">
                ${familyWeb.hostingDomainNote}
              </p>
            ` : ''}

            <!-- Matrice Web -->
            <div class="mt-8">
              <h3 class="text-xl font-title font-semibold mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#F8F5FF;">
                Comparer les formats de sites web
              </h3>
              ${renderTable(familyWeb.comparisonHeaders!, familyWeb.comparisonRows!, 'Matrice comparative : Sites Web', true)}
            </div>
          </div>
        </section>

        <!-- Forfait 05 : Visuels à l'unité -->
        <section id="famille-visuels" class="mb-20 scroll-mt-28">
          <div class="p-6 sm:p-8 rounded-3xl bg-white border border-violet-imperial/15 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="max-w-2xl">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xs font-bold text-violet-imperial uppercase tracking-wider">05 · Forfait Réactivité 24h</span>
                <span class="px-3 py-0.5 rounded-full text-xs font-semibold bg-violet-imperial/10 text-violet-imperial">Livraison garantie sous 24h</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
                ${familySingle.title}
              </h2>
              <p class="text-sm text-onyx/75 mb-3">${familySingle.subtitle}</p>
              <p class="text-xs italic text-violet-imperial/90 mb-0">
                ${familySingle.idealFor}
              </p>
            </div>
            <a href="/#contact?type=print" class="shrink-0 px-6 py-3 bg-violet-imperial text-white font-medium text-sm rounded-full">
              Commander un visuel express
            </a>
          </div>
        </section>

        <!-- FAQ Prestations -->
        <section aria-labelledby="faq-heading" class="max-w-4xl mx-auto mb-16">
          <h2 id="faq-heading" class="text-2xl sm:text-3xl font-title font-semibold text-center mb-8" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Questions fréquentes sur nos prestations
          </h2>
          <div class="space-y-4">
            ${FAQ_ITEMS.map((faq) => `
              <div class="p-5 bg-white rounded-2xl border border-violet-imperial/10">
                <h3 class="font-semibold text-base mb-2 text-onyx">${faq.question}</h3>
                <p class="text-sm text-onyx/80 leading-relaxed">${faq.answer}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Bandeau final CTA -->
        <section class="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-imperial/10 via-white to-or-champagne/10 border border-violet-imperial/20 mb-16">
          <h2 class="text-2xl sm:text-3xl font-title font-semibold mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Un projet spécifique ou une question sur nos formules ?
          </h2>
          <p class="text-sm sm:text-base text-onyx/75 max-w-xl mx-auto mb-6">
            Chaque identité de marque est unique. Échangeons sur vos ambitions et concevons l'accompagnement le plus pertinent pour vous imposer.
          </p>
          <a href="/#contact" class="inline-block px-8 py-3.5 bg-violet-imperial text-white font-medium text-base rounded-full shadow-soft hover:shadow-glow">
            Prendre contact avec Scott Nana
          </a>
        </section>

        <footer class="py-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
          <p>${SITE_CONFIG.anchorPhrase}</p>
        </footer>
      </main>
    `;
  }

  // ROUTE 3: PROJETS (/projets)
  else if (normalizedRoute === '/projets') {
    pageTitle = "Réalisations & Études de Cas | Class S";
    pageDesc =
      "Explorez nos réalisations et études de cas de marques à Ouagadougou : objectifs clients, conception graphique stratégique et résultats commerciaux obtenus.";
    pageCanonical = `${baseUrl}/projets`;

    const projects = await getProjects();

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      url: pageCanonical,
      description: pageDesc,
      provider: {
        '@type': 'ProfessionalService',
        name: SITE_CONFIG.name,
        url: baseUrl,
      },
      mainEntity: {
        '@type': 'ItemList',
        name: 'Réalisations & Études de Cas Class S',
        numberOfItems: projects.length,
        itemListElement: projects.map((proj, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: proj.title,
            description: getProjectAccroche(proj),
            url: `${baseUrl}/projets/${proj.slug}`,
            creator: {
              '@type': 'Person',
              name: SITE_CONFIG.founder,
            },
          },
        })),
      },
    };

    const featuredProject = projects[0];
    const otherProjects = projects.slice(1);
    const featuredOpt = featuredProject ? getOptimizedImage(featuredProject.heroImage, { width: 1200 }) : { src: '' };

    ssrContent = `
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4" style="background-color:rgba(102,0,204,0.1); border:1px solid rgba(102,0,204,0.2); color:#6600CC; display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:9999px;">
            <span>RÉALISATIONS &amp; ÉTUDES DE CAS</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
            Chaque visuel a une mission commerciale
          </h1>
          <p class="text-base sm:text-lg text-onyx/75 leading-relaxed" style="color:rgba(13,10,24,0.75);">
            Découvrez l’intégralité des visuels et dispositifs conçus pour chaque projet, avec leur intention stratégique et leur impact.
          </p>
        </div>

        ${featuredProject ? `
          <!-- Featured Project Card (Full Width) -->
          <article class="mb-10 group bg-white rounded-3xl overflow-hidden border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg transition-all duration-300">
            <a href="/projets/${featuredProject.slug}" class="block grid grid-cols-1 lg:grid-cols-12 gap-0 text-inherit" style="text-decoration:none; color:inherit;">
              <div class="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden bg-onyx">
                <img
                  src="${featuredOpt.src}"
                  ${featuredOpt.srcSet ? `srcset="${featuredOpt.srcSet}"` : ''}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  alt="${featuredProject.title}"
                  width="${featuredOpt.width || 1200}"
                  height="${featuredOpt.height || 675}"
                  class="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div class="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-2.5 mb-3">
                    <span class="px-3 py-1 rounded-full bg-violet-imperial text-white text-[11px] font-semibold uppercase tracking-wider" style="background-color:#6600CC; color:#ffffff; padding:4px 12px; border-radius:9999px;">
                      Projet vedette
                    </span>
                    <span class="text-xs uppercase font-semibold text-[#C9A070] tracking-wider" style="color:#C9A070;">
                      ${featuredProject.category}
                    </span>
                  </div>
                  <h2 class="text-2xl sm:text-3xl lg:text-4xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
                    ${featuredProject.title}
                  </h2>
                  <p class="text-sm sm:text-base text-onyx/75 leading-relaxed mb-6" style="color:rgba(13,10,24,0.75);">
                    ${getProjectAccroche(featuredProject)}
                  </p>
                </div>
                <div class="pt-4 border-t border-violet-imperial/10 flex items-center justify-between text-xs sm:text-sm font-semibold text-violet-imperial" style="color:#6600CC;">
                  <span class="text-onyx/60" style="color:rgba(13,10,24,0.6);">${featuredProject.gallery.length} visuels</span>
                  <span>Voir l’étude complète →</span>
                </div>
              </div>
            </a>
          </article>
        ` : ''}

        <!-- 2-Column Grid for Remaining Projects -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          ${otherProjects.map((p) => {
            const opt = getOptimizedImage(p.heroImage, { width: 800 });
            return `
              <article class="group bg-white rounded-3xl overflow-hidden border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col">
                <a href="/projets/${p.slug}" class="block text-inherit flex-grow flex flex-col" style="text-decoration:none; color:inherit;">
                  <div class="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-onyx">
                    <img
                      src="${opt.src}"
                      ${opt.srcSet ? `srcset="${opt.srcSet}"` : ''}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      alt="${p.title}"
                      width="${opt.width || 800}"
                      height="${opt.height || 550}"
                      class="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div class="absolute top-3 left-3 bg-onyx/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[11px] font-semibold text-white uppercase tracking-wider" style="position:absolute; top:12px; left:12px; background:rgba(13,10,24,0.8); padding:4px 12px; border-radius:9999px; color:#fff;">
                      ${p.category}
                    </div>
                  </div>
                  <div class="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                    <div>
                      <h2 class="text-xl sm:text-2xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
                        ${p.title}
                      </h2>
                      <p class="text-xs sm:text-sm text-onyx/75 leading-relaxed mb-4" style="color:rgba(13,10,24,0.75);">
                        ${getProjectAccroche(p)}
                      </p>
                    </div>
                    <div class="pt-4 border-t border-violet-imperial/10 flex items-center justify-between text-xs font-semibold text-violet-imperial" style="color:#6600CC;">
                      <span class="text-onyx/60" style="color:rgba(13,10,24,0.6);">${p.gallery.length} visuels</span>
                      <span>Voir le projet →</span>
                    </div>
                  </div>
                </a>
              </article>
            `;
          }).join('')}
        </div>

        <footer class="py-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
          <p>${SITE_CONFIG.anchorPhrase}</p>
        </footer>
      </main>
    `;
  }

  // ROUTE 3B: PROJET DETAIL (/projets/:slug)
  else if (normalizedRoute === '/projets/:slug') {
    // 1. Check 301 redirects first
    const redirectSlug = await getProjectRedirect(projectSlug);
    if (redirectSlug && redirectSlug !== projectSlug) {
      res.setHeader('Location', `${baseUrl}/projets/${redirectSlug}`);
      return res.status(301).end();
    }

    const projects = await getProjects();
    const targetNorm = normalizeProjectSlug(projectSlug);
    let project = projects.find(
      (p) => normalizeProjectSlug(p.slug || p.id) === targetNorm || p.id === projectSlug || p.slug === projectSlug
    );
    if (!project) {
      project = projectsData.find(
        (p) => normalizeProjectSlug(p.slug || p.id) === targetNorm || p.id === projectSlug || p.slug === projectSlug
      );
    }

    if (!project) {
      pageTitle = "Page introuvable | Class S";
      pageDesc = "Page introuvable. Votre image, elle, ne devrait jamais l'être.";
      pageCanonical = "";
      statusCode = 404;
      isNoIndex = true;
      ssrContent = render404Content();
    } else {
      const accroche = getProjectAccroche(project);
      pageTitle = `${project.title} | Class S`;
      pageDesc = accroche;
      pageCanonical = `${baseUrl}/projets/${project.slug}`;

      // OpenGraph Image: strictly 1200x630 JPEG (never WebP for social networks)
      pageImage = `${baseUrl}/og/projets/${project.slug}.jpg`;
      pageImageWidth = 1200;
      pageImageHeight = 630;
      pageImageAlt = project.title;
      pageType = 'article';

      const testimonials = await getTestimonials();
      const testimonial = testimonials.find(
        (t) => t.projet_id === project.id || t.projet_id === project.slug
      ) || (project.testimonialPlaceholder ? {
        author_name: project.title.includes('72') ? 'Comité 72h CJ' : project.title.includes('Bang') ? 'Fondateur' : 'Client',
        author_role_company: project.title,
        content: project.testimonialPlaceholder,
      } : null);

      // JSON-LD CreativeWork & BreadcrumbList
      jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CreativeWork',
            '@id': `${pageCanonical}#work`,
            name: project.title,
            description: accroche,
            image: pageImage,
            url: pageCanonical,
            genre: project.category,
            inLanguage: 'fr',
            creator: {
              '@type': 'Person',
              name: SITE_CONFIG.founder,
              jobTitle: SITE_CONFIG.jobTitle,
              url: baseUrl,
            },
            provider: {
              '@type': 'ProfessionalService',
              name: SITE_CONFIG.name,
              url: baseUrl,
            },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${pageCanonical}#breadcrumb`,
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: `${baseUrl}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Projets',
                item: `${baseUrl}/projets`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: project.title,
                item: pageCanonical,
              },
            ],
          },
        ],
      };

      const heroOpt = getOptimizedImage(project.heroImage, { width: 1200 });

      // Prev / Next looping navigation
      const currentIndex = projects.findIndex(
        (p) => p.id === project.id || p.slug === project.slug
      );
      const prevProject =
        projects[(currentIndex - 1 + projects.length) % projects.length];
      const nextProject = projects[(currentIndex + 1) % projects.length];

      ssrContent = `
        <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16" style="font-family:'Jost', sans-serif; color:#0D0A18;">
          <!-- Breadcrumb -->
          <nav class="mb-6 sm:mb-8 text-xs font-medium text-onyx/60" aria-label="Fil d'Ariane" style="font-size:0.75rem; color:rgba(13,10,24,0.6);">
            <ol class="flex items-center flex-wrap gap-2" style="display:flex; align-items:center; flex-wrap:wrap; gap:8px; list-style:none; padding:0; margin:0;">
              <li><a href="/" class="hover:text-violet-imperial transition-colors" style="color:inherit; text-decoration:none;">Accueil</a></li>
              <li aria-hidden="true">›</li>
              <li><a href="/projets" class="hover:text-violet-imperial transition-colors" style="color:inherit; text-decoration:none;">Projets</a></li>
              <li aria-hidden="true">›</li>
              <li class="text-violet-imperial font-semibold" aria-current="page" style="color:#6600CC; font-weight:600;">${project.title}</li>
            </ol>
          </nav>

          <!-- Project Header -->
          <header class="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-3" style="background-color:rgba(102,0,204,0.1); border:1px solid rgba(102,0,204,0.2); color:#6600CC; display:inline-flex; align-items:center; gap:8px; padding:4px 12px; border-radius:9999px;">
              <span>${project.category}</span>
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
              ${project.title}
            </h1>
            <p class="text-base sm:text-lg md:text-xl text-onyx/75 leading-relaxed font-body" style="color:rgba(13,10,24,0.75);">
              ${accroche}
            </p>
          </header>

          <!-- Hero Image: Préservation intégrale, sans rognage ni déformation -->
          <div class="relative w-full rounded-3xl overflow-hidden bg-[#0D0A18] border border-violet-imperial/15 shadow-soft-lg mb-12 sm:mb-16 p-3 sm:p-6 md:p-8 flex items-center justify-center min-h-[320px] sm:min-h-[460px] md:min-h-[540px]" style="background-color:#0D0A18; border-radius:1.5rem; overflow:hidden; border:1px solid rgba(102,0,204,0.15); display:flex; align-items:center; justify-content:center; position:relative; padding:1.5rem; margin-bottom:3rem;">
            <div style="position:absolute; inset:0; background-image:url(${heroOpt.src}); background-size:cover; background-position:center; filter:blur(40px); opacity:0.25; transform:scale(1.1); pointer-events:none;" aria-hidden="true"></div>
            <img
              src="${heroOpt.src}"
              ${heroOpt.srcSet ? `srcset="${heroOpt.srcSet}"` : ''}
              sizes="(min-width: 1024px) 80vw, 100vw"
              alt="${project.title}"
              width="${heroOpt.width || 1200}"
              height="${heroOpt.height || 675}"
              class="relative z-10 max-h-[580px] sm:max-h-[680px] md:max-h-[760px] w-auto max-w-full h-auto rounded-2xl shadow-soft object-contain"
              style="position:relative; z-index:10; max-height:680px; width:auto; max-width:100%; height:auto; border-radius:1rem; object-fit:contain; margin:0 auto; display:block;"
              loading="eager"
              decoding="async"
            />
          </div>

          <!-- Narrative Grid (3 Blocks) -->
          <section class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12" aria-label="Étude de cas détaillée">
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft">
              <span class="text-xs font-bold uppercase tracking-wider text-[#C9A070] block mb-2" style="color:#C9A070;">01. But du client</span>
              <h2 class="text-xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">L’objectif visé</h2>
              <p class="text-sm sm:text-base text-onyx/80 leading-relaxed font-body" style="color:rgba(13,10,24,0.8); font-size:0.95rem; line-height:1.6;">${project.clientGoal}</p>
            </div>
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft">
              <span class="text-xs font-bold uppercase tracking-wider text-violet-imperial block mb-2" style="color:#6600CC;">02. Ce qui a été conçu</span>
              <h2 class="text-xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">La réponse graphique</h2>
              <p class="text-sm sm:text-base text-onyx/80 leading-relaxed font-body" style="color:rgba(13,10,24,0.8); font-size:0.95rem; line-height:1.6;">${project.designedSolution}</p>
            </div>
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-2" style="color:#059669;">03. Résultat</span>
              <h2 class="text-xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">L’impact constaté</h2>
              <p class="text-sm sm:text-base text-onyx/80 leading-relaxed font-body" style="color:rgba(13,10,24,0.8); font-size:0.95rem; line-height:1.6;">${project.result}</p>
            </div>
          </section>

          <!-- Précision (Disclaimer) if present -->
          ${project.disclaimer ? `
            <aside class="mb-12 p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-onyx/85" style="background-color:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.25); border-radius:1rem; padding:1.25rem;">
              <div class="flex items-start gap-3" style="display:flex; align-items:flex-start; gap:12px;">
                <span class="text-amber-600 text-lg" style="color:#d97706; font-size:1.25rem;">⚠️</span>
                <div class="text-xs sm:text-sm leading-relaxed" style="font-size:0.875rem; line-height:1.6;">
                  <strong class="font-semibold block text-onyx mb-1" style="color:#0D0A18; font-weight:600; display:block; margin-bottom:4px;">Précision de paternité graphique</strong>
                  ${project.disclaimer}
                </div>
              </div>
            </aside>
          ` : ''}

          <!-- Testimonial if present -->
          ${testimonial ? `
            <section class="mb-16 bg-gradient-to-br from-violet-imperial/10 via-white to-or-champagne/10 rounded-3xl p-6 sm:p-10 border border-violet-imperial/20 shadow-soft" style="background:linear-gradient(135deg, rgba(102,0,204,0.08), #ffffff, rgba(201,160,112,0.08)); border-radius:1.5rem; border:1px solid rgba(102,0,204,0.2); padding:2rem;">
              <div class="max-w-2xl mx-auto text-center space-y-4">
                <span class="text-xs font-semibold uppercase tracking-wider text-violet-imperial block" style="color:#6600CC; font-size:0.75rem; letter-spacing:0.05em;">Retour client</span>
                <blockquote class="text-lg sm:text-xl font-title italic text-onyx" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18; font-style:italic;">
                  « ${testimonial.content} »
                </blockquote>
                <footer class="text-xs text-onyx/60 font-medium" style="color:rgba(13,10,24,0.6); font-size:0.75rem;">
                  <strong class="text-onyx block text-sm" style="color:#0D0A18; font-size:0.875rem;">${testimonial.author_name}</strong>
                  ${testimonial.author_role_company || 'Client Class S'}
                </footer>
              </div>
            </section>
          ` : ''}

          <!-- Full Masonry Gallery -->
          <section class="mb-16" aria-label="Galerie complète des réalisations">
            <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#C9A070] block mb-2" style="color:#C9A070; font-size:0.75rem; letter-spacing:0.05em;">Galerie intégrale</span>
              <h2 class="text-2xl sm:text-3xl md:text-4xl font-title font-semibold text-onyx" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
                L'ensemble des réalisations (${project.gallery.length} visuels)
              </h2>
              <p class="text-xs sm:text-sm text-onyx/65 mt-2" style="color:rgba(13,10,24,0.65);">
                Toutes les pièces graphiques conçues pour ce projet, dans leur format original.
              </p>
            </div>

            <div class="columns-2 md:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              ${project.gallery.map((img, idx) => {
                const opt = getOptimizedImage(img.src, { width: 1200 });
                return `
                  <figure class="break-inside-avoid rounded-2xl overflow-hidden bg-onyx border border-violet-imperial/15 shadow-soft mb-4 sm:mb-6" style="border-radius:1rem; overflow:hidden; border:1px solid rgba(102,0,204,0.15); page-break-inside:avoid; break-inside:avoid; margin-bottom:1.25rem;">
                    <img
                      src="${opt.src}"
                      ${opt.srcSet ? `srcset="${opt.srcSet}"` : ''}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 50vw"
                      alt="${img.caption || `${project.title} - visuel ${idx + 1}`}"
                      width="${opt.width || 800}"
                      height="${opt.height || 600}"
                      class="w-full h-auto block"
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                `;
              }).join('')}
            </div>
          </section>

          <!-- Prev / Next Navigation -->
          <nav class="pt-8 border-t border-violet-imperial/15 mb-16" aria-label="Navigation entre projets" style="border-top:1px solid rgba(102,0,204,0.15); padding-top:2rem; margin-bottom:4rem;">
            <div class="flex items-center justify-between gap-4" style="display:flex; justify-content:space-between; align-items:center;">
              <a href="/projets/${prevProject.slug}" class="group text-left p-3 rounded-2xl hover:bg-white/80 transition-all" style="text-decoration:none; color:inherit; text-align:left;">
                <span class="text-xs text-onyx/50 block mb-1" style="display:block; font-size:0.75rem; color:rgba(13,10,24,0.5);">← Projet précédent</span>
                <span class="text-base sm:text-lg font-title font-semibold text-onyx group-hover:text-violet-imperial transition-colors" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
                  ${prevProject.title}
                </span>
              </a>
              <a href="/projets/${nextProject.slug}" class="group text-right p-3 rounded-2xl hover:bg-white/80 transition-all" style="text-decoration:none; color:inherit; text-align:right;">
                <span class="text-xs text-onyx/50 block mb-1" style="display:block; font-size:0.75rem; color:rgba(13,10,24,0.5);">Projet suivant →</span>
                <span class="text-base sm:text-lg font-title font-semibold text-onyx group-hover:text-violet-imperial transition-colors" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
                  ${nextProject.title}
                </span>
              </a>
            </div>
          </nav>

          <!-- CTA Banner -->
          <section class="text-center py-12 px-6 rounded-3xl bg-[#0D0A18] text-white" style="background-color:#0D0A18; color:#ffffff; border-radius:1.5rem; padding:3rem 1.5rem; text-align:center;">
            <h2 class="text-2xl sm:text-3xl font-title font-semibold mb-3 text-white" style="font-family:'Cormorant Garamond', Georgia, serif; color:#ffffff;">
              Prêt à confier votre identité visuelle à Scott ?
            </h2>
            <p class="text-sm sm:text-base text-white/75 max-w-lg mx-auto mb-6" style="color:rgba(255,255,255,0.75); max-width:32rem; margin:0 auto 1.5rem auto;">
              Discutons de vos objectifs et créons ensemble les visuels qui feront grandir votre marque.
            </p>
            <a href="/#contact" class="inline-block px-7 py-3.5 bg-white text-[#0D0A18] font-semibold text-sm rounded-full hover:bg-white/90 transition-all" style="display:inline-block; background:#ffffff; color:#0D0A18; font-weight:600; padding:12px 28px; border-radius:9999px; text-decoration:none;">
              Démarrer mon projet
            </a>
          </section>
        </main>
      `;
    }
  }

  // ROUTE 4: À PROPOS (/a-propos)
  else if (normalizedRoute === '/a-propos') {
    pageTitle = "À Propos de Scott Nana & Class S | Studio d'Identité Visuelle";
    pageDesc =
      "Class S est un studio d'identité visuelle à Ouagadougou, au service des entrepreneurs et des PME. Découvrez l'histoire et la vision du design d'impact par Scott Nana.";
    pageCanonical = `${baseUrl}/a-propos`;

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: pageTitle,
      url: pageCanonical,
      description: pageDesc,
      mainEntity: {
        '@type': 'Person',
        name: SITE_CONFIG.founder,
        jobTitle: SITE_CONFIG.jobTitle,
        worksFor: {
          '@type': 'ProfessionalService',
          name: SITE_CONFIG.name,
          url: baseUrl,
        },
        sameAs: Object.values(SITE_CONFIG.socialLinks),
      },
    };

    ssrContent = `
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <span>L'histoire & la vision</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Derrière Class S
          </h1>
          <p class="text-base sm:text-lg text-onyx/75 leading-relaxed font-medium mb-3">
            ${SITE_CONFIG.anchorPhrase}
          </p>
          <p class="text-sm sm:text-base text-onyx/70 leading-relaxed">
            Comprendre pourquoi une image fait vendre commence par comprendre l’intention derrière chaque coup de crayon.
          </p>
        </div>

        <!-- 5-Step Narrative Progression -->
        <div class="space-y-10 bg-white rounded-3xl p-6 sm:p-12 border border-violet-imperial/15 shadow-soft mb-12">
          <!-- 01. Le constat -->
          <section class="pb-8 border-b border-violet-imperial/10">
            <span class="text-xs font-bold uppercase text-violet-imperial tracking-wider block mb-2">01. Le constat</span>
            <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Il y a les images qui meublent l'espace, et celles qui génèrent du chiffre.
            </h2>
            <div class="space-y-3 text-base text-onyx/80 leading-relaxed">
              <p>Beaucoup d’entreprises et d’entrepreneurs investissent du temps et de l’énergie dans leur activité, mais confient leur image au hasard ou à des modèles préfabriqués. Le résultat ? Une présence qui passe inaperçue au milieu du flux continu d’informations, ou qui peine à inspirer la confiance nécessaire pour transformer un curieux en acheteur.</p>
              <p>À l’opposé, une identité visuelle pensée avec méthode ne cherche pas simplement à être « jolie ». Elle attire le bon regard, pose instantanément l’autorité de votre marque et prépare le prospect à passer à l’action.</p>
            </div>
          </section>

          <!-- 02. Le parcours -->
          <section class="pb-8 border-b border-violet-imperial/10">
            <span class="text-xs font-bold uppercase text-[#C9A070] tracking-wider block mb-2">02. Le parcours</span>
            <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              De la passion du graphisme à la rigueur de la marque
            </h2>
            <div class="space-y-3 text-base text-onyx/80 leading-relaxed">
              <p>Je m’appelle Scott Nana. Depuis Ouagadougou, j'ai fondé <strong>Class S</strong> pour accompagner les dirigeants de PME, porteurs de projets et organisateurs d’événements qui veulent donner à leur structure la stature visuelle qu’elle mérite.</p>
              <p>Dès mes débuts et à l’issue de mes premières sélections techniques dans le domaine de la communication, j’ai rapidement choisi de ne pas me limiter à la simple exécution de visuels. Ce qui m’animait était de comprendre les rouages commerciaux derrière chaque support pour en faire un véritable levier de croissance.</p>
            </div>
          </section>

          <!-- 03. Le déclic -->
          <section class="pb-8 border-b border-violet-imperial/10">
            <span class="text-xs font-bold uppercase text-[#A87FE8] tracking-wider block mb-2">03. Le déclic</span>
            <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Le moment où tout a pris son sens
            </h2>
            <div class="space-y-3 text-base text-onyx/80 leading-relaxed">
              <p>Environ un an après le lancement de Class S, le vrai déclic s’est produit. Ce déclic n’était pas une réaction d’agacement face à des visuels amateurs croisés dans la rue : c’était la prise de conscience éclatante de <strong>l’impact direct et mesurable qu’un design réfléchi a sur le développement des affaires de mes clients</strong>.</p>
              <p>Lorsqu’un client m’a partagé comment une campagne ou une identité repensée avait débloqué des prises de contact, rempli une salle ou convaincu des partenaires exigeants, ma vision du métier s’est définitivement cristallisée.</p>
            </div>
          </section>

          <!-- 04. La conviction fondamentale -->
          <section class="py-6">
            <div class="p-8 rounded-2xl bg-[#0D0A18] text-white text-center space-y-3">
              <span class="text-xs uppercase font-semibold tracking-widest text-[#C9A070]">04. La conviction fondamentale</span>
              <blockquote class="text-2xl sm:text-3xl font-title font-semibold text-white leading-snug" style="font-family:'Cormorant Garamond', Georgia, serif;">
                « Le design n'est pas une question d'esthétique. C'est un outil d'impact. »
              </blockquote>
              <p class="text-xs sm:text-sm text-[#F8F5FF]/70 max-w-lg mx-auto">
                Tout ce que je conçois pour votre marque — de la couleur d'un bouton au choix d'une typographie — répond à cette seule exigence d'utilité et de résultat.
              </p>
            </div>
          </section>

          <!-- 05. Écrivons la suite ensemble -->
          <section class="pt-4 text-center space-y-4">
            <span class="text-xs font-bold uppercase text-violet-imperial tracking-wider block">05. Écrivons la suite ensemble</span>
            <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Et si nous donnions à votre marque l'image qui s'impose ?
            </h2>
            <p class="text-sm sm:text-base text-onyx/75 max-w-xl mx-auto">
              Parlez-moi de votre activité, de vos défis actuels et de vos ambitions. Je vous proposerai un cadre de travail sur mesure.
            </p>
            <div class="pt-2">
              <a href="/#contact" class="px-6 py-3 bg-[#6600CC] text-white font-semibold rounded-full inline-block">Prendre contact avec Scott</a>
            </div>
          </section>
        </div>

        <footer class="py-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
          <p>${SITE_CONFIG.anchorPhrase}</p>
        </footer>
      </main>
    `;
  }

  // ROUTE 5 & 6: BLOG & BLOG POST (/blog & /blog/:slug)
  else if (normalizedRoute === '/blog' || normalizedRoute === '/blog/:slug') {
    let article: any = null;
    if (slug) {
      article = await getArticle(slug);
    }

    // Check 301 redirects if article is not found
    if (slug && !article) {
      const redirectSlug = await getArticleRedirect(slug);
      if (redirectSlug && redirectSlug !== slug) {
        res.setHeader('Location', `${baseUrl}/blog/${redirectSlug}`);
        return res.status(301).end();
      }

      pageTitle = "Page introuvable | Class S";
      pageDesc = "Page introuvable. Votre image, elle, ne devrait jamais l'être.";
      pageCanonical = ""; // Section 9.4: No canonical on 404
      statusCode = 404;
      isNoIndex = true;
      ssrContent = render404Content();
    } else if (slug && article) {
      pageTitle = `${article.title} | Class S`;
      pageDesc = article.meta_description || article.excerpt || pageDesc;

      // OG Image: Strictly the 1200x630 JPEG copy for social networks (LinkedIn/WhatsApp compatibility)
      if (article.cover_image_og_jpeg && article.cover_image_og_jpeg.trim()) {
        pageImage = article.cover_image_og_jpeg.startsWith('/')
          ? `${baseUrl}${article.cover_image_og_jpeg}`
          : article.cover_image_og_jpeg;
      } else if (article.cover_image && article.cover_image.trim()) {
        pageImage = article.cover_image.startsWith('/')
          ? `${baseUrl}${article.cover_image}`
          : article.cover_image;
      } else {
        pageImage = SITE_CONFIG.ogImageUrl;
      }

      pageImageWidth = 1200;
      pageImageHeight = 630;
      pageImageAlt = article.cover_image_alt || article.title;
      pageCanonical = `${baseUrl}/blog/${slug}`;
      pageType = 'article';

      // Extra Open Graph article tags
      extraMetaTags = `
    <meta property="article:published_time" content="${article.published_at || article.created_at}" />
    <meta property="article:modified_time" content="${article.updated_at || article.published_at || article.created_at}" />
    ${(article.tags || []).map((t: string) => `<meta property="article:tag" content="${t.replace(/"/g, '&quot;')}" />`).join('\n    ')}
      `.trim();

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: pageDesc,
        inLanguage: 'fr',
        image: [pageImage],
        datePublished: article.published_at || article.created_at || new Date().toISOString(),
        dateModified: article.updated_at || article.published_at || article.created_at || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: SITE_CONFIG.founder,
          jobTitle: SITE_CONFIG.jobTitle,
          url: `${baseUrl}/a-propos`,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_CONFIG.name,
          logo: {
            '@type': 'ImageObject',
            url: SITE_CONFIG.logoUrl,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageCanonical,
        },
      };

      const sanitizedContent = sanitizeServerHtml(article.content || `<p>${article.excerpt}</p>`);

      // Fluid typography with single H1
      ssrContent = `
        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
          <header class="mb-8">
            <a href="/blog" class="text-xs uppercase font-bold text-violet-imperial tracking-wider hover:underline" style="color:#6600CC;">← Retour au Journal Class S</a>
            ${article.tags && article.tags.length > 0 ? `
              <div class="flex flex-wrap gap-2 mt-4">
                ${article.tags.map((t: string) => `<span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-imperial/10 text-violet-imperial" style="background-color:rgba(102,0,204,0.1); color:#6600CC;">${t}</span>`).join('')}
              </div>
            ` : ''}
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight mt-4 mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; font-size:clamp(2rem, 4vw, 3.25rem); line-height:1.2; color:#0D0A18;">
              ${article.title}
            </h1>
            <div class="flex items-center gap-3 text-xs text-onyx/60" style="color:rgba(13,10,24,0.6);">
              <span>Par Scott Nana · Brand & Graphic Designer</span>
              <span>•</span>
              <span>${article.reading_time || 1} min de lecture</span>
            </div>
          </header>

          ${article.cover_image ? `
            <figure class="my-8 rounded-2xl overflow-hidden border border-black/10">
              <img src="${article.cover_image}" alt="${(article.cover_image_alt || article.title).replace(/"/g, '&quot;')}" fetchpriority="high" class="w-full max-h-[520px] object-cover" />
              ${article.cover_image_alt ? `<figcaption class="text-xs text-center text-onyx/60 mt-2 italic font-body">${article.cover_image_alt}</figcaption>` : ''}
            </figure>
          ` : ''}

          ${article.excerpt ? `
            <div class="p-6 rounded-2xl my-6 border-l-4 border-or-champagne" style="background-color:rgba(212,175,55,0.08); border-left:4px solid #D4AF37;">
              <p class="text-base sm:text-lg text-onyx/95 leading-relaxed" style="font-family:'Jost', sans-serif; color:#0D0A18; margin:0;">${article.excerpt}</p>
            </div>
          ` : ''}

          <div class="prose max-w-none text-base sm:text-lg leading-relaxed text-onyx/90" style="line-height:1.75; max-width:70ch;">
            ${sanitizedContent}
          </div>

          <footer class="mt-16 pt-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
            <p>${SITE_CONFIG.anchorPhrase}</p>
          </footer>
        </article>
      `;
    } else {
      // Blog index (/blog)
      pageTitle = "Journal & Analyses | Stratégie Visuelle, Branding & Design | Class S";
      pageDesc = "Analyses, décryptages et principes graphiques pour transformer l'identité visuelle de votre entreprise en levier de conversion commerciale. Par Scott Nana.";
      pageCanonical = `${baseUrl}/blog`;
      pageType = 'website';

      // Parse filter parameters from query
      const urlObj = new URL(req.url || '/', 'https://www.wendclass.com');
      const reqRubrique = ((req.query?.rubrique as string) || urlObj.searchParams.get('rubrique') || '').trim();
      const reqQ = ((req.query?.q as string) || urlObj.searchParams.get('q') || '').trim();
      const hasBlogFilters = Boolean(reqRubrique || reqQ);

      if (hasBlogFilters) {
        isNoIndexFollow = true;
        // canonical stays strictly to /blog
        pageCanonical = `${baseUrl}/blog`;
      }

      const allArticles = await getArticlesList();
      const top3Articles = allArticles.slice(0, 3);
      const firstHeroCard = top3Articles[0] || null;

      // Filter articles for SSR grid if params requested
      let filteredArticles = allArticles;
      if (reqRubrique && reqRubrique !== 'tous') {
        filteredArticles = filteredArticles.filter((art) => {
          const rub = art.rubrique || (art.tags ? inferRubriqueFromTags(art.tags) : '');
          return rub === reqRubrique;
        });
      }
      if (reqQ) {
        const normQ = reqQ.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        filteredArticles = filteredArticles.filter((art) => {
          const matchTitle = (art.title || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normQ);
          const matchExcerpt = (art.excerpt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normQ);
          const rubName = getRubriqueName(art.rubrique || (art.tags ? inferRubriqueFromTags(art.tags) : ''));
          const matchRub = ((art.rubrique || '') + ' ' + rubName).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normQ);
          const matchTags = (art.tags || []).some((t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normQ));
          return matchTitle || matchExcerpt || matchRub || matchTags;
        });
      }

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Le Journal Class S · Scott Nana',
        description: pageDesc,
        url: pageCanonical,
        author: {
          '@type': 'Person',
          name: SITE_CONFIG.founder,
          jobTitle: SITE_CONFIG.jobTitle,
        },
      };

      // Server-Side HTML Rendering (Dark theme matching design system)
      ssrContent = `
        <div class="min-h-screen bg-onyx text-ivoire-violet pt-24 pb-20 relative overflow-hidden" style="background-color:#0D0A18; color:#F8F5FF; font-family:'Jost', sans-serif;">
          <!-- SSR HERO -->
          <section aria-label="En-tête et articles à la une du Journal Class S" class="relative w-full overflow-hidden border-b border-white/5 pb-12 pt-6 lg:pb-16 lg:pt-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" style="min-height:420px;">
                <!-- Left Text -->
                <div class="lg:col-span-6 flex flex-col justify-center space-y-5 text-left">
                  <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/20 border border-violet-imperial/30 text-amethyste text-xs font-semibold uppercase tracking-widest w-fit" style="background-color:rgba(102,0,204,0.2); border:1px solid rgba(102,0,204,0.3); color:#A87FE8;">
                    <span>Éditorial & Stratégie Visuelle</span>
                  </div>
                  <h1 class="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]" style="font-family:'Cormorant Garamond', Georgia, serif; color:#FFFFFF;">
                    Le Journal <span style="color:#C9A070;">Class S</span>
                  </h1>
                  <p class="text-base sm:text-lg text-ivoire-violet/75 leading-relaxed max-w-xl" style="color:rgba(248,245,255,0.75);">
                    Analyses, retours d'expérience et conseils concrets pour bâtir une marque singulière, crédible et mémorable.
                  </p>
                  <div class="pt-2">
                    <a href="#filtres-blog" class="inline-flex items-center gap-2 text-xs font-semibold text-amethyste hover:text-white transition-colors" style="color:#A87FE8;">
                      <span>Voir tous les articles ↓</span>
                    </a>
                  </div>
                </div>

                <!-- Right Animated Stack (First Card SSR Pre-rendered) -->
                <div class="lg:col-span-6 flex flex-col items-center justify-center relative w-full">
                  ${firstHeroCard ? `
                    <div class="relative w-full aspect-[16/10] max-h-[360px] rounded-3xl overflow-hidden border border-white/10 shadow-lg" style="background-color:#0D0A18; border:1px solid rgba(255,255,255,0.1);">
                      <a href="/blog/${firstHeroCard.slug}" class="block relative w-full h-full">
                        ${firstHeroCard.cover_image ? `
                          <img src="${firstHeroCard.cover_image}" alt="${(firstHeroCard.cover_image_alt || firstHeroCard.title).replace(/"/g, '&quot;')}" fetchpriority="high" class="w-full h-full object-cover" />
                        ` : `
                          <div class="w-full h-full bg-gradient-to-br from-ardoise to-onyx flex items-center justify-center">
                            <span class="text-xs uppercase text-amethyste font-bold">Class S Journal</span>
                          </div>
                        `}
                        <div class="absolute top-4 left-4 z-20">
                          <span class="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-onyx/85 text-amethyste border border-amethyste/40" style="background-color:rgba(13,10,24,0.85); color:#A87FE8; border:1px solid rgba(168,127,232,0.4);">
                            ${getRubriqueName(firstHeroCard.rubrique || inferRubriqueFromTags(firstHeroCard.tags))}
                          </span>
                        </div>
                        <div class="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-onyx via-onyx/85 to-transparent z-10 pointer-events-none" style="background:linear-gradient(to top, #0D0A18 0%, rgba(13,10,24,0.85) 60%, transparent 100%);"></div>
                        <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 flex flex-col justify-end space-y-2">
                          <div class="text-xs text-ivoire-violet/75" style="color:rgba(248,245,255,0.75);">
                            <span>${new Date(firstHeroCard.published_at || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span> • <span>${firstHeroCard.reading_time || 1} min de lecture</span>
                          </div>
                          <span class="block font-bold text-white text-base sm:text-lg lg:text-xl leading-snug" style="color:#FFFFFF;">
                            ${firstHeroCard.title}
                          </span>
                        </div>
                      </a>
                    </div>
                    <!-- Pre-render crawlable links to the other top 3 featured articles -->
                    <nav aria-label="Autres articles récents" class="flex items-center gap-3 mt-3 text-xs" style="color:rgba(248,245,255,0.6);">
                      <span>Également récents :</span>
                      ${top3Articles.slice(1).map((art) => `
                        <a href="/blog/${art.slug}" class="text-amethyste hover:underline" style="color:#A87FE8;">${art.title}</a>
                      `).join(' • ')}
                    </nav>
                  ` : ''}
                </div>
              </div>
            </div>
          </section>

          <!-- SSR FILTER & ARTICLES GRID -->
          <div id="filtres-blog" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
            <div class="flex items-center justify-between text-xs text-ivoire-violet/60 border-b border-white/5 pb-3">
              <span class="font-semibold text-ivoire-violet/90">${filteredArticles.length} ${filteredArticles.length > 1 ? 'articles' : 'article'}</span>
              <div class="flex items-center gap-2">
                <a href="/blog" class="hover:text-amethyste transition-colors" style="color:#A87FE8;">Tous les articles</a>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${filteredArticles.map((art) => {
                const rubName = getRubriqueName(art.rubrique || inferRubriqueFromTags(art.tags));
                const formattedDate = new Date(art.published_at || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                return `
                  <article class="rounded-3xl bg-ardoise/60 border border-white/10 p-5 flex flex-col justify-between" style="background-color:rgba(58,47,92,0.6); border:1px solid rgba(255,255,255,0.1);">
                    <div class="space-y-4">
                      <a href="/blog/${art.slug}" class="block aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 relative">
                        ${art.cover_image ? `
                          <img src="${art.cover_image}" alt="${(art.cover_image_alt || art.title).replace(/"/g, '&quot;')}" loading="lazy" class="w-full h-full object-cover" />
                        ` : ''}
                        <div class="absolute top-3 left-3">
                          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-onyx/85 text-amethyste border border-amethyste/30" style="background-color:rgba(13,10,24,0.85); color:#A87FE8;">
                            ${rubName}
                          </span>
                        </div>
                      </a>
                      <div class="flex items-center gap-3 text-xs text-ivoire-violet/50" style="color:rgba(248,245,255,0.5);">
                        <span>${formattedDate}</span>
                        <span>•</span>
                        <span>${art.reading_time || 1} min de lecture</span>
                      </div>
                      <h2 class="text-xl font-title font-bold text-white line-clamp-2 leading-snug" style="font-family:'Cormorant Garamond', Georgia, serif; color:#FFFFFF;">
                        <a href="/blog/${art.slug}" style="color:#FFFFFF;">${art.title}</a>
                      </h2>
                      <p class="text-xs sm:text-sm text-ivoire-violet/70 line-clamp-3 leading-relaxed" style="color:rgba(248,245,255,0.7);">
                        ${art.excerpt}
                      </p>
                    </div>
                    <div class="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                      <span class="text-ivoire-violet/50" style="color:rgba(248,245,255,0.5);">Par Scott Nana</span>
                      <a href="/blog/${art.slug}" class="font-semibold text-or-champagne hover:text-amethyste transition-colors" style="color:#C9A070;">
                        <span>Lire l'article →</span>
                      </a>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }
  }

  // ROUTE 7: 404 NOT FOUND
  else {
    pageTitle = "Page introuvable | Class S";
    pageDesc = "Page introuvable. Votre image, elle, ne devrait jamais l'être.";
    pageCanonical = ""; // Section 9.4: No canonical on 404
    statusCode = 404;
    isNoIndex = true;
    ssrContent = render404Content();
  }

  // 1. Inject / replace Title
  if (html.includes('<title>')) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
  } else {
    html = html.replace('</head>', `<title>${pageTitle}</title></head>`);
  }

  // 2. Prepare head tags
  const tagsToInject = `
    <meta name="description" content="${pageDesc.replace(/"/g, '&quot;')}" />
    ${pageCanonical ? `<link rel="canonical" href="${pageCanonical}" />` : ''}
    <!-- Open Graph -->
    <meta property="og:site_name" content="Class S · Scott Nana" />
    <meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${pageDesc.replace(/"/g, '&quot;')}" />
    <meta property="og:type" content="${pageType}" />
    <meta property="og:url" content="${pageCanonical || baseUrl}" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:image" content="${pageImage}" />
    <meta property="og:image:width" content="${pageImageWidth}" />
    <meta property="og:image:height" content="${pageImageHeight}" />
    <meta property="og:image:alt" content="${pageImageAlt.replace(/"/g, '&quot;')}" />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${pageDesc.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${pageImage}" />
    ${extraMetaTags ? extraMetaTags : ''}
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
    ${isNoIndexFollow ? '<meta name="robots" content="noindex, follow" />' : isNoIndex ? '<meta name="robots" content="noindex, nofollow" />' : ''}
  `;

  // Clean old tags
  html = html
    .replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^>]*>/gi, '')
    .replace(/<meta\s+property="article:[^>]*>/gi, '')
    .replace(/<meta\s+property="twitter:[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^>]*>/gi, '');

  if (isNoIndex) {
    html = html.replace(/<meta\s+name="robots"[^>]*>/gi, '');
  }

  html = html.replace('</head>', `${tagsToInject}\n</head>`);

  // 3. Inject SSR body inside <div id="root">
  if (ssrContent && html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${ssrContent}</div>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (isNoIndexFollow) {
    res.setHeader('X-Robots-Tag', 'noindex, follow');
  } else if (isNoIndex) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
  // Cache for 2 minutes on Edge CDN, background revalidate (only for successful 200 responses)
  if (statusCode === 200) {
    res.setHeader(
      'Cache-Control',
      'public, max-age=120, s-maxage=3600, stale-while-revalidate=86400'
    );
  } else {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
  }
  return res.status(statusCode).send(html);
}
