export default async function handler(_req: any, res: any) {
  const baseUrl = 'https://wendclass.vercel.app';
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mtinydrkpxffrlsuwpzh.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  const fallbackArticles = [
    {
      slug: 'pourquoi-un-logo-seul-ne-sauvera-pas-votre-entreprise',
      lastmod: '2026-10-09T10:00:00.000Z',
    },
    {
      slug: '5-erreurs-graphiques-reseaux-sociaux-credibilite',
      lastmod: '2026-10-05T10:00:00.000Z',
    },
    {
      slug: 'transformer-identite-visuelle-en-levier-de-conversion',
      lastmod: '2026-09-28T10:00:00.000Z',
    },
  ];

  let articles = fallbackArticles;

  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=slug,published_at,updated_at&status=eq.publie`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          articles = data.map((item: any) => ({
            slug: item.slug,
            lastmod: item.updated_at || item.published_at || new Date().toISOString(),
          }));
        }
      }
    } catch (err) {
      console.warn('Sitemap Supabase fetch error, fallback used:', err);
    }
  }

  const staticPages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/offres`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/projets`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/blog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/a-propos`, priority: '0.8', changefreq: 'monthly' },
  ];

  const now = new Date().toISOString().split('T')[0];

  const xmlUrls = [
    ...staticPages.map(
      (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...articles.map(
      (a) => `  <url>
    <loc>${baseUrl}/blog/${a.slug}</loc>
    <lastmod>${(a.lastmod || now).split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
  ].join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, s-maxage=14400, stale-while-revalidate=86400'
  );
  return res.status(200).send(sitemapXml);
}
