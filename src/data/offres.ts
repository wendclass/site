/**
 * Données officielles des formules et offres d'accompagnement Class S (Scott Nana).
 * RÈGLE ABSOLUE : Aucun prix, aucun montant en FCFA, aucune valeur chiffrée nulle part.
 * Seule la Communication Événementielle porte la mention "Sur devis".
 */

export interface Formula {
  id: string;
  name: string;
  slugAnchor: string;
  idealFor: string;
  keyPoints: string[];
  deliveryTime?: string;
  badge?: string;
  highlighted?: boolean;
}

export interface ComparisonRow {
  label: string;
  tooltip?: string;
  values: Record<string, string | boolean>;
}

export interface WebsiteVariant {
  id: 'essentiel' | 'premium';
  label: string;
  idealFor: string;
  keyPoints: string[];
  deliveryTime: string;
}

export interface WebsiteFormat {
  id: string;
  slugAnchor: string;
  title: string;
  subtitle: string;
  variants: Record<'essentiel' | 'premium', WebsiteVariant>;
}

export interface OfferFamily {
  id: string;
  number: string;
  anchorId: string;
  navLabel: string;
  title: string;
  subtitle: string;
  accentColor: string;
  badge?: string;
  isCustomQuoteOnly?: boolean;
  isSingleLine?: boolean;
  isDarkBand?: boolean;
  idealFor?: string;
  deliveryTime?: string;
  formulas?: Formula[];
  comparisonHeaders?: { id: string; label: string }[];
  comparisonRows?: ComparisonRow[];
  namingOptionNote?: string;
  hostingDomainNote?: string;
  ctaText: string;
  ctaTypeParam: 'logo' | 'social' | 'event' | 'website' | 'print';
}

export interface GuideSituation {
  id: string;
  text: string;
  targetId: string;
  category: string;
}

// 7 Situations du guide d'orientation "Quelle offre pour vous ?"
export const GUIDE_SITUATIONS: GuideSituation[] = [
  {
    id: 'launch-biz',
    text: 'Je lance mon activité',
    targetId: 'formule-logo-essentiel',
    category: 'Logo : Essentiel'
  },
  {
    id: 'coherent-brand',
    text: 'Je veux une image cohérente partout',
    targetId: 'formule-logo-standard',
    category: 'Logo : Standard'
  },
  {
    id: 'investors-clients',
    text: 'Je vise des investisseurs ou de grands clients',
    targetId: 'formule-logo-signature',
    category: 'Logo : Signature'
  },
  {
    id: 'no-social-manager',
    text: 'Je n’ai personne pour animer mes réseaux',
    targetId: 'formule-social-presence',
    category: 'Réseaux : Présence Continue'
  },
  {
    id: 'sell-continuously',
    text: 'Je veux vendre en continu, pas seulement exister en ligne',
    targetId: 'formule-social-croissance',
    category: 'Réseaux : Croissance Accélérée'
  },
  {
    id: 'need-website-fast',
    text: 'Il me faut un site, vite',
    targetId: 'famille-sites-web',
    category: 'Sites Web'
  },
  {
    id: 'event-organization',
    text: 'J’organise un événement',
    targetId: 'famille-evenementiel',
    category: 'Communication Événementielle'
  }
];

