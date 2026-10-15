const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const manifest = require('../src/data/image-manifest.json');

const ARTIFACT_DIR = 'C:/Users/HP/.gemini/antigravity/brain/9f8ca042-01f6-4b1d-88cf-3383448cc363';

const TOP_5 = [
  {
    name: 'SUBWAY LED BILLBOARD bang',
    path: '/assets/projets/bang/SUBWAY LED BILLBOARD bang.png',
    // 4000x3000 -> crop center where Bang logo and text are
    crop: { left: 1600, top: 1100, width: 800, height: 600 }
  },
  {
    name: 'MFP_OutdoorPosterMockup004',
    path: '/assets/projets/mon-frere-parle/MFP_OutdoorPosterMockup004.png',
    // 4608x3072 -> crop poster typography
    crop: { left: 1800, top: 1000, width: 800, height: 600 }
  },
  {
    name: 'sky billboard bang',
    path: '/assets/projets/bang/sky billboard bang.png',
    // 4000x2667 -> crop billboard logo & slogan
    crop: { left: 1600, top: 900, width: 800, height: 600 }
  },
  {
    name: 'Cover Rapport d\'Activités 72H 2026',
    path: '/assets/projets/72h-cj-2026/Cover Rapport d\'Activités 72H 2026.png',
    // 2480x3508 -> crop header title & dates
    crop: { left: 800, top: 1200, width: 800, height: 600 }
  },
  {
    name: 'Polo Shirt on Mannequin bang',
    path: '/assets/projets/bang/Polo Shirt on Mannequin bang koko donda sans col.png',
    // 4500x3000 -> crop embroidered chest logo
    crop: { left: 1900, top: 1200, width: 800, height: 600 }
  }
];

async function generateCrops() {
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  for (let i = 0; i < TOP_5.length; i++) {
    const item = TOP_5[i];
    const origFullPath = path.resolve(__dirname, '../sources-images' + item.path);
    const entry = manifest[item.path];
    if (!entry) {
      console.warn('Manifest entry missing for:', item.path);
      continue;
    }

    const webpFullPath = path.resolve(__dirname, '../public' + entry.variants['1920']);

    // Original crop
    const origMeta = await sharp(origFullPath).metadata();
    const origCrop = {
      left: Math.min(item.crop.left, origMeta.width - item.crop.width),
      top: Math.min(item.crop.top, origMeta.height - item.crop.height),
      width: item.crop.width,
      height: item.crop.height
    };

    const origBuffer = await sharp(origFullPath)
      .extract(origCrop)
      .resize(400, 300)
      .png()
      .toBuffer();

    // Scale crop coordinates for 1920w variant
    const webpMeta = await sharp(webpFullPath).metadata();
    const scale = webpMeta.width / origMeta.width;
    const webpCrop = {
      left: Math.round(origCrop.left * scale),
      top: Math.round(origCrop.top * scale),
      width: Math.min(Math.round(origCrop.width * scale), webpMeta.width),
      height: Math.min(Math.round(origCrop.height * scale), webpMeta.height)
    };
    // Ensure bounds
    if (webpCrop.left + webpCrop.width > webpMeta.width) {
      webpCrop.left = webpMeta.width - webpCrop.width;
    }
    if (webpCrop.top + webpCrop.height > webpMeta.height) {
      webpCrop.top = webpMeta.height - webpCrop.height;
    }

    const webpBuffer = await sharp(webpFullPath)
      .extract(webpCrop)
      .resize(400, 300)
      .png()
      .toBuffer();

    // Compose side-by-side image: [ Original (400x300) | WebP (400x300) ] = 800x330 (with labels)
    const compositeSvg = `
      <svg width="800" height="340" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="340" fill="#0D0A18"/>
        <text x="200" y="25" fill="#C9A070" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">ORIGINAL (PNG)</text>
        <text x="600" y="25" fill="#A87FE8" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">OPTIMISÉ (WebP 1920w)</text>
      </svg>
    `;

    const outFilename = `crop_comparison_${i + 1}.png`;
    const outPath = path.join(ARTIFACT_DIR, outFilename);

    await sharp(Buffer.from(compositeSvg))
      .composite([
        { input: origBuffer, left: 0, top: 35 },
        { input: webpBuffer, left: 400, top: 35 }
      ])
      .png()
      .toFile(outPath);

    console.log(`Generated crop comparison ${i + 1} -> ${outFilename}`);
  }
}

generateCrops().catch(console.error);
