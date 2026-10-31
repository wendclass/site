const assert = require('assert');

function sanitizeServerHtml(html) {
  if (!html) return '';

  // 1. Strip dangerous blocks completely
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '');

  // 2. Strip event handlers (onload, onerror, onclick, etc.)
  clean = clean.replace(/\s+on[a-z0-9_-]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Strip style attributes
  clean = clean.replace(/\s+style\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 4. Map H1 to H2, H4-H6 to H3 if someone injected them
  clean = clean.replace(/<h1(\b[^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');
  clean = clean.replace(/<h[4-6](\b[^>]*)>/gi, '<h3$1>').replace(/<\/h[4-6]>/gi, '</h3>');

  // 5. Neutralize dangerous link schemes (javascript:, data:, vbscript:)
  clean = clean.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    // Extract href
    const hrefMatch = attrs.match(/href\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+))/i);
    const href = hrefMatch ? (hrefMatch[1] || hrefMatch[2] || hrefMatch[3] || '') : '';
    const lowerHref = href.toLowerCase().trim();

    if (
      lowerHref.startsWith('javascript:') ||
      lowerHref.startsWith('data:') ||
      lowerHref.startsWith('vbscript:')
    ) {
      return '<span>'; // neutralized
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
  // Replace closing tag if <a> was converted to <span>
  // (In standard HTML, paired tags match)

  // 6. Clean image tags
  clean = clean.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    // Retain only src, srcset, sizes, alt, width, height, loading, decoding, class
    const getAttr = (name) => {
      const m = attrs.match(new RegExp(`${name}\\s*=\\s*(?:'([^']*)'|\"([^\"]*)\"|([^\\s>]+))`, 'i'));
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

// Tests
const test1 = '<script>alert("hack")</script><p>Paragraphe sain</p>';
assert.strictEqual(sanitizeServerHtml(test1), '<p>Paragraphe sain</p>');

const test2 = '<img src="photo.webp" onerror="alert(1)" alt="Mon logo">';
const res2 = sanitizeServerHtml(test2);
assert(!res2.includes('onerror'));
assert(res2.includes('photo.webp'));
assert(res2.includes('alt="Mon logo"'));
assert(res2.includes('loading="lazy"'));

const test3 = '<a href="javascript:void(0)">Dangereux</a>';
const res3 = sanitizeServerHtml(test3);
assert(!res3.includes('javascript:'));

const test4 = '<a href="https://externesite.com">Lien externe</a>';
const res4 = sanitizeServerHtml(test4);
assert(res4.includes('rel="noopener noreferrer"'));
assert(res4.includes('target="_blank"'));

const test5 = '<p style="font-size: 50px; color: red;">Texte avec mise en page</p>';
const res5 = sanitizeServerHtml(test5);
assert(!res5.includes('style='));
assert(res5.includes('<p>Texte avec mise en page</p>'));

console.log('✅ ALL SERVER SANITIZER TESTS PASSED!');
