export interface RubriqueConfig {
  slug: string;
  name: string;
  description: string;
  order: number;
}

export const RUBRIQUES: RubriqueConfig[] = [
  {
    slug: 'identite-visuelle',
    name: 'Identité visuelle',
    description: 'Logos, univers graphiques et signatures visuelles de marque.',
    order: 1,
  },
  {
    slug: 'strategie-de-marque',
    name: 'Stratégie de marque',
    description: 'Positionnement, cohérence de marque et architecture d’image.',
    order: 2,
  },
  {
    slug: 'reseaux-sociaux',
    name: 'Réseaux sociaux',
    description: 'Visuels d’impact pour Facebook, Instagram, LinkedIn et engagement.',
    order: 3,
  },
  {
    slug: 'design-graphique',
    name: 'Design graphique',
    description: 'Principes de composition, typographie, affiches et supports.',
    order: 4,
  },
  {
    slug: 'business-conversion',
    name: 'Business & conversion',
    description: 'Impact commercial, tarification premium et transformation de prospects.',
    order: 5,
  },
];

export const getRubriqueBySlug = (slug?: string): RubriqueConfig | undefined => {
  if (!slug) return undefined;
  return RUBRIQUES.find((r) => r.slug === slug);
};

export const getRubriqueName = (slug?: string): string => {
  if (!slug) return '';
  const found = getRubriqueBySlug(slug);
  return found ? found.name : slug;
};

/**
 * Mapping des étiquettes historiques vers les rubriques maîtrisées.
 * Utilisé pour la rétro-compatibilité automatique des articles sans rubrique explicite.
 */
export const TAG_TO_RUBRIQUE_MAP: Record<string, string> = {
  // 1. Identité visuelle
  'identite visuelle': 'identite-visuelle',
  'identité visuelle': 'identite-visuelle',
  'charte graphique': 'identite-visuelle',
  'logo': 'identite-visuelle',
  'logotype': 'identite-visuelle',
  
  // 2. Stratégie de marque
  'strategie de marque': 'strategie-de-marque',
  'stratégie de marque': 'strategie-de-marque',
  'branding': 'strategie-de-marque',
  'brand': 'strategie-de-marque',
  'image de marque': 'strategie-de-marque',
  'cohérence visuelle': 'strategie-de-marque',
  'coherence visuelle': 'strategie-de-marque',
  'branding premium': 'strategie-de-marque',

  // 3. Réseaux sociaux
  'reseaux sociaux': 'reseaux-sociaux',
  'réseaux sociaux': 'reseaux-sociaux',
  'facebook': 'reseaux-sociaux',
  'instagram': 'reseaux-sociaux',
  'linkedin': 'reseaux-sociaux',
  'visibilite': 'reseaux-sociaux',
  'visibilité': 'reseaux-sociaux',

  // 4. Design graphique
  'design graphique': 'design-graphique',
  'typographie': 'design-graphique',
  'graphisme': 'design-graphique',
  'affiche': 'design-graphique',

  // 5. Business & conversion
  'business': 'business-conversion',
  'conversion': 'business-conversion',
  'tarifs': 'business-conversion',
  'startup': 'business-conversion',
  'entrepreneur': 'business-conversion',
};

/**
 * Détermine la meilleure rubrique à partir des étiquettes d'un article.
 */
export const inferRubriqueFromTags = (tags?: string[]): string => {
  if (!tags || tags.length === 0) return 'identite-visuelle';
  for (const tag of tags) {
    const normalized = tag
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (TAG_TO_RUBRIQUE_MAP[normalized]) {
      return TAG_TO_RUBRIQUE_MAP[normalized];
    }
  }
  return 'identite-visuelle';
};
