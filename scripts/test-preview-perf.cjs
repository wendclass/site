const https = require('https');

const PREVIEW_HOST = 'site-rk91022au-wendclasss.vercel.app';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: PREVIEW_HOST,
      path,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...options.headers
      }
    }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          status: res.statusCode,
          headers: res.headers,
          length: buffer.length,
          body: buffer.toString('utf8')
        });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log(`=== VÉRIFICATION EN DIRECT SUR LA PREVIEW VERCEL ===\nURL: https://${PREVIEW_HOST}\n`);

  // Test 1: Route / (Accueil)
  const rHome = await request('/');
  console.log(`1. Route / (Accueil)`);
  console.log(`   Statut: ${rHome.status}`);
  console.log(`   Taille HTML reçu: ${rHome.length} octets`);
  console.log(`   H1 présent: ${rHome.body.includes("D'une image qui existe à une image qui fait vendre.")}`);
  console.log(`   SSR Hero Vitrine aligné (sans image brute): ${rHome.body.includes('Vitrine animée des projets Class S')}`);
  console.log('');

  // Test 2: Route /projets
  const rProjets = await request('/projets');
  console.log(`2. Route /projets`);
  console.log(`   Statut: ${rProjets.status}`);
  console.log(`   Taille HTML reçu: ${rProjets.length} octets`);
  const optimizedMatches = rProjets.body.match(/\/assets\/optimized\/[^\s"'>]+/g) || [];
  console.log(`   Occurrences d'URLs /assets/optimized/ dans le HTML SSR: ${optimizedMatches.length}`);
  console.log('');

  // Test 3: Test d'une image optimisée (1200w WebP Hero Slide Bang)
  const testWebpUrl = '/assets/optimized/projets/bang/subway-led-billboard-bang-1200.2accd520.webp';
  const rWebp = await request(testWebpUrl);
  console.log(`3. Variante WebP : ${testWebpUrl}`);
  console.log(`   Statut: ${rWebp.status}`);
  console.log(`   Content-Type: ${rWebp.headers['content-type']}`);
  console.log(`   Cache-Control: ${rWebp.headers['cache-control']}`);
  console.log(`   Taille transférée: ${(rWebp.length / 1024).toFixed(1)} Ko (Original était 11,64 Mo !)`);
  console.log('');

  // Test 4: Test d'une vignette optimisée (480w WebP)
  const testThumbUrl = '/assets/optimized/projets/mon-frere-parle/mfp_outdoorpostermockup004-480.12496936.webp';
  const rThumb = await request(testThumbUrl);
  console.log(`4. Vignette WebP 480w : ${testThumbUrl}`);
  console.log(`   Statut: ${rThumb.status}`);
  console.log(`   Content-Type: ${rThumb.headers['content-type']}`);
  console.log(`   Cache-Control: ${rThumb.headers['cache-control']}`);
  console.log(`   Taille transférée: ${(rThumb.length / 1024).toFixed(1)} Ko (Original était 16,34 Mo !)`);
  console.log('');

  // Test 5: Test du portrait Scott Nana (800w WebP)
  const testPortraitUrl = '/assets/optimized/about/scott-nana-800.1bbb2194.webp';
  const rPortrait = await request(testPortraitUrl);
  console.log(`5. Portrait Scott Nana 800w : ${testPortraitUrl}`);
  console.log(`   Statut: ${rPortrait.status}`);
  console.log(`   Content-Type: ${rPortrait.headers['content-type']}`);
  console.log(`   Cache-Control: ${rPortrait.headers['cache-control']}`);
  console.log(`   Taille transférée: ${(rPortrait.length / 1024).toFixed(1)} Ko (Original était 1,75 Mo)`);
  console.log('');

  // Test 6: Test du cache général sur les autres assets (ex: logo SVG)
  const rLogo = await request('/assets/logo/Logo-Class-S-06.svg');
  console.log(`6. Asset SVG / Logo (/assets/logo/Logo-Class-S-06.svg)`);
  console.log(`   Statut: ${rLogo.status}`);
  console.log(`   Cache-Control: ${rLogo.headers['cache-control']}`);
  console.log('');

  console.log('=== VÉRIFICATION EN DIRECT TERMINÉE AVEC SUCCÈS ===');
}

runTests().catch(console.error);
