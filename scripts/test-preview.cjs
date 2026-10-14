const https = require('https');

const routes = [
  '/',
  '/offres',
  '/projets',
  '/a-propos',
  '/blog',
  '/blog/pourquoi-une-identite-visuelle-forte-change-tout-pour-votre-entreprise',
  '/page-inexistante-xyz'
];

const baseUrl = 'https://site-4lf3x5kyl-wendclasss.vercel.app';

function fetchRoute(r) {
  return new Promise((resolve) => {
    https.get(baseUrl + r, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          route: r,
          status: res.statusCode,
          headers: res.headers,
          data
        });
      });
    }).on('error', err => resolve({ route: r, error: err.message }));
  });
}

async function run() {
  for (const r of routes) {
    const res = await fetchRoute(r);
    if (res.error) {
      console.log('Error fetching', r, res.error);
      continue;
    }
    const jsonLdMatches = [...res.data.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
    console.log('=== ROUTE:', r, 'Status:', res.status, '===');
    console.log('Title:', (res.data.match(/<title>([^<]*)<\/title>/i) || [])[1]);
    console.log('Canonical:', (res.data.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) || [])[1]);
    console.log('H1:', (res.data.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.trim().replace(/\s+/g, ' '));
    console.log('JSON-LD scripts count:', jsonLdMatches.length);
    jsonLdMatches.forEach((m, idx) => {
      try {
        const parsed = JSON.parse(m[1]);
        console.log(`  JSON-LD #${idx+1} @type:`, parsed['@type']);
      } catch (e) {
        console.log(`  JSON-LD #${idx+1} parse error:`, e.message);
      }
    });
    console.log('Contains root content length:', res.data.indexOf('<div id="root">') !== -1 ? 'Has #root' : 'No #root');
    console.log('HTML size:', res.data.length);
    console.log('-------------------------------------------');
  }
}

run();
