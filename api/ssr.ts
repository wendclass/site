import fs from 'fs';
import path from 'path';
import { offersData } from '../src/data/offres';
import { projectsData, Project } from '../src/data/projets';
import { FAQ_ITEMS } from '../src/data/faq';
import { SITE_URL, SITE_CONFIG } from '../src/config/site';

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
  'pourquoi-un-logo-seul-ne-sauvera-pas-votre-entreprise': {
    title: "Pourquoi un logo seul ne sauvera jamais votre entreprise (et ce qu'il vous faut vraiment)",
    excerpt: "Beaucoup d'entrepreneurs pensent qu'un joli logo suffit à attirer des clients haut de gamme. En réalité, un logo sans système d'identité visuelle est une coquille vide. Décryptage d'une erreur coûteuse.",
    meta_description: "Découvrez pourquoi un logo seul ne suffit pas à asseoir votre crédibilité et comment un véritable système d'identité visuelle transforme la perception de votre entreprise.",
    cover_image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
    published_at: '2026-10-09T10:00:00.000Z',
    content: "<p>Un logo sans écosystème visuel ne crée aucune valeur perçue. Bâtissez un univers complet pour inspirer confiance et justifier des tarifs premium.</p>",
  },
  '5-erreurs-graphiques-reseaux-sociaux-credibilite': {
    title: 'Les 5 erreurs graphiques sur les réseaux sociaux qui détruisent votre crédibilité',
    excerpt: "Des visuels saturés, des polices illisibles, une incohérence de couleurs d'un post à l'autre... Voici les faux pas visuels qui font fuir vos prospects qualifiés et comment les corriger sans tarder.",
    meta_description: "Typographies illisibles, manque de cohérence chromatique, surcharge d'informations : évitez ces 5 erreurs graphiques qui font fuir vos prospects sur les réseaux sociaux.",
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    published_at: '2026-10-05T10:00:00.000Z',
    content: "<p>Sur les réseaux sociaux, 1,7 seconde décide de l'attention d'un prospect. Évitez les erreurs graphiques qui ruinent votre professionnalisme.</p>",
  },
  'transformer-identite-visuelle-en-levier-de-conversion': {
    title: 'Comment transformer une identité visuelle en levier de conversion commerciale',
    excerpt: "Le design n'est pas une simple décoration esthétique : c'est un outil de vente puissant. Découvrez comment structurer votre univers de marque pour inspirer confiance et justifier des tarifs premium.",
    meta_description: "Le design graphique n'est pas une simple dépense esthétique : c'est un investissement stratégique qui réduit les frictions de vente et justifie des tarifs élevés.",
    cover_image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
    published_at: '2026-09-28T10:00:00.000Z',
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
              slug: p.slug,
              title: p.title,
              category: p.category,
              tagline: p.tagline,
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
          return list[0];
        }
      }
    } catch (err) {
      console.warn('[SSR] Supabase article fetch fallback:', err);
    }
  }
  return fallbackArticles[slug] || null;
}