// Catalogue complet des 5 forfaits d'offres
export const offerFamilies: OfferFamily[] = [
  // ---------------------------------------------------------------------------
  // 01. Logo & Identité Visuelle
  // ---------------------------------------------------------------------------
  {
    id: 'logo-identite',
    number: '01',
    anchorId: 'famille-logo',
    navLabel: '01 Logo & Identité',
    title: 'Logo & Identité Visuelle',
    subtitle: 'Chaque élément de votre identité sera construit pour qu’elle s’impose dans votre marché et ne se noie pas parmi vos concurrents.',
    accentColor: '#6600CC', // Violet Impérial
    ctaText: 'Discuter de mon identité visuelle',
    ctaTypeParam: 'logo',
    namingOptionNote: 'Option Naming disponible : recherche de nom originale, analyse d’évocation et vérification de disponibilité avant création graphique.',
    formulas: [
      {
        id: 'essentiel',
        name: 'Essentiel',
        slugAnchor: 'formule-logo-essentiel',
        idealFor: 'Idéal si vous lancez votre activité et avez besoin d’un logo solide, rapidement.',
        deliveryTime: '3 à 5 jours',
        keyPoints: [
          '1 proposition de concept originale sur mesure',
          '2 révisions incluses sur la piste retenue',
          'Fichiers finaux livrés en vectoriel (SVG/AI), PDF haute définition et PNG transparent',
          '4 mises en situation réalistes (mockups premium) pour visualiser votre marque'
        ]
      },
      {
        id: 'standard',
        name: 'Standard',
        slugAnchor: 'formule-logo-standard',
        idealFor: 'Idéal si vous voulez une image cohérente, et pouvoir créer vos propres supports ensuite.',
        deliveryTime: 'Environ 10 jours',
        badge: 'Équilibre & Autonomie',
        highlighted: true,
        keyPoints: [
          '2 propositions de concepts originaux explorés',
          'Charte graphique de base (palette chromatique, règles typographiques, marges de sécurité)',
          'Kit de lancement réseaux sociaux (bannières de couverture et avatars normalisés)',
          '10 mockups premium + 4 révisions incluses pour un rendu irréprochable'
        ]
      },
      {
        id: 'signature',
        name: 'Signature',
        slugAnchor: 'formule-logo-signature',
        idealFor: 'Idéal si vous visez des interlocuteurs exigeants : investisseurs, partenaires, grands clients.',
        deliveryTime: '2 semaines',
        badge: 'Exclusivité & Autorité',
        keyPoints: [
          '3 propositions de concepts originaux approfondis',
          'Charte graphique complète et détaillée (guide d’usage print & digital)',
          'Fichiers finaux complets + fichiers sources natifs avec cession totale et exclusive des droits',
          'Exclusivité sectorielle garantie 6 mois et dossier complet de présentation de marque'
        ]
      }
    ],
    comparisonHeaders: [
      { id: 'essentiel', label: 'Essentiel' },
      { id: 'standard', label: 'Standard' },
      { id: 'signature', label: 'Signature' }
    ],
    comparisonRows: [
      {
        label: 'Propositions de concepts originaux',
        values: { essentiel: '1 concept', standard: '2 concepts', signature: '3 concepts' }
      },
      {
        label: 'Nombre de révisions incluses',
        values: { essentiel: '2 révisions', standard: '4 révisions', signature: '6 révisions' }
      },
      {
        label: 'Charte graphique',
        values: { essentiel: false, standard: 'De base (couleurs & typos)', signature: 'Complète et détaillée' }
      },
      {
        label: 'Formats de fichiers finaux exportés',
        values: {
          essentiel: 'PNG, PDF, vectoriels',
          standard: 'Tous formats utiles print & web',
          signature: 'Tous formats + fichiers sources natifs'
        }
      },
      {
        label: 'Cession des droits d’auteur',
        values: { essentiel: false, standard: false, signature: 'Totale et exclusive' }
      },
      {
        label: 'Mises en situation réalistes (mockups premium)',
        values: { essentiel: '4 mockups', standard: '10 mockups', signature: '20 mockups' }
      },
      {
        label: 'Kit de lancement pour vos réseaux sociaux',
        values: {
          essentiel: false,
          standard: 'Inclus (bannières & avatars)',
          signature: 'Inclus + papeterie élargie (en-tête, enveloppe)'
        }
      },
      {
        label: 'Dossier de présentation de marque (investisseurs/partenaires)',
        values: { essentiel: false, standard: false, signature: 'Inclus' }
      },
      {
        label: 'Licences (typographies, iconographie, banques d’images)',
        values: { essentiel: false, standard: false, signature: 'Incluses' }
      },
      {
        label: 'Garantie d’exclusivité sectorielle',
        values: { essentiel: false, standard: false, signature: '6 mois' }
      },
      {
        label: 'Accès au modèle d’outil de devis / facturation aux couleurs de marque',
        values: { essentiel: '1 mois', standard: '2 mois', signature: '3 mois' }
      },
      {
        label: 'Sauvegarde sécurisée permanente des fichiers',
        values: { essentiel: false, standard: '6 mois', signature: '1 an' }
      },
      {
        label: 'Suivi et ajustements après livraison',
        values: { essentiel: false, standard: false, signature: '1 mois' }
      },
      {
        label: 'Délai moyen d’exécution',
        values: { essentiel: '3 à 5 jours', standard: 'Environ 10 jours', signature: '2 semaines' }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 02. Branding Social Media
  // ---------------------------------------------------------------------------
  {
    id: 'branding-social-media',
    number: '02',
    anchorId: 'famille-social',
    navLabel: '02 Réseaux sociaux',
    title: 'Branding Social Media',
    subtitle: 'Une présence visuelle continue et percutante chaque mois pour nourrir l’autorité de votre marque sans jamais connaître la panne d’idées.',
    badge: 'Abonnement mensuel',
    accentColor: '#A87FE8', // Améthyste
    ctaText: 'Mettre en place mon abonnement social media',
    ctaTypeParam: 'social',
    formulas: [
      {
        id: 'presence',
        name: 'Présence Continue',
        slugAnchor: 'formule-social-presence',
        idealFor: 'Idéal si vous avez déjà une identité, mais personne pour la faire vivre chaque semaine.',
        badge: '2 visuels / semaine',
        keyPoints: [
          '8 visuels finis par mois (rythme régulier de 2 publications par semaine)',
          'Déclinaison au format Story offerte systématiquement pour chaque publication',
          'Proposition d’accroche et légende stratégique prête à copier-coller',
          'Planning éditorial visuel validé au préalable en début de chaque mois'
        ]
      },
      {
        id: 'croissance',
        name: 'Croissance Accélérée',
        slugAnchor: 'formule-social-croissance',
        idealFor: 'Idéal si vous voulez vendre en continu, pas seulement exister en ligne.',
        badge: '4 visuels / semaine',
        highlighted: true,
        keyPoints: [
          '16 visuels finis par mois (rythme soutenu de 4 publications par semaine)',
          'Conception de carrousels pédagogiques et stratégiques pour booster l’engagement',
          'Créneau de conception hebdomadaire garanti sans temps mort',
          'Point d’échange mensuel d’optimisation stratégique de 30 minutes inclus'
        ]
      }
    ],
    comparisonHeaders: [
      { id: 'presence', label: 'Présence Continue' },
      { id: 'croissance', label: 'Croissance Accélérée' }
    ],
    comparisonRows: [
      {
        label: 'Nombre de visuels finis par mois',
        values: { presence: '8 visuels (2 / semaine)', croissance: '16 visuels (4 / semaine)' }
      },
      {
        label: 'Déclinaison au format Story offerte',
        values: { presence: true, croissance: true }
      },
      {
        label: 'Révisions incluses par visuel',
        values: { presence: '1 révision', croissance: '1 révision' }
      },
      {
        label: 'Accroche et légende suggérées avec chaque publication',
        values: { presence: true, croissance: true }
      },
      {
        label: 'Planning de contenu établi en début de mois',
        values: { presence: true, croissance: true }
      },
      {
        label: 'Formats spéciaux (carrousels pédagogiques & visuels tendance)',
        values: { presence: true, croissance: true }
      },
      {
        label: 'Garantie de retouche réactive sous 24 h',
        values: { presence: true, croissance: true }
      },
      {
        label: 'Créneau de production hebdomadaire garanti',
        values: { presence: false, croissance: true }
      },
      {
        label: 'Appel mensuel stratégique d’optimisation (30 minutes)',
        values: { presence: false, croissance: true }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 03. Communication Événementielle
  // ---------------------------------------------------------------------------
  {
    id: 'communication-evenementielle',
    number: '03',
    anchorId: 'famille-evenementiel',
    navLabel: '03 Événementiel',
    title: 'Communication Événementielle',
    subtitle: 'Chaque événement a son envergure, son public et ses contraintes propres. Votre dispositif visuel est calibré sur mesure pour marquer les esprits.',
    badge: 'Sur devis',
    accentColor: '#C9A070', // Or Champagne
    isCustomQuoteOnly: true,
    idealFor: 'Idéal si vous organisez un événement et voulez que chaque support soit cohérent.',
    ctaText: 'Demander un devis sur mesure',
    ctaTypeParam: 'event'
  },

  // ---------------------------------------------------------------------------
  // 04. Sites Web
  // ---------------------------------------------------------------------------
  {
    id: 'sites-web',
    number: '04',
    anchorId: 'famille-sites-web',
    navLabel: '04 Sites web',
    title: 'Un site complet en quelques jours, pas en plusieurs semaines.',
    subtitle: 'Un site web moderne, rapide et optimisé pour transformer vos visiteurs en prises de contact directes sur WhatsApp.',
    accentColor: '#C9A070',
    isDarkBand: true, // Seule bande sombre Onyx
    hostingDomainNote: 'Important : l’hébergement et le nom de domaine restent à la charge du client (conseils et accompagnement de choix fournis).',
    ctaText: 'Lancer la création de mon site web',
    ctaTypeParam: 'website',
    comparisonHeaders: [
      { id: 'vitrine-essentiel', label: 'Vitrine Essentiel' },
      { id: 'vitrine-premium', label: 'Vitrine Premium' },
      { id: 'multi-essentiel', label: 'Multi-pages Essentiel' },
      { id: 'multi-premium', label: 'Multi-pages Premium' }
    ],
    comparisonRows: [
      {
        label: 'Nombre de pages',
        values: {
          'vitrine-essentiel': '1 page',
          'vitrine-premium': '1 page',
          'multi-essentiel': 'Jusqu’à 5 pages',
          'multi-premium': 'Jusqu’à 8 pages + blog'
        }
      },
      {
        label: 'Contenu & structure',
        values: {
          'vitrine-essentiel': 'Sections essentielles (présentation, services, contact)',
          'vitrine-premium': 'Sections enrichies & parcours de conversion',
          'multi-essentiel': 'Formulaire de contact structuré',
          'multi-premium': 'Formulaire avancé + intégration réseaux'
        }
      },
      {
        label: 'Optimisation pour le référencement (SEO)',
        values: {
          'vitrine-essentiel': false,
          'vitrine-premium': 'De base (balises & métadonnées)',
          'multi-essentiel': 'De base (balises & structure)',
          'multi-premium': 'Renforcé (architecture sémantique & blog)'
        }
      },
      {
        label: 'Design responsive (mobile, tablette, ordinateur)',
        values: {
          'vitrine-essentiel': true,
          'vitrine-premium': true,
          'multi-essentiel': true,
          'multi-premium': true
        }
      },
      {
        label: 'Nombre de révisions incluses',
        values: {
          'vitrine-essentiel': false,
          'vitrine-premium': false,
          'multi-essentiel': '2 révisions',
          'multi-premium': '4 révisions'
        }
      },
      {
        label: 'Support & accompagnement technique après lancement',
        values: {
          'vitrine-essentiel': false,
          'vitrine-premium': false,
          'multi-essentiel': '30 jours inclus',
          'multi-premium': '60 jours inclus'
        }
      },
      {
        label: 'Délai d’exécution moyen',
        values: {
          'vitrine-essentiel': '48 heures',
          'vitrine-premium': '72 heures',
          'multi-essentiel': '5 jours',
          'multi-premium': 'Sur mesure'
        }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 05. Visuels à l’unité
  // ---------------------------------------------------------------------------
  {
    id: 'visuels-a-lunite',
    number: '05',
    anchorId: 'famille-visuels',
    navLabel: '05 Visuels',
    title: 'Visuels à l’unité & Supports imprimés',
    subtitle: 'Un besoin ponctuel et urgent ? Vos visuels unitaires ou supports imprimés conçus et livrés sous 24 heures.',
    accentColor: '#3A2F5C', // Ardoise
    isSingleLine: true,
    deliveryTime: 'Livraison garantie sous 24h',
    idealFor: 'Idéal si vous avez besoin d’un support précis, sans abonnement.',
    ctaText: 'Commander un visuel express',
    ctaTypeParam: 'print'
  }
];

// Formats interactifs pour le forfait Sites Web (avec bascule Essentiel / Premium)
export const websiteFormats: WebsiteFormat[] = [
  {
    id: 'vitrine',
    slugAnchor: 'formule-site-vitrine',
    title: 'Site Vitrine (1 page)',
    subtitle: 'Une architecture concise pensée pour valoriser votre offre en quelques secondes et pousser chaque visiteur à vous contacter sur WhatsApp.',
    variants: {
      essentiel: {
        id: 'essentiel',
        label: 'Essentiel',
        idealFor: 'Idéal si vous avez besoin d’une page claire qui présente votre activité, vite.',
        deliveryTime: '48 heures',
        keyPoints: [
          'Architecture one-page fluide (présentation, services, contact direct)',
          'Design 100% responsive et fluide sur mobile, tablette et ordinateur',
          'Intégration directe des boutons de contact WhatsApp & prise de rendez-vous',
          'Livraison rapide garantie en 48 heures'
        ]
      },
      premium: {
        id: 'premium',
        label: 'Premium',
        idealFor: 'Idéal si vous voulez une page vitrine enrichie avec conversion renforcée.',
        deliveryTime: '72 heures',
        keyPoints: [
          'Sections enrichies, animations d’interaction et design sur mesure',
          'Optimisation SEO technique de base pour le référencement local',
          'Intégration de formulaires de contact conditionnels et réseaux sociaux',
          'Livraison rapide garantie en 72 heures'
        ]
      }
    }
  },
  {
    id: 'multipages',
    slugAnchor: 'formule-site-multipages',
    title: 'Site Multi-pages',
    subtitle: 'Une plateforme complète pour détailler chaque volet de votre offre, structurer vos contenus et asseoir une autorité incontestable dans votre secteur.',
    variants: {
      essentiel: {
        id: 'essentiel',
        label: 'Essentiel',
        idealFor: 'Idéal si vous avez plusieurs services à présenter et voulez un site complet.',
        deliveryTime: '5 jours',
        keyPoints: [
          'Jusqu’à 5 pages structurées avec navigation ergonomique dédiée',
          'Formulaire de contact structuré avec routage direct des demandes',
          '2 révisions incluses + 30 jours de support technique post-lancement',
          'Livraison garantie en 5 jours'
        ]
      },
      premium: {
        id: 'premium',
        label: 'Premium',
        idealFor: 'Idéal si vous avez plusieurs services et voulez un site complet avec blog.',
        deliveryTime: 'Sur mesure',
        keyPoints: [
          'Jusqu’à 8 pages complètes + section blog éditorial intégrée',
          'Référencement SEO technique renforcé (architecture sémantique & vitesse)',
          '4 révisions incluses + 60 jours d’assistance technique et support',
          'Accompagnement post-lancement et conseils d’optimisation'
        ]
      }
    }
  }
];

// =============================================================================
// COMPATIBILITY LAYER POUR FORMULAPREVIEW & SSR
// =============================================================================
export interface OfferItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge?: string;
  isCustomQuoteOnly?: boolean;
  isSingleLine?: boolean;
  deliveryTime?: string;
  highlightPromise?: string;
  highlightDetails?: string[];
  accordionDetails?: {
    title: string;
    items: string[];
  }[];
  ctaText: string;
}

export const offersData: OfferItem[] = offerFamilies.map((fam) => {
  return {
    id: fam.id,
    number: fam.number,
    title: fam.id === 'sites-web' ? 'Sites Web' : fam.title,
    subtitle: fam.subtitle,
    badge: fam.badge,
    isCustomQuoteOnly: fam.isCustomQuoteOnly,
    isSingleLine: fam.isSingleLine,
    deliveryTime: fam.deliveryTime,
    highlightPromise: fam.formulas ? fam.formulas[0]?.idealFor : undefined,
    highlightDetails: fam.formulas ? fam.formulas[0]?.keyPoints : [],
    ctaText: fam.ctaText
  };
});
