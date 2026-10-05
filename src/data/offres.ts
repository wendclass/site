export interface OfferItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge?: string;
  isCustomQuoteOnly?: boolean; // Pour Communication Événementielle
  isSingleLine?: boolean; // Pour Visuels à l'unité
  highlightPromise?: string;
  highlightDetails: string[];
  accordionDetails?: {
    title: string;
    items: string[];
  }[];
  ctaText: string;
  deliveryTime?: string;
}

export const offersData: OfferItem[] = [
  {
    id: 'logo-identite',
    number: '01',
    title: 'Logo & Identité Visuelle',
    subtitle: 'Chaque élément de votre identité sera construit pour qu’elle s’impose dans votre marché et ne se noie pas parmi vos concurrents.',
    highlightPromise: '3 niveaux adaptés à votre stade de développement (Essentiel, Standard, Signature) pour poser des fondations inébranlables.',
    highlightDetails: [
      'Recherche de logo sur mesure, avec plusieurs propositions de concepts originaux selon le niveau choisi.',
      'Charte graphique complète et fichiers finaux exportés dans tous les formats utiles à votre usage quotidien (print & digital).',
      'Accompagnement et garanties : révisions incluses, garantie de satisfaction, jusqu’à l’exclusivité sectorielle pour le niveau Signature.'
    ],
    accordionDetails: [
      {
        title: 'Livrables & Déclinaisons complémentaires',
        items: [
          'Mises en situation réalistes (mockups premium) pour visualiser la marque en conditions réelles',
          'Kit de lancement pour vos profils de réseaux sociaux (bannières, avatars normalisés)',
          'Sauvegarde sécurisée permanente de vos fichiers sources originaux',
          'Dossier complet de présentation et d’argumentation de marque',
          'Accès à un modèle d’outil de devis / facturation aux couleurs de votre identité',
          'Délais d’exécution clairs et engagements de livraison respectés'
        ]
      }
    ],
    ctaText: 'Discuter de mon identité visuelle'
  },
  {
    id: 'branding-social-media',
    number: '02',
    title: 'Branding Social Media',
    subtitle: 'Une présence visuelle continue et percutante chaque mois pour nourrir l’autorité de votre marque sans jamais connaître la panne d’idées.',
    badge: 'Abonnement mensuel',
    highlightPromise: '2 formules d’accompagnement continu (Présence Continue, Croissance Accélérée) pensées comme un moteur de conversion régulier.',
    highlightDetails: [
      'Un rythme de publication régulier et un planning éditorial visuel établi au préalable en début de chaque mois.',
      'Des visuels finis, harmonisés avec votre charte, accompagnés d’une proposition d’accroche prête à publier.',
      'Un accompagnement stratégique dédié : créneau garanti et point d’échange mensuel d’optimisation pour la formule la plus complète.'
    ],
    accordionDetails: [
      {
        title: 'Avantages inclus dans l’abonnement',
        items: [
          'Déclinaison au format Story offerte pour chaque publication pour maximiser la portée',
          'Conception de carrousels pédagogiques et stratégiques pour booster l’engagement',
          'Révisions incluses sur chaque livraison de visuels',
          'Garantie de réactivité et de retouche rapide en cas d’ajustement imprévu'
        ]
      }
    ],
    ctaText: 'Mettre en place mon abonnement social media'
  },
  {
    id: 'sites-web',
    number: '03',
    title: 'Sites Web',
    subtitle: 'Un site web moderne, rapide et optimisé pour transformer vos visiteurs en prises de contact directes sur WhatsApp.',
    highlightPromise: '2 formats sur mesure (Vitrine une page ou Multi-pages) avec un atout décisif : livré en quelques jours.',
    highlightDetails: [
      'Un site livré en quelques jours, pas en plusieurs semaines : commencez à convertir sans délai.',
      'Une structure ergonomique fluide pensée pour valoriser votre offre et pousser chaque visiteur à l’action.',
      'Un accompagnement post-lancement : période de support et d’ajustements techniques incluse après la mise en ligne.'
    ],
    accordionDetails: [
      {
        title: 'Spécifications techniques & Inclusions',
        items: [
          'Architecture one-page ou multi-pages selon la complexité de votre catalogue d’offres',
          'Optimisation SEO technique de base pour le référencement local (Ouagadougou & sous-région)',
          'Design 100% responsive et fluide sur mobile, tablette et écran desktop',
          'Intégration directe des canaux de contact direct (WhatsApp, formulaires conditionnels)',
          'Important : l’hébergement et le nom de domaine restent à la charge du client (conseils de choix fournis).'
        ]
      }
    ],
    ctaText: 'Lancer la création de mon site web'
  },
  {
    id: 'communication-evenementielle',
    number: '04',
    title: 'Communication Événementielle',
    subtitle: 'Chaque événement a son envergure, son public et ses contraintes propres. Votre dispositif visuel est calibré sur mesure pour marquer les esprits.',
    isCustomQuoteOnly: true,
    highlightPromise: 'Dispositif complet personnalisé : affichage grand format, roll-ups, tickets, badges, dossiers de partenariat et campagne digitale.',
    highlightDetails: [],
    ctaText: 'Demander un devis sur mesure'
  },
  {
    id: 'visuels-a-lunite',
    number: '05',
    title: 'Visuels à l’unité & Supports imprimés',
    subtitle: 'Un besoin ponctuel et urgent ? Vos visuels unitaires ou supports imprimés (kakémonos, bâches, affiches) conçus et livrés sous 24 heures.',
    isSingleLine: true,
    deliveryTime: 'Livraison garantie sous 24h',
    highlightDetails: [],
    ctaText: 'Commander un visuel express'
  }
];
