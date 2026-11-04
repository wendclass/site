const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Read manifest
const manifestPath = path.join(__dirname, '..', 'src', 'data', 'image-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Projects data
const projects = [
  {
    slug: '72-heures-cj-2026',
    heroImage: '/assets/projets/72h-cj-2026/Carrousel 0 72h 2026.png',
  },
  {
    slug: 'mon-frere-parle',
    heroImage: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Visuel_Principal.jpg',
  },
  {
    slug: 'off-day',
    heroImage: '/assets/projets/off-day/Off_Day_Visual_v2.2 Corrigé.png',
  },
  {
    slug: 'cafe-inspire',
    heroImage: '/assets/projets/cafe-inspire/01_Café Pyramide v3.png',
  },
  {
    slug: 'bang',
    heroImage: '/assets/projets/bang/Présentation_bang_logo.png',
  },
];

const outDir = path.join(__dirname, '..', 'public', 'og', 'projets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Convert default banniere-class-s.png to JPEG as well
const defaultBannerPng = path.join(__dirname, '..', 'public', 'og', 'banniere-class-s.png');
const defaultBannerJpg = path.join(__dirname, '..', 'public', 'og', 'banniere-class-s.jpg');

async function run() {
  if (fs.existsSync(defaultBannerPng)) {
    await sharp(defaultBannerPng)
      .resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(defaultBannerJpg);
    console.log('Generated default OG JPEG:', defaultBannerJpg);
  }

  for (const p of projects) {
    // Normalization check
    let entry = manifest[p.heroImage];
    if (!entry) {
      // try unicode normalized
      const normalizedKey = Object.keys(manifest).find(
        (k) => k.normalize('NFC') === p.heroImage.normalize('NFC') ||
               k.normalize('NFD') === p.heroImage.normalize('NFD')
      );
      if (normalizedKey) entry = manifest[normalizedKey];
    }

    let sourcePath = null;
    if (entry && entry.fallback) {
      sourcePath = path.join(__dirname, '..', 'public', entry.fallback);
    }
    if (!sourcePath || !fs.existsSync(sourcePath)) {
      console.warn('Could not find fallback image for', p.slug, p.heroImage);
      continue;
    }

    const targetPath = path.join(outDir, `${p.slug}.jpg`);
    // Create high-quality 1200x630 OG image centered on dark/onyx background
    await sharp(sourcePath)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 13, g: 10, b: 24, alpha: 1 }, // Onyx #0D0A18
      })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(targetPath);

    console.log(`Generated OG JPEG for ${p.slug} -> ${targetPath}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
