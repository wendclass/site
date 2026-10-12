import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  const slug = (req.query.slug as string) || '';
  const baseUrl = 'https://wendclass.vercel.app';
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
      title: 'Pourquoi un logo seul ne sauvera jamais votre entreprise (et ce qu\'il vous faut vraiment)',
      excerpt: 'Beaucoup d\'entrepreneurs pensent qu\'un joli logo suffit à attirer des clients haut de gamme. En réalité, un logo sans système d\'identité visuelle est une coquille vide. Décryptage d\'une erreur coûteuse.',
      meta_description: 'Découvrez pourquoi un logo seul ne suffit pas à asseoir votre crédibilité et comment un véritable système d\'identité visuelle transforme la perception de votre entreprise.',
      cover_image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      published_at: '2026-10-09T10:00:00.000Z',
      content: '<p>Un logo sans écosystème visuel ne crée aucune valeur perçue. Bâtissez un univers complet pour inspirer confiance et justifier des tarifs premium.</p>',
    },
    '5-erreurs-graphiques-reseaux-sociaux-credibilite': {
      title: 'Les 5 erreurs graphiques sur les réseaux sociaux qui détruisent votre crédibilité',
      excerpt: 'Des visuels saturés, des polices illisibles, une incohérence de couleurs d\'un post à l\'autre... Voici les faux pas visuels qui font fuir vos prospects qualifiés et comment les corriger sans tarder.',
      meta_description: 'Typographies illisibles, manque de cohérence chromatique, surcharge d\'informations : évitez ces 5 erreurs graphiques qui font fuir vos prospects sur les réseaux sociaux.',
      cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      published_at: '2026-10-05T10:00:00.000Z',
      content: '<p>Sur les réseaux sociaux, 1,7 seconde décide de l\'attention d\'un prospect. Évitez les erreurs graphiques qui ruinent votre professionnalisme.</p>',
    },
    'transformer-identite-visuelle-en-levier-de-conversion': {
      title: 'Comment transformer une identité visuelle en levier de conversion commerciale',
      excerpt: 'Le design n\'est pas une simple décoration esthétique : c\'est un outil de vente puissant. Découvrez comment structurer votre univers de marque pour inspirer confiance et justifier des tarifs premium.',
      meta_description: 'Le design graphique n\'est pas une simple dépense esthétique : c\'est un investissement stratégique qui réduit les frictions de vente et justifie des tarifs élevés.',
      cover_image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
      published_at: '2026-09-28T10:00:00.000Z',
      content: '<p>Le design graphique est un multiplicateur de conversion commerciale. Découvrez comment structurer votre marque pour réduire les objections de prix.</p>',
    },
  };

  let article: any = null;

  if (slug) {
    if (supabaseUrl && supabaseKey) {
      try {
        const queryUrl = `${supabaseUrl}/rest/v1/articles?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.publie&limit=1`;
        const response = await fetch(queryUrl, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });
        if (response.ok) {
          const list = await response.json();
          if (Array.isArray(list) && list.length > 0) {
            article = list[0];
          }
        }
      } catch (err) {
        console.warn('SSR Supabase fetch failed:', err);
      }
    }

    if (!article && fallbackArticles[slug]) {
      article = fallbackArticles[slug];
    }
  }

  // Load index.html template
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

  // Fallback minimal template if file not found
  if (!html) {
    html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Class S — Scott Nana</title>
  </head>
  <body class="bg-[#0E0F12] text-[#F5F3FF]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }

  // Target values
  let pageTitle = 'Le Journal Class S — Stratégie Visuelle & Branding | Scott Nana';
  let pageDesc =
    'Analyses, décryptages et principes graphiques pour transformer l\'identité visuelle de votre entreprise en levier de conversion commerciale.';
  let pageImage = `${baseUrl}/assets/logo/og-image.png`;
  let pageUrl = `${baseUrl}/blog`;
  let pageType = 'website';
  let ssrBody = '';
  let jsonLd = '';

  if (slug && article) {
    pageTitle = `${article.title} | Class S`;
    pageDesc = article.meta_description || article.excerpt || pageDesc;
    pageImage = article.cover_image || `${baseUrl}/assets/logo/og-image.png`;
    pageUrl = `${baseUrl}/blog/${slug}`;
    pageType = 'article';

    jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: pageDesc,
      image: [pageImage],
      datePublished: article.published_at || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: 'Scott Nana',
        jobTitle: 'Brand & Graphic Designer',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Class S',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/assets/logo/logo-violet.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': pageUrl,
      },
    });

    ssrBody = `
      <div style="background-color:#0E0F12; color:#F5F3FF; min-height:100vh; padding:3rem 1rem; font-family:'Jost', sans-serif;">
        <div style="max-width:800px; margin:0 auto;">
          <p style="color:#C69254; font-size:0.9rem; font-weight:600; text-transform:uppercase;">Class S — Éditorial</p>
          <h1 style="font-family:'Cormorant Garamond', serif; font-size:2.5rem; line-height:1.2; margin:1rem 0; color:#FFFFFF;">${article.title}</h1>
          <p style="color:#A78BFA; font-size:0.9rem; margin-bottom:1.5rem;">Par Scott Nana — Brand & Graphic Designer</p>
          ${article.cover_image ? `<img src="${article.cover_image}" alt="${article.title}" style="width:100%; border-radius:1rem; margin-bottom:2rem; max-height:480px; object-fit:cover;" />` : ''}
          <div style="line-height:1.8; font-size:1.1rem; color:#E0DEF4;">
            ${article.content || `<p>${article.excerpt}</p>`}
          </div>
        </div>
      </div>
    `;
  } else {
    // Blog index
    jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Le Journal Class S',
      url: pageUrl,
      description: pageDesc,
      author: {
        '@type': 'Person',
        name: 'Scott Nana',
      },
    });

    ssrBody = `
      <div style="background-color:#0E0F12; color:#F5F3FF; min-height:100vh; padding:3rem 1rem; font-family:'Jost', sans-serif;">
        <div style="max-width:800px; margin:0 auto; text-align:center;">
          <h1 style="font-family:'Cormorant Garamond', serif; font-size:3rem; color:#FFFFFF;">Le Journal Class S</h1>
          <p style="color:#A78BFA; font-size:1.1rem; margin-top:1rem;">Analyses, décryptages et principes graphiques par Scott Nana.</p>
        </div>
      </div>
    `;
  }

  // Replace or inject <title>
  if (html.includes('<title>')) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
  } else {
    html = html.replace('</head>', `<title>${pageTitle}</title></head>`);
  }

  // Clean existing primary and OG tags to inject new ones
  const tagsToInject = `
    <meta name="description" content="${pageDesc.replace(/"/g, '&quot;')}" />
    <link rel="canonical" href="${pageUrl}" />
    <!-- Open Graph -->
    <meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${pageDesc.replace(/"/g, '&quot;')}" />
    <meta property="og:type" content="${pageType}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:image" content="${pageImage}" />
    <meta property="og:site_name" content="Class S — Scott Nana" />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${pageDesc.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${pageImage}" />
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">${jsonLd}</script>
  `;

  // Remove duplicate meta if present
  html = html
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^>]*>/gi, '')
    .replace(/<meta\s+property="twitter:[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^>]*>/gi, '');

  html = html.replace('</head>', `${tagsToInject}\n</head>`);

  // Inject SSR body inside <div id="root">
  if (ssrBody && html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${ssrBody}</div>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, max-age=60, s-maxage=600, stale-while-revalidate=86400'
  );
  return res.status(200).send(html);
}
