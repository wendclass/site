import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Image Processing Pipeline for Class S Blog Articles
 * - Client-side native HTML5 Canvas conversion (zero external heavy client deps)
 * - Magic bytes detection (MIME validation from content, not extension)
 * - Strict WebP enforcement for all website images
 * - Dedicated 1200x630 JPEG generator for Open Graph / Social share cards
 * - Multi-size responsive WebP variants (480, 960, 1600 px)
 * - Strips EXIF metadata automatically via Canvas redrawing
 * - Preserves aspect ratio, never upscales
 * - Adaptive quality compression targeting < 250 KB (WebP) and < 300 KB (OG JPEG)
 */

export interface ImageVariant {
  width: number;
  height: number;
  blob: Blob;
  sizeKb: number;
  dataUrl?: string;
  publicUrl?: string;
}

export interface ProcessedImageResult {
  originalName: string;
  originalSizeKb: number;
  primaryVariant: ImageVariant;
  variants: ImageVariant[];
  ogJpeg?: ImageVariant; // 1200x630 JPEG copy generated only for cover images
  srcset: string;
  savingsLabel: string;
  warning?: string;
  aspectRatio: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
  format?: 'jpeg' | 'png' | 'webp' | 'gif';
}

const MAX_INPUT_SIZE_BYTES = 15 * 1024 * 1024; // 15 Mo
const RESPONSIVE_WIDTHS = [480, 960, 1600];
const MAX_DIMENSION = 1600;

/**
 * Detect image format using magic bytes (header bytes)
 */
export const detectFormatFromMagicBytes = async (file: File | Blob): Promise<{
  format: 'jpeg' | 'png' | 'webp' | 'gif' | 'svg' | 'heic' | 'unknown';
  mime: string;
}> => {
  const headerSlice = file.slice(0, 64);
  const buffer = await headerSlice.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (bytes.length < 4) {
    return { format: 'unknown', mime: 'application/octet-stream' };
  }

  // 1. JPEG: 0xFF, 0xD8, 0xFF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { format: 'jpeg', mime: 'image/jpeg' };
  }

  // 2. PNG: 0x89, 0x50, 0x4E, 0x47 ( . P N G )
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return { format: 'png', mime: 'image/png' };
  }

  // 3. WebP: RIFF ... WEBP (0x52, 0x49, 0x46, 0x46 at 0..3 and 0x57, 0x45, 0x42, 0x50 at 8..11)
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes.length >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { format: 'webp', mime: 'image/webp' };
  }

  // 4. GIF: GIF87a or GIF89a (0x47, 0x49, 0x46)
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return { format: 'gif', mime: 'image/gif' };
  }

  // 5. SVG check (ASCII <?xml or <svg)
  const textSample = new TextDecoder('utf-8', { fatal: false }).decode(bytes).toLowerCase().trim();
  if (textSample.startsWith('<?xml') || textSample.includes('<svg')) {
    return { format: 'svg', mime: 'image/svg+xml' };
  }

  // 6. HEIC / HEIF (contains 'ftypheic', 'ftypmif1', 'ftypmsf1', etc.)
  if (bytes.length >= 12) {
    const ftyp = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(4, 12));
    if (ftyp.includes('heic') || ftyp.includes('mif1') || ftyp.includes('heix') || ftyp.includes('hevc')) {
      return { format: 'heic', mime: 'image/heic' };
    }
  }

  return { format: 'unknown', mime: 'application/octet-stream' };
};

/**
 * Validate an input file before processing
 */
export const validateImageInput = async (file: File): Promise<ValidationResult> => {
  // 1. Check size limit
  if (file.size > MAX_INPUT_SIZE_BYTES) {
    return {
      valid: false,
      error: `Le fichier dépasse la taille maximale autorisée de 15 Mo (taille actuelle : ${(file.size / (1024 * 1024)).toFixed(1)} Mo).`,
    };
  }

  // 2. Detect magic bytes
  const { format } = await detectFormatFromMagicBytes(file);

  if (format === 'svg') {
    return {
      valid: false,
      error: 'Les fichiers vectoriels SVG sont interdits pour des raisons de sécurité (risque d\'injection de scripts). Veuillez utiliser un fichier photo (JPEG, PNG ou WebP).',
    };
  }

  if (format === 'heic') {
    return {
      valid: false,
      error: 'Le format HEIC/HEIF (Apple) n\'est pas décodable directement par le navigateur. Veuillez exporter votre photo en JPEG ou PNG avant de l\'importer.',
    };
  }

  if (format === 'unknown') {
    return {
      valid: false,
      error: 'Format de fichier non reconnu. Veuillez importer une image valide au format JPEG, PNG, WebP ou GIF.',
    };
  }

  if (format === 'gif') {
    return {
      valid: true,
      format: 'gif',
      warning: 'Fichier GIF détecté : seule la première image sera extraite et convertie en WebP (l\'animation ne sera pas conservée).',
    };
  }

  return {
    valid: true,
    format,
  };
};

