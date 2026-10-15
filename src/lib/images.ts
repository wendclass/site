import imageManifestRaw from '../data/image-manifest.json';

export interface ImageManifestEntry {
  width: number;
  height: number;
  aspectRatio: number;
  hash: string;
  variants: Record<string, string>;
  fallback: string;
}

const manifest = imageManifestRaw as Record<string, ImageManifestEntry>;

export interface OptimizedImageResult {
  src: string;
  srcSet?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

/**
 * Normalizes an image path to match the keys in image-manifest.json.
 * e.g. "/assets/projets/..." or "assets/projets/..."
 */
function normalizeKey(path: string): string {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Returns optimized image attributes (src, srcSet, width, height, aspectRatio)
 * with strict fallback to the original src if no optimized variant exists.
 */
export function getOptimizedImage(
  src: string,
  options?: { width?: 480 | 800 | 1200 | 1920 | number }
): OptimizedImageResult {
  if (!src) {
    return { src: '' };
  }

  // External URLs (Unsplash, Supabase storage remote URLs, etc.)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return { src };
  }

  const key = normalizeKey(src);
  const entry = manifest[key];

  if (!entry) {
    // Fallback: return original path untouched
    return { src };
  }

  // Choose the closest available variant for the target width
  let selectedSrc = entry.fallback;
  if (options?.width) {
    const target = options.width;
    const availableWidths = Object.keys(entry.variants)
      .map(Number)
      .sort((a, b) => a - b);

    // Pick first width >= target, or maximum available
    const bestWidth = availableWidths.find((w) => w >= target) || availableWidths[availableWidths.length - 1];
    if (bestWidth && entry.variants[String(bestWidth)]) {
      selectedSrc = entry.variants[String(bestWidth)];
    }
  }

  // Construct srcSet from all available variants
  const srcSetParts = Object.entries(entry.variants)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([w, url]) => `${url} ${w}w`);

  const srcSet = srcSetParts.length > 0 ? srcSetParts.join(', ') : undefined;

  return {
    src: selectedSrc,
    srcSet,
    width: entry.width,
    height: entry.height,
    aspectRatio: entry.aspectRatio,
  };
}

/**
 * Returns a direct optimized URL string (convenience helper for background images, og:image, etc.)
 */
export function getOptimizedImageUrl(
  src: string,
  targetWidth?: 480 | 800 | 1200 | 1920 | number
): string {
  return getOptimizedImage(src, targetWidth ? { width: targetWidth } : undefined).src;
}
