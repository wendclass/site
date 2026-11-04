import { Project } from '../data/projets';
import { DbProject } from './supabase';

/**
 * Truncates text cleanly without cutting words in half, max length ~110 chars.
 */
export function getProjectAccroche(
  p: Partial<Project> | Partial<DbProject>
): string {
  if (p.accroche && p.accroche.trim()) {
    return p.accroche.trim();
  }
  if (p.tagline && p.tagline.trim().length <= 110) {
    return p.tagline.trim();
  }
  const raw =
    (p as any).clientGoal ||
    (p as any).client_goal ||
    p.tagline ||
    '';
  const clean = raw.trim();
  if (!clean) return '';
  if (clean.length <= 110) return clean;

  const slice = clean.substring(0, 107);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 40 ? slice.substring(0, lastSpace) : slice) + '...';
}

/**
 * Normalizes any project id, slug or legacy slug to the official canonical slug.
 */
export function normalizeProjectSlug(idOrSlug: string): string {
  if (!idOrSlug) return '';
  const clean = idOrSlug.toLowerCase().trim();
  if (clean === '72h-cj-2026' || clean.includes('72h') || clean.includes('72-heures') || clean.includes('72')) {
    return '72-heures-cj-2026';
  }
  if (clean.includes('frere') || clean.includes('frère')) {
    return 'mon-frere-parle';
  }
  if (clean.includes('off') || clean.includes('day')) {
    return 'off-day';
  }
  if (clean.includes('cafe') || clean.includes('café') || clean.includes('inspire')) {
    return 'cafe-inspire';
  }
  if (clean.includes('bang')) {
    return 'bang';
  }
  return clean;
}

/**
 * Normalizes legacy anchors like "#off-day" or "#72h-cj-2026" to official canonical slugs.
 */
export function mapLegacyAnchorToSlug(hash: string): string | null {
  if (!hash) return null;
  const clean = hash.replace(/^#/, '').toLowerCase().trim();
  if (!clean) return null;

  return normalizeProjectSlug(clean);
}