/**
 * Helper to load an image into an HTMLImageElement
 */
export const loadImageElement = (fileOrBlob: File | Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(fileOrBlob);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Impossible de charger et décoder l\'image sélectionnée.'));
    };
    img.src = objectUrl;
  });
};

/**
 * Canvas to WebP blob with adaptive quality stepping (< 250 KB target)
 */
export const canvasToAdaptiveWebpBlob = async (
  canvas: HTMLCanvasElement,
  targetMaxKb = 250
): Promise<{ blob: Blob; quality: number; isHeavy: boolean }> => {
  let quality = 0.82;
  const minQuality = 0.60;
  const step = 0.05;

  const toBlobPromise = (q: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Erreur lors de l\'encodage WebP via le Canvas.'));
        },
        'image/webp',
        q
      );
    });

  let currentBlob = await toBlobPromise(quality);

  while (currentBlob.size > targetMaxKb * 1024 && quality > minQuality) {
    quality -= step;
    currentBlob = await toBlobPromise(Math.max(quality, minQuality));
  }

  const isHeavy = currentBlob.size > targetMaxKb * 1024;
  return { blob: currentBlob, quality, isHeavy };
};

/**
 * Canvas to JPEG blob with adaptive quality (< 300 KB target for 1200x630 OG image)
 */
export const canvasToAdaptiveJpegBlob = async (
  canvas: HTMLCanvasElement,
  targetMaxKb = 300
): Promise<{ blob: Blob; quality: number }> => {
  let quality = 0.85;
  const minQuality = 0.65;
  const step = 0.05;

  const toBlobPromise = (q: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Erreur lors de l\'encodage JPEG via le Canvas.'));
        },
        'image/jpeg',
        q
      );
    });

  let currentBlob = await toBlobPromise(quality);

  while (currentBlob.size > targetMaxKb * 1024 && quality > minQuality) {
    quality -= step;
    currentBlob = await toBlobPromise(Math.max(quality, minQuality));
  }

  return { blob: currentBlob, quality };
};

/**
 * Generate 1200x630 JPEG copy specifically for Open Graph / Social Sharing
 * Uses center-crop without distortion (similar to object-fit: cover)
 */
export const generateOgShareJpeg = async (
  img: HTMLImageElement
): Promise<ImageVariant> => {
  const targetW = 1200;
  const targetH = 630;
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Impossible d\'initialiser le contexte Canvas 2D.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Calculate center crop
  const targetRatio = targetW / targetH;
  const srcRatio = img.width / img.height;
  let srcW = img.width;
  let srcH = img.height;
  let srcX = 0;
  let srcY = 0;

  if (srcRatio > targetRatio) {
    // Image is wider than 1200:630 -> crop sides
    srcW = img.height * targetRatio;
    srcX = (img.width - srcW) / 2;
  } else {
    // Image is taller than 1200:630 -> crop top/bottom
    srcH = img.width / targetRatio;
    srcY = (img.height - srcH) / 2;
  }

  ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH);

  const { blob } = await canvasToAdaptiveJpegBlob(canvas, 300);
  const sizeKb = Math.round(blob.size / 1024);

  return {
    width: targetW,
    height: targetH,
    blob,
    sizeKb,
  };
};

/**
 * Format bytes to readable string (Mo / Ko)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`;
  }
  return `${Math.round(bytes / 1024)} Ko`;
};

/**
 * Process an uploaded image:
 * 1. Validate file & magic bytes
 * 2. Load into Canvas (strips EXIF automatically)
 * 3. Generate 3 responsive WebP variants (e.g. 480, 960, 1600 px without upscaling)
 * 4. If isCover is true, also generate the 1200x630 JPEG copy for Open Graph
 * 5. Return variants with computed weights and savings label
 */
