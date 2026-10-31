const https = require('https');

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: data
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('=== VERIFICATION DE PRODUCTION SUR https://www.wendclass.com ===\n');

  // Point 1: 5 routes publiques (Accueil, Offres, Projets, À Propos, Blog)
  const routes = [
    { path: '/', label: 'Accueil' },
    { path: '/offres', label: 'Offres' },
    { path: '/projets', label: 'Projets' },
    { path: '/a-propos', label: 'À Propos' },
    { path: '/blog', label: 'Blog' }
  ];

  console.log('--- POINT 1 : Les 5 routes publiques (Titre, H1, Texte principal) ---');
  for (const r of routes) {
    const res = await fetchUrl(`https://www.wendclass.com${r.path}`);
    const titleMatch = res.body.match(/<title>([^<]+)<\/title>/i);
    const h1Match = res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') : 'ABSENT';
    const titleText = titleMatch ? titleMatch[1].trim() : 'ABSENT';
    const bodySample = res.body.includes('<div id="root">') ? 'Contenu SSR dans #root présent' : 'ABSENT';
    
    // Check specific text in body
    let sampleText = '';
    if (r.path === '/') sampleText = res.body.includes('Questions fréquentes') ? 'FAQ présente' : 'FAQ absente';
    if (r.path === '/offres') sampleText = res.body.includes('Identité Visuelle Complète') ? 'Offre Identité présente' : 'Offre absente';
    if (r.path === '/projets') sampleText = res.body.includes('Nos réalisations') || res.body.includes('Café Pyramide') ? 'Projets présents' : 'Projet absent';
    if (r.path === '/a-propos') sampleText = res.body.includes('Scott Nana') ? 'Scott Nana présent' : 'Absent';
    if (r.path === '/blog') sampleText = res.body.includes('Class S') ? 'Articles/Textes présents' : 'Absent';

    console.log(`Route [${r.label}] (${r.path}) -> Statut: ${res.status}`);
    console.log(`  Titre : "${titleText}"`);
    console.log(`  H1    : "${h1Text}"`);
    console.log(`  Preuve contenu : ${sampleText} (taille HTML: ${res.body.length} octets)\n`);
  }

  // Point 2: robots.txt, sitemap.xml, Google verification file
  console.log('--- POINT 2 : robots.txt, sitemap.xml, fichier Google ---');
  const robots = await fetchUrl('https://www.wendclass.com/robots.txt');
  console.log(`robots.txt -> Statut: ${robots.status}, Content-Type: ${robots.headers['content-type']}`);
  console.log(`  Contient GPTBot: ${robots.body.includes('GPTBot')}, ClaudeBot: ${robots.body.includes('ClaudeBot')}`);
  console.log(`  Extrait: ${robots.body.slice(0, 120).replace(/\n/g, ' ')}\n`);

  const sitemap = await fetchUrl('https://www.wendclass.com/sitemap.xml');
  console.log(`sitemap.xml -> Statut: ${sitemap.status}, Content-Type: ${sitemap.headers['content-type']}`);
  console.log(`  Est XML brut: ${sitemap.body.startsWith('<?xml')}`);
  console.log(`  Nombre d'URLs: ${(sitemap.body.match(/<loc>/g) || []).length}\n`);

  const google = await fetchUrl('https://www.wendclass.com/googlebea468e8e5719358.html');
  console.log(`Fichier Google -> Statut: ${google.status}, Contenu: "${google.body.trim()}"\n`);

  // Point 3: URL inexistante 404 + noindex
  console.log('--- POINT 3 : URL inexistante (404 + noindex) ---');
  const notFound = await fetchUrl('https://www.wendclass.com/page-qui-nexiste-absolument-pas-404');
  console.log(`404 Check -> Statut: ${notFound.status}`);
  console.log(`  Meta robots noindex dans HTML: ${notFound.body.includes('noindex')}`);
  console.log(`  H1: ${notFound.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.trim() || 'N/A'}\n`);

  // Point 4: /classs X-Robots-Tag noindex
  console.log('--- POINT 4 : /classs (X-Robots-Tag noindex) ---');
  const classs = await fetchUrl('https://www.wendclass.com/classs');
  console.log(`/classs -> Statut: ${classs.status}`);
  console.log(`  Header X-Robots-Tag: ${classs.headers['x-robots-tag']}\n`);

  // Point 5: CSP worker-src et child-src
  console.log('--- POINT 5 : En-tête Content-Security-Policy ---');
  const csp = robots.headers['content-security-policy'] || (await fetchUrl('https://www.wendclass.com/')).headers['content-security-policy'];
  console.log(`CSP header present: ${!!csp}`);
  if (csp) {
    const hasWorkerSrc = csp.includes('worker-src') && csp.includes('blob:') && csp.includes('https://challenges.cloudflare.com');
    const hasChildSrc = csp.includes('child-src') && csp.includes('blob:') && csp.includes('https://challenges.cloudflare.com');
    console.log(`  worker-src 'self' blob: https://challenges.cloudflare.com présent: ${hasWorkerSrc}`);
    console.log(`  child-src 'self' blob: https://challenges.cloudflare.com présent: ${hasChildSrc}`);
    console.log(`  Extrait CSP: ${csp}\n`);
  }
}

run().catch(console.error);
