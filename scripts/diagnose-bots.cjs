const https = require('https');

const BOTS = [
  { name: 'Facebook', ua: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uiagent.php)' },
  { name: 'WhatsApp', ua: 'WhatsApp/2.23.20.0' },
  { name: 'LinkedIn', ua: 'LinkedInBot/1.0' },
  { name: 'Twitter',  ua: 'Twitterbot/1.0' },
  { name: 'Telegram', ua: 'TelegramBot (like TwitterBot)' }
];

const ROUTES = [
  '/',
  '/offres',
  '/projets',
  '/a-propos',
  '/blog',
  '/blog/pourquoi-un-logo-seul-ne-sauvera-pas-votre-entreprise'
];

const BASE_URL = 'https://wendclass.vercel.app';

function fetchUrl(url, userAgent) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.get(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const timeMs = Date.now() - start;
        resolve({
          status: res.statusCode,
          timeMs,
          headers: res.headers,
          data
        });
      });
    });
    req.on('error', (err) => resolve({ status: 'ERR', timeMs: Date.now() - start, error: err.message }));
  });
}

function checkImage(imgUrl) {
  return new Promise((resolve) => {
    if (!imgUrl || !imgUrl.startsWith('http')) {
      return resolve({ status: 'INVALID_URL', contentType: 'none', size: 0 });
    }
    const req = https.get(imgUrl, (res) => {
      let size = 0;
      res.on('data', chunk => size += chunk.length);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'] || size
        });
      });
    });
    req.on('error', (err) => resolve({ status: 'ERR', error: err.message }));
  });
}

async function run() {
  console.log('================ DIAGNOSTIC ROBOTS DES RÉSEAUX SOCIAUX ================\n');

  const results = [];

  for (const route of ROUTES) {
    const fullUrl = BASE_URL + route;
    console.log(`\n>>> Testing Route: ${route}`);

    for (const bot of BOTS) {
      const res = await fetchUrl(fullUrl, bot.ua);
      
      const getMeta = (prop) => {
        const m = res.data?.match(new RegExp(`<meta\\s+property=["']${prop}["']\\s+content=["']([^"']*)["']`, 'i'))
               || res.data?.match(new RegExp(`<meta\\s+name=["']${prop}["']\\s+content=["']([^"']*)["']`, 'i'));
        return m ? m[1] : null;
      };

      const ogTitle = getMeta('og:title');
      const ogDesc = getMeta('og:description');
      const ogImage = getMeta('og:image');
      const ogUrl = getMeta('og:url');
      const ogType = getMeta('og:type');
      const twCard = getMeta('twitter:card');
      const twImage = getMeta('twitter:image');

      results.push({
        route,
        bot: bot.name,
        status: res.status,
        timeMs: res.timeMs,
        cache: res.headers['x-vercel-cache'] || 'none',
        ogTitle: !!ogTitle,
        ogDesc: !!ogDesc,
        ogImage: ogImage,
        ogUrl: !!ogUrl,
        ogType: !!ogType,
        twCard: twCard,
        twImage: twImage
      });

      console.log(`  [${bot.name}] Status: ${res.status} | ${res.timeMs}ms | cache: ${res.headers['x-vercel-cache'] || 'MISS'} | og:image: ${ogImage || 'MANQUANT'} | tw:card: ${twCard || 'MANQUANT'}`);
    }
  }

  // Diagnostic sur les images og:image collectées
  console.log('\n================ DIAGNOSTIC DES IMAGES OG:IMAGE ================');
  const uniqueImages = [...new Set(results.map(r => r.ogImage).filter(Boolean))];
  for (const img of uniqueImages) {
    const imgRes = await checkImage(img);
    console.log(`URL: ${img}`);
    console.log(`  Status HTTP: ${imgRes.status}`);
    console.log(`  Content-Type: ${imgRes.contentType}`);
    console.log(`  Content-Length: ${imgRes.contentLength} bytes`);
  }

  // Diagnostic sur l'image par défaut attendue
  console.log('\n================ TEST DE L\'IMAGE DE REPLI /assets/logo/og-image.png ================');
  const defaultImg = await checkImage(`${BASE_URL}/assets/logo/og-image.png`);
  console.log(`URL: ${BASE_URL}/assets/logo/og-image.png`);
  console.log(`  Status: ${defaultImg.status}`);
  console.log(`  Content-Type: ${defaultImg.contentType}`);
}

run();