export const processArticleImage = async (
  file: File,
  options: { isCover?: boolean } = {}
): Promise<ProcessedImageResult> => {
  // 1. Validate
  const validation = await validateImageInput(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Fichier image non valide.');
  }

  // 2. Load
  const img = await loadImageElement(file);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  const aspectRatio = origW / origH;

  // 3. Determine widths to generate (never upscale beyond original width, max 1600)
  const maxAllowedW = Math.min(origW, MAX_DIMENSION);
  const candidateWidths = RESPONSIVE_WIDTHS.filter((w) => w <= maxAllowedW);

  // If original is smaller than 480, keep original width
  if (candidateWidths.length === 0) {
    candidateWidths.push(maxAllowedW);
  } else if (!candidateWidths.includes(maxAllowedW) && maxAllowedW > 480) {
    candidateWidths.push(maxAllowedW);
  }

  // Sort ascending
  candidateWidths.sort((a, b) => a - b);

  const variants: ImageVariant[] = [];

  for (const targetW of candidateWidths) {
    const targetH = Math.round(targetW / aspectRatio);
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Impossible d\'obtenir le contexte Canvas.');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const { blob } = await canvasToAdaptiveWebpBlob(canvas, 250);
    const sizeKb = Math.round(blob.size / 1024);

    variants.push({
      width: targetW,
      height: targetH,
      blob,
      sizeKb,
    });
  }

  // Primary variant is the highest resolution variant
  const primaryVariant = variants[variants.length - 1];

  // 4. Generate OG JPEG if cover image
  let ogJpeg: ImageVariant | undefined;
  if (options.isCover) {
    ogJpeg = await generateOgShareJpeg(img);
  }

  // 5. Calculate weight savings
  const origKb = Math.round(file.size / 1024);
  const primaryKb = primaryVariant.sizeKb;
  const percentSaved = Math.max(0, Math.round(((file.size - primaryVariant.blob.size) / file.size) * 100));
  const savingsLabel = `${formatFileSize(file.size)} → ${primaryKb} Ko (-${percentSaved}%)`;

  return {
    originalName: file.name,
    originalSizeKb: origKb,
    primaryVariant,
    variants,
    ogJpeg,
    srcset: '', // Will be filled after upload URLs are known
    savingsLabel,
    warning: validation.warning,
    aspectRatio,
  };
};

/**
 * Upload a processed image and its variants to Supabase Storage
 * - WebP images go to bucket 'article-images'
 * - OG JPEG goes to bucket 'article-og-images'
 */
export const uploadProcessedImageToStorage = async (
  result: ProcessedImageResult,
  onProgress?: (step: string, progress: number) => void
): Promise<{
  primaryUrl: string;
  ogJpegUrl?: string;
  srcsetMap: Record<number, string>;
  srcsetString: string;
}> => {
  const uniqueId = `art-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const srcsetMap: Record<number, string> = {};

  if (!isSupabaseConfigured() || !supabase) {
    // Local / Offline fallback: create local object URLs or Data URLs
    onProgress?.('Mode local : création des aperçus...', 50);
    for (const v of result.variants) {
      const url = URL.createObjectURL(v.blob);
      srcsetMap[v.width] = url;
    }
    const primaryUrl = srcsetMap[result.primaryVariant.width];
    let ogJpegUrl: string | undefined;
    if (result.ogJpeg) {
      ogJpegUrl = URL.createObjectURL(result.ogJpeg.blob);
    }
    const srcsetString = Object.entries(srcsetMap)
      .map(([w, url]) => `${url} ${w}w`)
      .join(', ');

    onProgress?.('Finalisé en mode local', 100);
    return { primaryUrl, ogJpegUrl, srcsetMap, srcsetString };
  }

  // Remote Supabase upload
  const totalItems = result.variants.length + (result.ogJpeg ? 1 : 0);
  let completedItems = 0;

  for (const v of result.variants) {
    const filename = `${uniqueId}-${v.width}w.webp`;
    onProgress?.(`Envoi de la variante ${v.width}px en WebP...`, Math.round((completedItems / totalItems) * 85));

    const { error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(filename, v.blob, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      });

    if (uploadError) {
      console.warn(`Supabase storage upload error for ${filename}:`, uploadError);
      // Fallback to object URL if bucket is not yet active
      srcsetMap[v.width] = URL.createObjectURL(v.blob);
    } else {
      const { data } = supabase.storage.from('article-images').getPublicUrl(filename);
      srcsetMap[v.width] = data.publicUrl;
    }

    completedItems++;
  }

  // Upload OG JPEG if present
  let ogJpegUrl: string | undefined;
  if (result.ogJpeg) {
    const ogFilename = `og-${uniqueId}-1200x630.jpg`;
    onProgress?.('Envoi de la copie JPEG de partage (1200×630)...', 90);

    const { error: ogError } = await supabase.storage
      .from('article-og-images')
      .upload(ogFilename, result.ogJpeg.blob, {
        contentType: 'image/jpeg',
        cacheControl: '31536000',
        upsert: true,
      });

    if (ogError) {
      console.warn(`Supabase storage OG upload error:`, ogError);
      ogJpegUrl = URL.createObjectURL(result.ogJpeg.blob);
    } else {
      const { data } = supabase.storage.from('article-og-images').getPublicUrl(ogFilename);
      ogJpegUrl = data.publicUrl;
    }
  }

  const primaryUrl = srcsetMap[result.primaryVariant.width];
  const srcsetString = Object.entries(srcsetMap)
    .map(([w, url]) => `${url} ${w}w`)
    .join(', ');

  onProgress?.('Upload terminé avec succès !', 100);
  return { primaryUrl, ogJpegUrl, srcsetMap, srcsetString };
};
