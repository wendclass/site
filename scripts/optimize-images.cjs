const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const SOURCES_DIR = path.resolve(__dirname, '../sources-images/assets');
const PUBLIC_ASSETS_DIR = path.resolve(__dirname, '../public/assets');
const OUTPUT_DIR = path.resolve(__dirname, '../public/assets/optimized');
const MANIFEST_PATH = path.resolve(__dirname, '../src/data/image-manifest.json');

const TARGET_WIDTHS = [
  { width: 480, quality: 80, name: '480' },
  { width: 800, quality: 82, name: '800' },
  { width: 1200, quality: 82, name: '1200' },
  { width: 1920, quality: 85, name: '1920' },
];

function getFileHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 8);
}

function sanitizeSlug(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9_-]/g, '-') // replace non-alphanumeric with hyphen
    .replace(/-+/g, '-')             // collapse hyphens
    .replace(/^-|-$/g, '')           // trim hyphens
    .toLowerCase();
}

function findSourceImages(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(findSourceImages(fullPath, baseDir));
    } else {
      const ext = path.extname(item.name).toLowerCase();
      // Skip PDFs or non-image assets
      if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        const relativeFromAssets = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        // Ignore logo, game, banner
        if (
          relativeFromAssets.startsWith('optimized') ||
          relativeFromAssets.startsWith('logo') ||
          relativeFromAssets.startsWith('game') ||
          relativeFromAssets.startsWith('banner')
        ) {
          continue;
        }
        results.push({
          fullPath,
          relativeFromAssets,
          ext,
          filename: item.name,
        });
      }
    }
  }
  return results;
}

async function processImage(imageInfo, manifest) {
  const fileBuffer = fs.readFileSync(imageInfo.fullPath);
  const hash = getFileHash(fileBuffer);

  const image = sharp(fileBuffer);
  const metadata = await image.metadata();

  const origWidth = metadata.width || 1200;
  const origHeight = metadata.height || 800;
  const aspectRatio = Number((origWidth / origHeight).toFixed(4));

  // Determine subfolder under optimized/ (e.g. projets/bang or about)
  const dirName = path.dirname(imageInfo.relativeFromAssets);
  const baseName = path.basename(imageInfo.filename, imageInfo.ext);
  const cleanBaseName = sanitizeSlug(baseName);

  const targetSubDir = path.join(OUTPUT_DIR, dirName);
  if (!fs.existsSync(targetSubDir)) {
    fs.mkdirSync(targetSubDir, { recursive: true });
  }

  // Original path as used in code (e.g. /assets/projets/bang/SUBWAY LED BILLBOARD bang.png)
  const codeKey = `/assets/${imageInfo.relativeFromAssets}`;

  const entry = {
    width: origWidth,
    height: origHeight,
    aspectRatio,
    hash,
    variants: {},
    fallback: '',
  };

  for (const tw of TARGET_WIDTHS) {
    // Only generate variant if original is reasonably close or larger
    if (tw.width > origWidth && tw.width !== 480 && tw.width !== 800) {
      continue;
    }

    const targetWidth = Math.min(tw.width, origWidth);
    const outFileName = `${cleanBaseName}-${tw.name}.${hash}.webp`;
    const outFilePath = path.join(targetSubDir, outFileName);
    const publicUrl = `/assets/optimized/${dirName.replace(/\\/g, '/')}/${outFileName}`.replace(/\/+/g, '/');

    // Idempotent: check if exists
    if (!fs.existsSync(outFilePath)) {
      await sharp(fileBuffer)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: tw.quality, effort: 4 })
        .toFile(outFilePath);
    }

    entry.variants[tw.name] = publicUrl;
  }

  // Set fallback variant (preference: 1200 > 800 > 1920 > 480)
  entry.fallback =
    entry.variants['1200'] ||
    entry.variants['800'] ||
    entry.variants['1920'] ||
    entry.variants['480'] ||
    codeKey;

  manifest[codeKey] = entry;
}

function ingestPublicAssets() {
  if (!fs.existsSync(PUBLIC_ASSETS_DIR)) return;
  const rawList = findSourceImages(PUBLIC_ASSETS_DIR);
  let ingested = 0;
  for (const item of rawList) {
    const targetSourcePath = path.join(SOURCES_DIR, item.relativeFromAssets);
    const targetSourceDir = path.dirname(targetSourcePath);
    if (!fs.existsSync(targetSourceDir)) {
      fs.mkdirSync(targetSourceDir, { recursive: true });
    }
    fs.copyFileSync(item.fullPath, targetSourcePath);
    fs.unlinkSync(item.fullPath);
    ingested++;
    console.log(`[Ingest] Fichier brut déplacé vers sources-images/ : ${item.relativeFromAssets}`);
  }
  if (ingested > 0) {
    console.log(`[Ingest] ${ingested} image(s) ingérée(s) depuis public/assets vers sources-images/.`);
  }
}

async function main() {
  console.log('=== CLASS S — OPTIMISATION DES IMAGES EN WEBP ===\n');

  if (!fs.existsSync(SOURCES_DIR)) {
    console.error('Dossier sources-images/ introuvable à:', SOURCES_DIR);
    process.exit(1);
  }

  // If Scott drops any new images in public/assets, move them to sources-images first
  ingestPublicAssets();

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const manifestDir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }

  // Load existing manifest if present for incremental merge
  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch {}
  }

  const images = findSourceImages(SOURCES_DIR);
  console.log(`Images sources trouvées dans sources-images/: ${images.length}`);

  let processedCount = 0;
  const startTime = Date.now();

  for (const img of images) {
    await processImage(img, manifest);
    processedCount++;
    if (processedCount % 10 === 0 || processedCount === images.length) {
      console.log(`[${processedCount}/${images.length}] images traitées...`);
    }
  }

  // Clean up any non-project entries from manifest (like game or banner)
  for (const key of Object.keys(manifest)) {
    if (key.startsWith('/assets/game') || key.startsWith('/assets/banner') || key.startsWith('/assets/logo/og-image')) {
      delete manifest[key];
    }
  }

  // Write updated manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nManifeste enregistré dans: ${MANIFEST_PATH}`);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Traitement terminé en ${duration}s.`);
}

main().catch(err => {
  console.error('Erreur lors du traitement:', err);
  process.exit(1);
});