async function getArticlesList(): Promise<any[]> {
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=slug,title,excerpt,cover_image,published_at&status=eq.publie&order=published_at.desc`,
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

export default async function handler(req: any, res: any) {
  const baseUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || SITE_URL;
  const rawRoute = (req.query.route as string) || req.url?.split('?')[0] || '/';
  const slug =
    (req.query.slug as string) ||
    (rawRoute.startsWith('/blog/')
      ? rawRoute.replace(/^\/blog\//, '').split('?')[0]
      : '');

  // Determine normalized route
  let normalizedRoute = '/';
  if (rawRoute.startsWith('/offres')) normalizedRoute = '/offres';
  else if (rawRoute.startsWith('/projets')) normalizedRoute = '/projets';
  else if (rawRoute.startsWith('/a-propos')) normalizedRoute = '/a-propos';
  else if (rawRoute.startsWith('/blog/')) normalizedRoute = '/blog/:slug';
  else if (rawRoute.startsWith('/blog')) normalizedRoute = '/blog';

  // Load HTML template
  let html = '';
  const candidatePaths = [
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
  let pageType = 'website';
  let ssrContent = '';
  let jsonLd: any = null;

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
      '@type': 'ProfessionalService',
      name: SITE_CONFIG.name,
      alternateName: SITE_CONFIG.alternateName,
      url: baseUrl,
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
    };

    ssrContent = `
      <main class="space-y-0" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Hero Section -->
        <section class="relative pt-8 pb-16 md:pt-14 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Brand & Graphic Design • Ouagadougou</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
            D'une image qui existe à une image qui fait vendre.
          </h1>
          <p class="text-base sm:text-lg text-onyx/80 font-normal leading-relaxed max-w-2xl mb-8">
            Avant chaque projet, je définis ce que vos clients doivent faire, puis je conçois chaque élément pour les y conduire.
          </p>
          <div class="flex flex-wrap gap-4 mb-8">
            <a href="/#contact" class="px-6 py-3 bg-[#6600CC] text-white font-semibold rounded-full">Prendre contact</a>
            <a href="/projets" class="px-6 py-3 border border-onyx/20 text-onyx font-semibold rounded-full">Voir mes réalisations</a>
          </div>
          <div class="pt-6 border-t border-violet-imperial/10 flex flex-wrap gap-6 text-xs text-onyx/70">
            <span>✓ Direction artistique sur mesure</span>
            <span>✓ Délais d'exécution rapides</span>
            <span>✓ Zéro modèle générique</span>
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
      "Découvrez nos 5 formules d'accompagnement en identité visuelle, branding social media, sites web et communication événementielle à Ouagadougou.";
    pageCanonical = `${baseUrl}/offres`;

    ssrContent = `
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Nos formules d'accompagnement</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Des formules conçues pour faire grandir votre activité
          </h1>
          <p class="text-base sm:text-lg text-onyx/75 leading-relaxed">
            Chaque offre est calibrée pour apporter une réponse graphique stratégique à un besoin précis. Aucun tarif générique : chaque collaboration fait l’objet d’un échange préalable pour adapter le dispositif à vos objectifs.
          </p>
        </div>

        <!-- Engagement -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-violet-imperial/10 via-white to-or-champagne/10 border border-violet-imperial/20 text-center mb-12">
          <p class="text-lg font-title italic" style="font-family:'Cormorant Garamond', Georgia, serif;">
            « Chaque élément de votre identité sera construit pour qu'elle s'impose dans votre marché et ne se noie pas parmi vos concurrents. »
          </p>
          <span class="text-xs text-violet-imperial font-semibold uppercase tracking-wider mt-2 block">— Engagement de conception Class S</span>
        </div>

        <!-- 5 Offers with ALL Accordion Content in DOM -->
        <div class="space-y-8 mb-16">
          ${offersData.map((offer) => `
            <article class="bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-sm font-bold text-[#C9A070] uppercase">${offer.number}</span>
                ${offer.badge ? `<span class="px-3 py-0.5 rounded-full bg-violet-imperial/10 text-violet-imperial text-xs font-semibold">${offer.badge}</span>` : ''}
                ${offer.isCustomQuoteOnly ? `<span class="px-3 py-0.5 rounded-full bg-[#C9A070]/15 text-[#8A5E2E] text-xs font-semibold">Sur devis personnalisé</span>` : ''}
              </div>
              <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
                ${offer.title}
              </h2>
              <p class="text-sm sm:text-base text-onyx/75 mb-4">${offer.subtitle}</p>

              ${offer.highlightPromise ? `
                <div class="p-4 rounded-xl bg-violet-imperial/5 border border-violet-imperial/10 mb-4 text-xs font-medium text-onyx/85">
                  ${offer.highlightPromise}
                </div>
              ` : ''}

              ${offer.highlightDetails && offer.highlightDetails.length > 0 ? `
                <ul class="space-y-2 mb-6 text-sm text-onyx/80">
                  ${offer.highlightDetails.map((detail) => `
                    <li class="flex items-start gap-2">
                      <span class="text-[#6600CC]">✓</span>
                      <span>${detail}</span>
                    </li>
                  `).join('')}
                </ul>
              ` : ''}

              <!-- Contenu des accordéons PRÉSENT DANS LE DOM INITIAL -->
              ${offer.accordionDetails && offer.accordionDetails.length > 0 ? `
                <div class="pt-4 border-t border-violet-imperial/10 space-y-3">
                  ${offer.accordionDetails.map((acc) => `
                    <div class="bg-ivoire-violet/50 rounded-xl p-4">
                      <h3 class="font-semibold text-xs uppercase tracking-wider text-onyx mb-2">${acc.title}</h3>
                      <ul class="space-y-1.5 text-xs text-onyx/75">
                        ${acc.items.map((it) => `
                          <li class="flex items-start gap-2">
                            <span class="text-[#C9A070]">•</span>
                            <span>${it}</span>
                          </li>
                        `).join('')}
                      </ul>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <div class="mt-6 pt-4">
                <a href="/#contact" class="inline-block px-5 py-2.5 bg-[#6600CC] text-white text-sm font-semibold rounded-full">${offer.ctaText}</a>
              </div>
            </article>
          `).join('')}
        </div>

        <!-- FAQ -->
        <section class="max-w-4xl mx-auto mb-16">
          <h2 class="text-2xl sm:text-3xl font-title font-semibold text-center mb-8" style="font-family:'Cormorant Garamond', Georgia, serif;">
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

    ssrContent = `
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Réalisations & Études de cas</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Chaque visuel a une mission commerciale
          </h1>
          <p class="text-base sm:text-lg text-onyx/75 leading-relaxed">
            Découvrez l’intégralité des visuels et dispositifs conçus pour chaque projet, avec leur intention stratégique et leur impact.
          </p>
        </div>

        <!-- Projects Deep Dives -->
        <div class="space-y-12 mb-16">
          ${projects.map((p, idx) => `
            <article id="${p.slug}" class="bg-white rounded-3xl p-6 sm:p-10 border border-violet-imperial/15 shadow-soft">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xs font-bold text-[#C9A070] uppercase">Projet 0${idx + 1}</span>
                <span class="px-3 py-0.5 rounded-full bg-violet-imperial/10 text-violet-imperial text-xs font-semibold uppercase">${p.category}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-1" style="font-family:'Cormorant Garamond', Georgia, serif;">
                ${p.title}
              </h2>
              <p class="text-sm italic text-onyx/75 mb-6">${p.tagline}</p>

              <!-- 3-Part Case Study Grid (But -> Solution -> Résultat) -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-ivoire-violet/70 rounded-2xl p-4 border border-violet-imperial/10">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-violet-imperial mb-2">1. But du client</h3>
                  <p class="text-sm text-onyx/85 leading-relaxed">${p.clientGoal}</p>
                </div>
                <div class="bg-ivoire-violet/70 rounded-2xl p-4 border border-violet-imperial/10">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-violet-imperial mb-2">2. Ce qui a été conçu</h3>
                  <p class="text-sm text-onyx/85 leading-relaxed">${p.designedSolution}</p>
                </div>
                <div class="bg-ivoire-violet/70 rounded-2xl p-4 border border-violet-imperial/10">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-violet-imperial mb-2">3. Résultat obtenu</h3>
                  <p class="text-sm text-onyx/85 leading-relaxed">${p.result}</p>
                </div>
              </div>

              ${p.disclaimer ? `
                <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-6">
                  ⚠️ ${p.disclaimer}
                </div>
              ` : ''}

              <!-- Galerie de visuels -->
              <div class="pt-4 border-t border-violet-imperial/10">
                <h3 class="text-xs font-bold uppercase tracking-wider text-onyx mb-3">Galerie des réalisations (${p.gallery.length} visuels)</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  ${p.gallery.map((img) => `
                    <figure class="rounded-xl overflow-hidden bg-onyx aspect-square border border-violet-imperial/10">
                      <img src="${img.src}" alt="${img.caption || p.title}" class="w-full h-full object-cover" loading="lazy" />
                    </figure>
                  `).join('')}
                </div>
              </div>

              ${p.testimonialPlaceholder ? `
                <div class="mt-6 p-4 rounded-xl bg-violet-imperial/5 border border-violet-imperial/10 text-xs italic text-onyx/80">
                  💬 « ${p.testimonialPlaceholder} »
                </div>
              ` : ''}
            </article>
          `).join('')}
        </div>

        <footer class="py-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
          <p>${SITE_CONFIG.anchorPhrase}</p>
        </footer>
      </main>
    `;
  }

  // ROUTE 4: À PROPOS (/a-propos)
  else if (normalizedRoute === '/a-propos') {
    pageTitle = "À Propos de Scott Nana & Class S | Studio d'Identité Visuelle";
    pageDesc =
      "Class S est un studio d'identité visuelle à Ouagadougou, au service des entrepreneurs et des PME. Découvrez l'histoire et la vision du design d'impact par Scott Nana.";
    pageCanonical = `${baseUrl}/a-propos`;

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

    if (slug && article) {
      pageTitle = `${article.title} | Class S`;
      pageDesc = article.meta_description || article.excerpt || pageDesc;
      pageImage = article.cover_image || `${baseUrl}/assets/logo/og-image.png`;
      pageCanonical = `${baseUrl}/blog/${slug}`;
      pageType = 'article';

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: pageDesc,
        image: [pageImage],
        datePublished: article.published_at || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: SITE_CONFIG.founder,
          jobTitle: SITE_CONFIG.jobTitle,
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

      ssrContent = `
        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
          <div class="mb-8">
            <a href="/blog" class="text-xs uppercase font-bold text-violet-imperial tracking-wider hover:underline">← Retour au Journal Class S</a>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight mt-4 mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
              ${article.title}
            </h1>
            <p class="text-xs text-onyx/60">Par Scott Nana — Brand & Graphic Designer</p>
          </div>
          ${article.cover_image ? `
            <img src="${article.cover_image}" alt="${article.title}" class="w-full rounded-2xl mb-8 max-h-[480px] object-cover" />
          ` : ''}
          <div class="prose max-w-none text-base sm:text-lg leading-relaxed text-onyx/85">
            ${article.content || `<p>${article.excerpt}</p>`}
          </div>
          <footer class="mt-12 pt-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
            <p>${SITE_CONFIG.anchorPhrase}</p>
          </footer>
        </article>
      `;
    } else {
      // Blog index
      pageTitle = "Le Journal Class S — Stratégie Visuelle & Branding | Scott Nana";
      pageDesc =
        "Analyses, décryptages et principes graphiques pour transformer l'identité visuelle de votre entreprise en levier de conversion commerciale.";
      pageCanonical = `${baseUrl}/blog`;

      const articlesList = await getArticlesList();

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Le Journal Class S',
        url: pageCanonical,
        description: pageDesc,
        author: {
          '@type': 'Person',
          name: SITE_CONFIG.founder,
        },
      };

      ssrContent = `
        <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
              <span>Éditorial & Stratégie</span>
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Le Journal Class S
            </h1>
            <p class="text-base sm:text-lg text-onyx/75 leading-relaxed">
              Analyses, décryptages et principes graphiques par Scott Nana.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            ${articlesList.map((art) => `
              <article class="bg-white rounded-2xl overflow-hidden border border-violet-imperial/15 shadow-soft flex flex-col">
                ${art.cover_image ? `<img src="${art.cover_image}" alt="${art.title}" class="aspect-[16/10] w-full object-cover" loading="lazy" />` : ''}
                <div class="p-6 flex flex-col flex-grow">
                  <h2 class="text-xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
                    <a href="/blog/${art.slug}" class="hover:text-violet-imperial transition-colors">${art.title}</a>
                  </h2>
                  <p class="text-xs text-onyx/75 leading-relaxed mb-4 flex-grow">${art.excerpt}</p>
                  <a href="/blog/${art.slug}" class="text-xs font-semibold text-violet-imperial hover:underline">Lire l'analyse →</a>
                </div>
              </article>
            `).join('')}
          </div>

          <footer class="py-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
            <p>${SITE_CONFIG.anchorPhrase}</p>
          </footer>
        </main>
      `;
    }
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
    <link rel="canonical" href="${pageCanonical}" />
    <!-- Open Graph -->
    <meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${pageDesc.replace(/"/g, '&quot;')}" />
    <meta property="og:type" content="${pageType}" />
    <meta property="og:url" content="${pageCanonical}" />
    <meta property="og:image" content="${pageImage}" />
    <meta property="og:site_name" content="Class S — Scott Nana" />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${pageDesc.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${pageImage}" />
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
  `;

  // Clean old tags
  html = html
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^>]*>/gi, '')
    .replace(/<meta\s+property="twitter:[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^>]*>/gi, '');

  html = html.replace('</head>', `${tagsToInject}\n</head>`);

  // 3. Inject SSR body inside <div id="root">
  if (ssrContent && html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${ssrContent}</div>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache for 2 minutes on Edge CDN, background revalidate
  res.setHeader(
    'Cache-Control',
    'public, max-age=60, s-maxage=120, stale-while-revalidate=600'
  );
  return res.status(200).send(html);
}
