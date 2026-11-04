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
 * Normalizes legacy anchors like "#off-day" or "#72h-cj-2026" to official canonical slugs.
 */
export function mapLegacyAnchorToSlug(hash: string): string | null {
  if (!hash) return null;
  const clean = hash.replace(/^#/, '').toLowerCase().trim();
  if (!clean) return null;

  const mapping: Record<string, string> = {
    '72h-cj-2026': '72-heures-cj-2026',
    '72-heures-cj-2026': '72-heures-cj-2026',
    '72h': '72-heures-cj-2026',
    'mon-frere-parle': 'mon-frere-parle',
    'mon-frère-parle': 'mon-frere-parle',
    'off-day': 'off-day',
    'cafe-inspire': 'cafe-inspire',
    'café-inspire': 'cafe-inspire',
    'bang': 'bang',
  };

  return mapping[clean] || clean;
}
