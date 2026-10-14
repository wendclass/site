const path = require('path');

async function test() {
  const handler = (await import('../api/ssr.js')).default;

  const testRoutes = [
    { route: '/', name: 'Accueil' },
    { route: '/offres', name: 'Offres' },
    { route: '/projets', name: 'Projets' },
    { route: '/a-propos', name: 'A Propos' },
    { route: '/blog', name: 'Blog Index' },
    { route: '/blog/pourquoi-un-logo-seul-ne-sauvera-pas-votre-entreprise', name: 'Blog Article' },
    { route: '/blog/article-inexistant-404', name: 'Blog Article 404' },
    { route: '/page-inexistante-xyz', name: 'Route Inexistante 404' }
  ];

  console.log('================ SSR LOCAL VERIFICATION TEST ================\n');

  for (const t of testRoutes) {
    let statusCode = 200;
    const headers = {};
    let outputBody = '';

    const req = {
      url: t.route,
      query: { route: t.route }
    };

    const res = {
      setHeader(k, v) {
        headers[k] = v;
      },
      status(code) {
        statusCode = code;
        return this;
      },
      send(data) {
        outputBody = data;
        return this;
      }
    };

    await handler(req, res);

    const jsonLdMatches = [...outputBody.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
    const title = (outputBody.match(/<title>([^<]*)<\/title>/i) || [])[1];
    const canonical = (outputBody.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) || [])[1];
    const h1 = (outputBody.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.trim().replace(/\s+/g, ' ');
    const robotsMeta = (outputBody.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i) || [])[1];
    const xRobots = headers['X-Robots-Tag'];

    console.log(`TEST [${t.name}] -> Route: ${t.route}`);
    console.log(`  HTTP Status: ${statusCode}`);
    console.log(`  X-Robots-Tag: ${xRobots || 'none'}`);
    console.log(`  Meta Robots: ${robotsMeta || 'none'}`);
    console.log(`  Title: ${title}`);
    console.log(`  Canonical: ${canonical}`);
    console.log(`  H1: ${h1}`);
    console.log(`  JSON-LD Blocks Count: ${jsonLdMatches.length}`);
    jsonLdMatches.forEach((m, idx) => {
      try {
        const parsed = JSON.parse(m[1]);
        if (parsed['@graph']) {
          console.log(`    #${idx+1} @graph types: ${parsed['@graph'].map(g => g['@type']).join(', ')}`);
        } else {
          console.log(`    #${idx+1} @type: ${parsed['@type']}`);
        }
        if (t.route === '/' || t.route === '/offres') {
          console.log('\n--- JSON-LD BRUT DE ' + t.route + ' ---');
          console.log(JSON.stringify(parsed, null, 2));
          console.log('-------------------------------------\n');
        }
      } catch (e) {
        console.log(`    #${idx+1} PARSE ERROR: ${e.message}`);
      }
    });
    console.log(`  HTML Size: ${outputBody.length} bytes`);
    console.log('-------------------------------------------------------------');
  }
}

test().catch(console.error);
