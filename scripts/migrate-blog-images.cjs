/**
 * Migration Script: Blog Articles Image Inventory & WebP Conversion
 * 
 * Inspects all existing articles in Supabase (and local store fallback),
 * detects images that are not yet in WebP, and provides conversion details.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mtinydrkpxffrlsuwpzh.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aW55ZHJrcHhmZnJsc3V3cHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMTg2MDIsImV4cCI6MjEwNjc5NDYwMn0.e0vzwBnIbuSXxeQ-yOPzhnoilPAjhwx02DpIJiWEwNQ';

async function fetchRemoteArticles() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/articles?select=*`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Could not fetch remote articles:', err.message);
  }
  return [];
}

async function runInventory() {
  console.log('================================================================');
  console.log('   INVENTAIRE DES IMAGES D\'ARTICLES DU BLOG — CLASS S');
  console.log('================================================================\n');

  const articles = await fetchRemoteArticles();
  console.log(`Nombre d'articles trouvés dans Supabase : ${articles.length}`);

  if (articles.length === 0) {
    console.log('Aucun article n\'est actuellement enregistré dans la table distante Supabase.');
    console.log('Les articles par défaut du site proviennent du fallback local et utilisent des visuels externes.');
  }

  const inventory = [];

  for (const art of articles) {
    const artImages = [];

    // Check cover image
    if (art.cover_image) {
      const isWebp = art.cover_image.toLowerCase().includes('.webp') || art.cover_image.includes('format=webp');
      artImages.push({
        type: 'cover',
        url: art.cover_image,
        isWebp,
        alt: art.cover_image_alt || '(alt manquant)',
        hasOgJpeg: !!art.cover_image_og_jpeg,
      });
    }

    // Check body content images
    if (art.content) {
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      let match;
      while ((match = imgRegex.exec(art.content)) !== null) {
        const fullTag = match[0];
        const src = match[1];
        const isWebp = src.toLowerCase().includes('.webp') || src.includes('format=webp');
        const altMatch = fullTag.match(/alt=["']([^"']*)["']/i);
        const alt = altMatch ? altMatch[1] : '(alt manquant)';
        artImages.push({
          type: 'body',
          url: src,
          isWebp,
          alt,
        });
      }
    }

    inventory.push({
      id: art.id,
      title: art.title,
      slug: art.slug,
      images: artImages,
    });
  }

  // Summary
  let totalImages = 0;
  let webpImages = 0;
  let nonWebpImages = 0;

  for (const item of inventory) {
    totalImages += item.images.length;
    for (const img of item.images) {
      if (img.isWebp) webpImages++;
      else nonWebpImages++;
    }
  }

  console.log('\n--- RAPPORT D\'INVENTAIRE ---');
  console.log(`Total images inventoriées : ${totalImages}`);
  console.log(`Images conformes WebP    : ${webpImages}`);
  console.log(`Images à migrer en WebP  : ${nonWebpImages}`);

  // Save report artifact
  const reportPath = path.join(__dirname, '../public/inventory-blog-images.json');
  fs.writeFileSync(reportPath, JSON.stringify({ timestamp: new Date().toISOString(), totalImages, webpImages, nonWebpImages, articles: inventory }, null, 2));
  console.log(`\nRapport sauvegardé dans : ${reportPath}`);
}

runInventory().catch(console.error);
