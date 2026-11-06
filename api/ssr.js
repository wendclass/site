// src/ssr.ts
import fs from "fs";
import path from "path";

// src/data/offres.ts
var GUIDE_SITUATIONS = [
  {
    id: "launch-biz",
    text: "Je lance mon activit\xE9",
    targetId: "formule-logo-essentiel",
    category: "Logo \u2014 Essentiel"
  },
  {
    id: "coherent-brand",
    text: "Je veux une image coh\xE9rente partout",
    targetId: "formule-logo-standard",
    category: "Logo \u2014 Standard"
  },
  {
    id: "investors-clients",
    text: "Je vise des investisseurs ou de grands clients",
    targetId: "formule-logo-signature",
    category: "Logo \u2014 Signature"
  },
  {
    id: "no-social-manager",
    text: "Je n\u2019ai personne pour animer mes r\xE9seaux",
    targetId: "formule-social-presence",
    category: "R\xE9seaux \u2014 Pr\xE9sence Continue"
  },
  {
    id: "sell-continuously",
    text: "Je veux vendre en continu, pas seulement exister en ligne",
    targetId: "formule-social-croissance",
    category: "R\xE9seaux \u2014 Croissance Acc\xE9l\xE9r\xE9e"
  },
  {
    id: "need-website-fast",
    text: "Il me faut un site, vite",
    targetId: "famille-sites-web",
    category: "Sites Web"
  },
  {
    id: "event-organization",
    text: "J\u2019organise un \xE9v\xE9nement",
    targetId: "famille-evenementiel",
    category: "Communication \xC9v\xE9nementielle"
  }
];
var offerFamilies = [
  // ---------------------------------------------------------------------------
  // 01. Logo & Identité Visuelle
  // ---------------------------------------------------------------------------
  {
    id: "logo-identite",
    number: "01",
    anchorId: "famille-logo",
    navLabel: "01 Logo & Identit\xE9",
    title: "Logo & Identit\xE9 Visuelle",
    subtitle: "Chaque \xE9l\xE9ment de votre identit\xE9 sera construit pour qu\u2019elle s\u2019impose dans votre march\xE9 et ne se noie pas parmi vos concurrents.",
    accentColor: "#6600CC",
    // Violet Impérial
    ctaText: "Discuter de mon identit\xE9 visuelle",
    ctaTypeParam: "logo",
    namingOptionNote: "Option Naming disponible : recherche de nom originale, analyse d\u2019\xE9vocation et v\xE9rification de disponibilit\xE9 avant cr\xE9ation graphique.",
    formulas: [
      {
        id: "essentiel",
        name: "Essentiel",
        slugAnchor: "formule-logo-essentiel",
        idealFor: "Id\xE9al si vous lancez votre activit\xE9 et avez besoin d\u2019un logo solide, rapidement.",
        deliveryTime: "3 \xE0 5 jours",
        keyPoints: [
          "1 proposition de concept originale sur mesure",
          "2 r\xE9visions incluses sur la piste retenue",
          "Fichiers finaux livr\xE9s en vectoriel (SVG/AI), PDF haute d\xE9finition et PNG transparent",
          "4 mises en situation r\xE9alistes (mockups premium) pour visualiser votre marque"
        ]
      },
      {
        id: "standard",
        name: "Standard",
        slugAnchor: "formule-logo-standard",
        idealFor: "Id\xE9al si vous voulez une image coh\xE9rente, et pouvoir cr\xE9er vos propres supports ensuite.",
        deliveryTime: "Environ 10 jours",
        badge: "\xC9quilibre & Autonomie",
        highlighted: true,
        keyPoints: [
          "2 propositions de concepts originaux explor\xE9s",
          "Charte graphique de base (palette chromatique, r\xE8gles typographiques, marges de s\xE9curit\xE9)",
          "Kit de lancement r\xE9seaux sociaux (banni\xE8res de couverture et avatars normalis\xE9s)",
          "10 mockups premium + 4 r\xE9visions incluses pour un rendu irr\xE9prochable"
        ]
      },
      {
        id: "signature",
        name: "Signature",
        slugAnchor: "formule-logo-signature",
        idealFor: "Id\xE9al si vous visez des interlocuteurs exigeants : investisseurs, partenaires, grands clients.",
        deliveryTime: "2 semaines",
        badge: "Exclusivit\xE9 & Autorit\xE9",
        keyPoints: [
          "3 propositions de concepts originaux approfondis",
          "Charte graphique compl\xE8te et d\xE9taill\xE9e (guide d\u2019usage print & digital)",
          "Fichiers finaux complets + fichiers sources natifs avec cession totale et exclusive des droits",
          "Exclusivit\xE9 sectorielle garantie 6 mois et dossier complet de pr\xE9sentation de marque"
        ]
      }
    ],
    comparisonHeaders: [
      { id: "essentiel", label: "Essentiel" },
      { id: "standard", label: "Standard" },
      { id: "signature", label: "Signature" }
    ],
    comparisonRows: [
      {
        label: "Propositions de concepts originaux",
        values: { essentiel: "1 concept", standard: "2 concepts", signature: "3 concepts" }
      },
      {
        label: "Nombre de r\xE9visions incluses",
        values: { essentiel: "2 r\xE9visions", standard: "4 r\xE9visions", signature: "6 r\xE9visions" }
      },
      {
        label: "Charte graphique",
        values: { essentiel: false, standard: "De base (couleurs & typos)", signature: "Compl\xE8te et d\xE9taill\xE9e" }
      },
      {
        label: "Formats de fichiers finaux export\xE9s",
        values: {
          essentiel: "PNG, PDF, vectoriels",
          standard: "Tous formats utiles print & web",
          signature: "Tous formats + fichiers sources natifs"
        }
      },
      {
        label: "Cession des droits d\u2019auteur",
        values: { essentiel: false, standard: false, signature: "Totale et exclusive" }
      },
      {
        label: "Mises en situation r\xE9alistes (mockups premium)",
        values: { essentiel: "4 mockups", standard: "10 mockups", signature: "20 mockups" }
      },
      {
        label: "Kit de lancement pour vos r\xE9seaux sociaux",
        values: {
          essentiel: false,
          standard: "Inclus (banni\xE8res & avatars)",
          signature: "Inclus + papeterie \xE9largie (en-t\xEAte, enveloppe)"
        }
      },
      {
        label: "Dossier de pr\xE9sentation de marque (investisseurs/partenaires)",
        values: { essentiel: false, standard: false, signature: "Inclus" }
      },
      {
        label: "Licences (typographies, iconographie, banques d\u2019images)",
        values: { essentiel: false, standard: false, signature: "Incluses" }
      },
      {
        label: "Garantie d\u2019exclusivit\xE9 sectorielle",
        values: { essentiel: false, standard: false, signature: "6 mois" }
      },
      {
        label: "Acc\xE8s au mod\xE8le d\u2019outil de devis / facturation aux couleurs de marque",
        values: { essentiel: "1 mois", standard: "2 mois", signature: "3 mois" }
      },
      {
        label: "Sauvegarde s\xE9curis\xE9e permanente des fichiers",
        values: { essentiel: false, standard: "6 mois", signature: "1 an" }
      },
      {
        label: "Suivi et ajustements apr\xE8s livraison",
        values: { essentiel: false, standard: false, signature: "1 mois" }
      },
      {
        label: "D\xE9lai moyen d\u2019ex\xE9cution",
        values: { essentiel: "3 \xE0 5 jours", standard: "Environ 10 jours", signature: "2 semaines" }
      }
    ]
  },
  // ---------------------------------------------------------------------------
  // 02. Branding Social Media
  // ---------------------------------------------------------------------------
  {
    id: "branding-social-media",
    number: "02",
    anchorId: "famille-social",
    navLabel: "02 R\xE9seaux sociaux",
    title: "Branding Social Media",
    subtitle: "Une pr\xE9sence visuelle continue et percutante chaque mois pour nourrir l\u2019autorit\xE9 de votre marque sans jamais conna\xEEtre la panne d\u2019id\xE9es.",
    badge: "Abonnement mensuel",
    accentColor: "#A87FE8",
    // Améthyste
    ctaText: "Mettre en place mon abonnement social media",
    ctaTypeParam: "social",
    formulas: [
      {
        id: "presence",
        name: "Pr\xE9sence Continue",
        slugAnchor: "formule-social-presence",
        idealFor: "Id\xE9al si vous avez d\xE9j\xE0 une identit\xE9, mais personne pour la faire vivre chaque semaine.",
        badge: "2 visuels / semaine",
        keyPoints: [
          "8 visuels finis par mois (rythme r\xE9gulier de 2 publications par semaine)",
          "D\xE9clinaison au format Story offerte syst\xE9matiquement pour chaque publication",
          "Proposition d\u2019accroche et l\xE9gende strat\xE9gique pr\xEAte \xE0 copier-coller",
          "Planning \xE9ditorial visuel valid\xE9 au pr\xE9alable en d\xE9but de chaque mois"
        ]
      },
      {
        id: "croissance",
        name: "Croissance Acc\xE9l\xE9r\xE9e",
        slugAnchor: "formule-social-croissance",
        idealFor: "Id\xE9al si vous voulez vendre en continu, pas seulement exister en ligne.",
        badge: "4 visuels / semaine",
        highlighted: true,
        keyPoints: [
          "16 visuels finis par mois (rythme soutenu de 4 publications par semaine)",
          "Conception de carrousels p\xE9dagogiques et strat\xE9giques pour booster l\u2019engagement",
          "Cr\xE9neau de conception hebdomadaire garanti sans temps mort",
          "Point d\u2019\xE9change mensuel d\u2019optimisation strat\xE9gique de 30 minutes inclus"
        ]
      }
    ],
    comparisonHeaders: [
      { id: "presence", label: "Pr\xE9sence Continue" },
      { id: "croissance", label: "Croissance Acc\xE9l\xE9r\xE9e" }
    ],
    comparisonRows: [
      {
        label: "Nombre de visuels finis par mois",
        values: { presence: "8 visuels (2 / semaine)", croissance: "16 visuels (4 / semaine)" }
      },
      {
        label: "D\xE9clinaison au format Story offerte",
        values: { presence: true, croissance: true }
      },
      {
        label: "R\xE9visions incluses par visuel",
        values: { presence: "1 r\xE9vision", croissance: "1 r\xE9vision" }
      },
      {
        label: "Accroche et l\xE9gende sugg\xE9r\xE9es avec chaque publication",
        values: { presence: true, croissance: true }
      },
      {
        label: "Planning de contenu \xE9tabli en d\xE9but de mois",
        values: { presence: true, croissance: true }
      },
      {
        label: "Formats sp\xE9ciaux (carrousels p\xE9dagogiques & visuels tendance)",
        values: { presence: true, croissance: true }
      },
      {
        label: "Garantie de retouche r\xE9active sous 24 h",
        values: { presence: true, croissance: true }
      },
      {
        label: "Cr\xE9neau de production hebdomadaire garanti",
        values: { presence: false, croissance: true }
      },
      {
        label: "Appel mensuel strat\xE9gique d\u2019optimisation (30 minutes)",
        values: { presence: false, croissance: true }
      }
    ]
  },
  // ---------------------------------------------------------------------------
  // 03. Communication Événementielle
  // ---------------------------------------------------------------------------
  {
    id: "communication-evenementielle",
    number: "03",
    anchorId: "famille-evenementiel",
    navLabel: "03 \xC9v\xE9nementiel",
    title: "Communication \xC9v\xE9nementielle",
    subtitle: "Chaque \xE9v\xE9nement a son envergure, son public et ses contraintes propres. Votre dispositif visuel est calibr\xE9 sur mesure pour marquer les esprits.",
    badge: "Sur devis",
    accentColor: "#C9A070",
    // Or Champagne
    isCustomQuoteOnly: true,
    idealFor: "Id\xE9al si vous organisez un \xE9v\xE9nement et voulez que chaque support soit coh\xE9rent.",
    ctaText: "Demander un devis sur mesure",
    ctaTypeParam: "event"
  },
  // ---------------------------------------------------------------------------
  // 04. Sites Web
  // ---------------------------------------------------------------------------
  {
    id: "sites-web",
    number: "04",
    anchorId: "famille-sites-web",
    navLabel: "04 Sites web",
    title: "Un site complet en quelques jours, pas en plusieurs semaines.",
    subtitle: "Un site web moderne, rapide et optimis\xE9 pour transformer vos visiteurs en prises de contact directes sur WhatsApp.",
    accentColor: "#C9A070",
    isDarkBand: true,
    // Seule bande sombre Onyx
    hostingDomainNote: "Important : l\u2019h\xE9bergement et le nom de domaine restent \xE0 la charge du client (conseils et accompagnement de choix fournis).",
    ctaText: "Lancer la cr\xE9ation de mon site web",
    ctaTypeParam: "website",
    comparisonHeaders: [
      { id: "vitrine-essentiel", label: "Vitrine Essentiel" },
      { id: "vitrine-premium", label: "Vitrine Premium" },
      { id: "multi-essentiel", label: "Multi-pages Essentiel" },
      { id: "multi-premium", label: "Multi-pages Premium" }
    ],
    comparisonRows: [
      {
        label: "Nombre de pages",
        values: {
          "vitrine-essentiel": "1 page",
          "vitrine-premium": "1 page",
          "multi-essentiel": "Jusqu\u2019\xE0 5 pages",
          "multi-premium": "Jusqu\u2019\xE0 8 pages + blog"
        }
      },
      {
        label: "Contenu & structure",
        values: {
          "vitrine-essentiel": "Sections essentielles (pr\xE9sentation, services, contact)",
          "vitrine-premium": "Sections enrichies & parcours de conversion",
          "multi-essentiel": "Formulaire de contact structur\xE9",
          "multi-premium": "Formulaire avanc\xE9 + int\xE9gration r\xE9seaux"
        }
      },
      {
        label: "Optimisation pour le r\xE9f\xE9rencement (SEO)",
        values: {
          "vitrine-essentiel": false,
          "vitrine-premium": "De base (balises & m\xE9tadonn\xE9es)",
          "multi-essentiel": "De base (balises & structure)",
          "multi-premium": "Renforc\xE9 (architecture s\xE9mantique & blog)"
        }
      },
      {
        label: "Design responsive (mobile, tablette, ordinateur)",
        values: {
          "vitrine-essentiel": true,
          "vitrine-premium": true,
          "multi-essentiel": true,
          "multi-premium": true
        }
      },
      {
        label: "Nombre de r\xE9visions incluses",
        values: {
          "vitrine-essentiel": false,
          "vitrine-premium": false,
          "multi-essentiel": "2 r\xE9visions",
          "multi-premium": "4 r\xE9visions"
        }
      },
      {
        label: "Support & accompagnement technique apr\xE8s lancement",
        values: {
          "vitrine-essentiel": false,
          "vitrine-premium": false,
          "multi-essentiel": "30 jours inclus",
          "multi-premium": "60 jours inclus"
        }
      },
      {
        label: "D\xE9lai d\u2019ex\xE9cution moyen",
        values: {
          "vitrine-essentiel": "48 heures",
          "vitrine-premium": "72 heures",
          "multi-essentiel": "5 jours",
          "multi-premium": "Sur mesure"
        }
      }
    ]
  },
  // ---------------------------------------------------------------------------
  // 05. Visuels à l’unité
  // ---------------------------------------------------------------------------
  {
    id: "visuels-a-lunite",
    number: "05",
    anchorId: "famille-visuels",
    navLabel: "05 Visuels",
    title: "Visuels \xE0 l\u2019unit\xE9 & Supports imprim\xE9s",
    subtitle: "Un besoin ponctuel et urgent ? Vos visuels unitaires ou supports imprim\xE9s con\xE7us et livr\xE9s sous 24 heures.",
    accentColor: "#3A2F5C",
    // Ardoise
    isSingleLine: true,
    deliveryTime: "Livraison garantie sous 24h",
    idealFor: "Id\xE9al si vous avez besoin d\u2019un support pr\xE9cis, sans abonnement.",
    ctaText: "Commander un visuel express",
    ctaTypeParam: "print"
  }
];
var websiteFormats = [
  {
    id: "vitrine",
    slugAnchor: "formule-site-vitrine",
    title: "Site Vitrine (1 page)",
    subtitle: "Une architecture concise pens\xE9e pour valoriser votre offre en quelques secondes et pousser chaque visiteur \xE0 vous contacter sur WhatsApp.",
    variants: {
      essentiel: {
        id: "essentiel",
        label: "Essentiel",
        idealFor: "Id\xE9al si vous avez besoin d\u2019une page claire qui pr\xE9sente votre activit\xE9, vite.",
        deliveryTime: "48 heures",
        keyPoints: [
          "Architecture one-page fluide (pr\xE9sentation, services, contact direct)",
          "Design 100% responsive et fluide sur mobile, tablette et ordinateur",
          "Int\xE9gration directe des boutons de contact WhatsApp & prise de rendez-vous",
          "Livraison rapide garantie en 48 heures"
        ]
      },
      premium: {
        id: "premium",
        label: "Premium",
        idealFor: "Id\xE9al si vous voulez une page vitrine enrichie avec conversion renforc\xE9e.",
        deliveryTime: "72 heures",
        keyPoints: [
          "Sections enrichies, animations d\u2019interaction et design sur mesure",
          "Optimisation SEO technique de base pour le r\xE9f\xE9rencement local",
          "Int\xE9gration de formulaires de contact conditionnels et r\xE9seaux sociaux",
          "Livraison rapide garantie en 72 heures"
        ]
      }
    }
  },
  {
    id: "multipages",
    slugAnchor: "formule-site-multipages",
    title: "Site Multi-pages",
    subtitle: "Une plateforme compl\xE8te pour d\xE9tailler chaque volet de votre offre, structurer vos contenus et asseoir une autorit\xE9 incontestable dans votre secteur.",
    variants: {
      essentiel: {
        id: "essentiel",
        label: "Essentiel",
        idealFor: "Id\xE9al si vous avez plusieurs services \xE0 pr\xE9senter et voulez un site complet.",
        deliveryTime: "5 jours",
        keyPoints: [
          "Jusqu\u2019\xE0 5 pages structur\xE9es avec navigation ergonomique d\xE9di\xE9e",
          "Formulaire de contact structur\xE9 avec routage direct des demandes",
          "2 r\xE9visions incluses + 30 jours de support technique post-lancement",
          "Livraison garantie en 5 jours"
        ]
      },
      premium: {
        id: "premium",
        label: "Premium",
        idealFor: "Id\xE9al si vous avez plusieurs services et voulez un site complet avec blog.",
        deliveryTime: "Sur mesure",
        keyPoints: [
          "Jusqu\u2019\xE0 8 pages compl\xE8tes + section blog \xE9ditorial int\xE9gr\xE9e",
          "R\xE9f\xE9rencement SEO technique renforc\xE9 (architecture s\xE9mantique & vitesse)",
          "4 r\xE9visions incluses + 60 jours d\u2019assistance technique et support",
          "Accompagnement post-lancement et conseils d\u2019optimisation"
        ]
      }
    }
  }
];
var offersData = offerFamilies.map((fam) => {
  return {
    id: fam.id,
    number: fam.number,
    title: fam.id === "sites-web" ? "Sites Web" : fam.title,
    subtitle: fam.subtitle,
    badge: fam.badge,
    isCustomQuoteOnly: fam.isCustomQuoteOnly,
    isSingleLine: fam.isSingleLine,
    deliveryTime: fam.deliveryTime,
    highlightPromise: fam.formulas ? fam.formulas[0]?.idealFor : void 0,
    highlightDetails: fam.formulas ? fam.formulas[0]?.keyPoints : [],
    ctaText: fam.ctaText
  };
});

// src/data/projets.ts
var projectsData = [
  {
    id: "72h-cj-2026",
    slug: "72-heures-cj-2026",
    title: "72 Heures des \xE9tudiants en communication et journalisme 2026",
    category: "Communication \xC9v\xE9nementielle & Carrousel",
    tagline: "Une strat\xE9gie visuelle rythm\xE9e pour surpasser l\u2019impact des \xE9ditions pr\xE9c\xE9dentes.",
    accroche: "Une strat\xE9gie visuelle rythm\xE9e pour surpasser l\u2019impact des \xE9ditions pr\xE9c\xE9dentes.",
    clientGoal: "Faire mieux que l\u2019\xE9dition pr\xE9c\xE9dente de l\u2019\xE9v\xE9nement en termes de visibilit\xE9 et d\u2019engouement.",
    designedSolution: "Conception principale autour d\u2019un carrousel cr\xE9atif et strat\xE9gique surfant sur la Saint-Valentin ; ensemble de visuels compl\xE9mentaires comprenant l\u2019annonce de stand disponible, les concours et la couverture officielle du rapport d\u2019activit\xE9.",
    result: "Client pleinement satisfait de la dynamique cr\xE9\xE9e et de la coh\xE9rence globale sur tous les canaux.",
    testimonialPlaceholder: "\xAB Scott a su capter l\u2019esprit de notre \xE9v\xE9nement et concevoir des supports qui ont imm\xE9diatement suscit\xE9 des r\xE9actions et des inscriptions. \xBB \u2014 Comit\xE9 d\u2019organisation 72h CJ",
    heroImage: "/assets/projets/72h-cj-2026/Carrousel 0 72h 2026.png",
    gallery: [
      {
        src: "/assets/projets/72h-cj-2026/Carrousel 0 72h 2026.png",
        caption: "Accroche principale du carrousel \xE9v\xE9nementiel (Saint-Valentin)"
      },
      {
        src: "/assets/projets/72h-cj-2026/Carrousel 1 72h 2026.png",
        caption: "Carrousel \u2014 Slide 1 : Le d\xE9clic"
      },
      {
        src: "/assets/projets/72h-cj-2026/Carrousel 2 72h 2026.png",
        caption: "Carrousel \u2014 Slide 2 : La promesse"
      },
      {
        src: "/assets/projets/72h-cj-2026/Carrousel 3 72h 2026.png",
        caption: "Carrousel \u2014 Slide 3 : L\u2019appel \xE0 l\u2019action"
      },
      {
        src: "/assets/projets/72h-cj-2026/Cover Rapport d'Activit\xE9s 72H 2026.png",
        caption: "Couverture officielle du rapport d\u2019activit\xE9s 72h 2026"
      },
      {
        src: "/assets/projets/72h-cj-2026/Stands disponibles 72h 2026.png",
        caption: "Annonce commerciale \u2014 R\xE9servation des stands exposants"
      },
      {
        src: "/assets/projets/72h-cj-2026/Final des Comp\xE9titions v1.png",
        caption: "Visuel officiel \u2014 Grande finale des comp\xE9titions"
      },
      {
        src: "/assets/projets/72h-cj-2026/Ambassadrice & Ambassadeur 72h 2026 v2.1.png",
        caption: "Pr\xE9sentation des ambassadeurs et ambassadrices"
      },
      {
        src: "/assets/projets/72h-cj-2026/Appel \xE0 comp\xE9tition v3.0.png",
        caption: "Visuel d\u2019appel \xE0 candidatures et comp\xE9titions"
      },
      {
        src: "/assets/projets/72h-cj-2026/Visuel Prix Pazouknam Ouedraogo v2.png",
        caption: "Visuel de distinction \u2014 Prix Pazouknam Ou\xE9draogo"
      },
      {
        src: "/assets/projets/72h-cj-2026/8 mars 72h 2026.png",
        caption: "C\xE9l\xE9bration du 8 mars dans le cadre des 72h CJ"
      },
      {
        src: "/assets/projets/72h-cj-2026/R\xE9capitulatif Chronogramme 72heures.png",
        caption: "R\xE9capitulatif complet du chronogramme des 3 jours"
      },
      {
        src: "/assets/projets/72h-cj-2026/Chronogramme Jour 1 72h ed 26 PAD.png",
        caption: "Programme d\xE9taill\xE9 \u2014 Jour 1"
      },
      {
        src: "/assets/projets/72h-cj-2026/Chronogramme Jour 2 72h 26 PAD.png",
        caption: "Programme d\xE9taill\xE9 \u2014 Jour 2"
      },
      {
        src: "/assets/projets/72h-cj-2026/Chronogramme Jour 3 72h 26 PAD.png",
        caption: "Programme d\xE9taill\xE9 \u2014 Jour 3"
      }
    ]
  },
  {
    id: "mon-frere-parle",
    slug: "mon-frere-parle",
    title: "Mon Fr\xE8re, Parle",
    category: "Identit\xE9 Visuelle & Campagne de Sensibilisation",
    tagline: "Une identit\xE9 apaisante pour lib\xE9rer la parole des hommes sur la sant\xE9 mentale.",
    accroche: "Une identit\xE9 apaisante pour lib\xE9rer la parole des hommes sur la sant\xE9 mentale.",
    clientGoal: "Faire conna\xEEtre un nouveau format de th\xE9rapie destin\xE9 aux hommes, \xE0 l\u2019occasion du mois de la sant\xE9 mentale.",
    designedSolution: "Une identit\xE9 visuelle pens\xE9e pour apaiser l\u2019esprit et lib\xE9rer des surcharges mentales : palette chromatique douce, typographie bienveillante et gestion a\xE9r\xE9e des espaces n\xE9gatifs, orchestr\xE9es au service d\u2019un message profond\xE9ment humain.",
    result: "Client satisfait de l\u2019accueil bienveillant et de la justesse du ton v\xE9hicul\xE9 par chaque support.",
    testimonialPlaceholder: "\xAB L\u2019approche visuelle a imm\xE9diatement pos\xE9 un cadre rassurant pour les participants. Scott a traduit avec pudeur et force ce que nous voulions transmettre. \xBB \u2014 Initiateur du projet",
    heroImage: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Visuel_Principal.jpg",
    gallery: [
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Visuel_Principal.jpg",
        caption: "Affiche principale de sensibilisation"
      },
      {
        src: "/assets/projets/mon-frere-parle/Logotype_v1_mon_fr\xE8re_parle.png",
        caption: "Logotype officiel Mon Fr\xE8re, Parle"
      },
      {
        src: "/assets/projets/mon-frere-parle/MFP_OutdoorPosterMockup004.png",
        caption: "Affichage urbain grand format en situation"
      },
      {
        src: "/assets/projets/mon-frere-parle/Certification Mockup MFP.png",
        caption: "Mise en situation du certificat de participation"
      },
      {
        src: "/assets/projets/mon-frere-parle/MFP_HandCardMockup.png",
        caption: "Cartes d\u2019accompagnement et de soutien en main"
      },
      {
        src: "/assets/projets/mon-frere-parle/MFP_PostCardMockup.png",
        caption: "Mockup carte postale de sensibilisation"
      },
      {
        src: "/assets/projets/mon-frere-parle/instagram post mockup MFP.png",
        caption: "Mise en situation post Instagram"
      },
      {
        src: "/assets/projets/mon-frere-parle/Teaser Instagram Post Mockup MFP.png",
        caption: "Teaser Instagram en situation"
      },
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Coming_soon_0.jpg",
        caption: "Teaser \u2014 Annonce Coming Soon 1"
      },
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Coming_soon_2.jpg",
        caption: "Teaser \u2014 Annonce Coming Soon 2"
      },
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Coming_soon_3.jpg",
        caption: "Teaser \u2014 Annonce Coming Soon 3"
      },
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_D\xE9compte.jpg",
        caption: "Visuel de d\xE9compte avant lancement"
      },
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Invitation.jpg",
        caption: "Visuel d\u2019invitation aux sessions"
      },
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Invit\xE9_Sp\xE9cial.jpg",
        caption: "Annonce de l\u2019invit\xE9 sp\xE9cial"
      },
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Objectif.jpg",
        caption: "Pr\xE9sentation des objectifs th\xE9rapeutiques"
      },
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_T\xE9moignage.jpg",
        caption: "Visuel de valorisation des t\xE9moignages"
      },
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Chroogramme_v2.jpg",
        caption: "Chronogramme des ateliers et rencontres"
      },
      {
        src: "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Thanks_FANKANI.jpg",
        caption: "Visuel de remerciement aux intervenants"
      }
    ]
  },
  {
    id: "off-day",
    slug: "off-day",
    title: "Off Day : 24H sans \xE9cran, 24H pour moi",
    category: "Communication \xC9v\xE9nementielle & Campagne Digitale",
    tagline: "Une conception \xE9pur\xE9e pour marquer les esprits d\xE8s la premi\xE8re \xE9dition.",
    accroche: "Une conception \xE9pur\xE9e pour marquer les esprits d\xE8s la premi\xE8re \xE9dition.",
    clientGoal: "Captiver et marquer les esprits pour installer la toute premi\xE8re \xE9dition de l\u2019\xE9v\xE9nement.",
    designedSolution: "Une direction artistique ax\xE9e sur la simplicit\xE9 radicale et l\u2019espace, pens\xE9e pour retenir l\u2019attention du public sans surcharger son esprit \u2014 en r\xE9sonance directe avec le concept de d\xE9connexion num\xE9rique.",
    result: "Client satisfait du niveau d\u2019attention et de la m\xE9morisation forte suscit\xE9s par la campagne.",
    testimonialPlaceholder: "\xAB Les visuels ont donn\xE9 vie au concept avant m\xEAme le jour J. L\u2019impact a \xE9t\xE9 instantan\xE9 aupr\xE8s de notre audience. \xBB \u2014 \xC9quipe Off Day",
    disclaimer: "Note d\u2019attribution : Le logo de cet \xE9v\xE9nement a \xE9t\xE9 con\xE7u par un autre graphiste via intelligence artificielle, sans intervention cr\xE9ative de Scott Nana / Class S. L\u2019intervention de Class S a port\xE9 exclusivement sur la strat\xE9gie visuelle, la conception graphique des supports et la campagne de communication.",
    heroImage: "/assets/projets/off-day/Off_Day_Visual_v2.2 Corrig\xE9.png",
    gallery: [
      {
        src: "/assets/projets/off-day/Off_Day_Visual_v2.2 Corrig\xE9.png",
        caption: "Visuel officiel de la campagne Off Day"
      },
      {
        src: "/assets/projets/off-day/Off_Day_StayFree_00.png",
        caption: "S\xE9rie Stay Free \u2014 Concept 00"
      },
      {
        src: "/assets/projets/off-day/Off_Day_StayFree_01.png",
        caption: "S\xE9rie Stay Free \u2014 Concept 01"
      },
      {
        src: "/assets/projets/off-day/Off_Day_StayFree_02.png",
        caption: "S\xE9rie Stay Free \u2014 Concept 02"
      },
      {
        src: "/assets/projets/off-day/Off_Day_StayFree_03.png",
        caption: "S\xE9rie Stay Free \u2014 Concept 03"
      },
      {
        src: "/assets/projets/off-day/Off_Day_StayFree_04.png",
        caption: "S\xE9rie Stay Free \u2014 Concept 04"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Movie_Night_14th_v2.2.png",
        caption: "Annonce Movie Night \xE9v\xE9nementielle"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Soir\xE9e_Cin\xE9.png",
        caption: "Visuel Soir\xE9e Cin\xE9ma & D\xE9bat"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Plaidoirie_v3.6.png",
        caption: "Support de plaidoirie pour la d\xE9connexion"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Plaidorie_Modalit\xE9s_v2.png",
        caption: "Modalit\xE9s de participation au concours de plaidoirie"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Mode_Snooz_v2.png",
        caption: "Concept visuel \u2014 Mode Snooze activ\xE9"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Invisibilit\xE9_D\xE9fi.png",
        caption: "D\xE9fi Invisibilit\xE9 num\xE9rique"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Invisibilit\xE9_Teaser.png",
        caption: "Teaser du d\xE9fi Invisibilit\xE9"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Coming_Soon_v2.png",
        caption: "Teaser d\u2019annonce \u2014 Coming Soon v1"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Coming_Soon_2_v2.png",
        caption: "Teaser d\u2019annonce \u2014 Coming Soon v2"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Coming_Soon_3.2.png",
        caption: "Teaser d\u2019annonce \u2014 Coming Soon v3"
      },
      {
        src: "/assets/projets/off-day/Profis_Quiz_OffDay_Le_Conscient.png",
        caption: "Profil Quiz \u2014 Le Conscient"
      },
      {
        src: "/assets/projets/off-day/Profis_Quiz_OffDay_La_Consciente.png",
        caption: "Profil Quiz \u2014 La Consciente"
      },
      {
        src: "/assets/projets/off-day/Profis_Quiz_OffDay_Le_Fragile.png",
        caption: "Profil Quiz \u2014 Le Fragile"
      },
      {
        src: "/assets/projets/off-day/Profis_Quiz_OffDay_La_Fragile.png",
        caption: "Profil Quiz \u2014 La Fragile"
      },
      {
        src: "/assets/projets/off-day/Profis_Quiz_OffDay_Le_Zombie_connecte.png",
        caption: "Profil Quiz \u2014 Le Zombie connect\xE9"
      },
      {
        src: "/assets/projets/off-day/Profis_Quiz_OffDay_La_Zombie_connectee.png",
        caption: "Profil Quiz \u2014 La Zombie connect\xE9e"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Quiz_Teaser.png",
        caption: "Teaser du grand Quiz d\u2019\xE9valuation"
      },
      {
        src: "/assets/projets/off-day/R\xE9seaux_Sociaux_Conf\xE9rence_Presse_Off_Day_v2.2.png",
        caption: "Annonce de la conf\xE9rence de presse"
      },
      {
        src: "/assets/projets/off-day/Banni\xE8re_Facebook_OffDay.png",
        caption: "Banni\xE8re officielle Facebook"
      },
      {
        src: "/assets/projets/off-day/Invitation_Off_Day RECTO.png",
        caption: "Carte d\u2019invitation VIP (Recto)"
      },
      {
        src: "/assets/projets/off-day/Invitation_Off_Day VERSO.png",
        caption: "Carte d\u2019invitation VIP (Verso)"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Flyer_Recto.png",
        caption: "Flyer grand public (Recto)"
      },
      {
        src: "/assets/projets/off-day/Off_Day_Flyer_Verso.png",
        caption: "Flyer grand public (Verso)"
      }
    ]
  },
  {
    id: "cafe-inspire",
    slug: "cafe-inspire",
    title: "Caf\xE9 Inspire",
    category: "Branding Social Media & Campagnes Publicitaires",
    tagline: "Structuration d\u2019une identit\xE9 visuelle r\xE9currente pour stimuler l\u2019engagement commercial.",
    accroche: "Structuration d\u2019une identit\xE9 visuelle r\xE9currente pour stimuler l\u2019engagement commercial.",
    clientGoal: "Obtenir des visuels de qualit\xE9 pour alimenter r\xE9guli\xE8rement sa page Facebook et lancer des campagnes publicitaires performantes.",
    designedSolution: "Cr\xE9ation en amont d\u2019une mini-charte graphique coh\xE9rente (palette, codes typographiques, templates de mise en page) \xE0 partir du logo initial, suivie de la production mensuelle de visuels percutants adapt\xE9s aux temps forts du caf\xE9.",
    result: "Les nouveaux visuels ont nettement capt\xE9 et attir\xE9 davantage l\u2019attention que les publications ant\xE9rieures du client.",
    testimonialPlaceholder: "\xAB Nos clients nous ont fait des retours imm\xE9diats sur le changement d\u2019image de la page. C\u2019est beaucoup plus pro et nos offres ressortent enfin. \xBB \u2014 G\xE9rance Caf\xE9 Inspire",
    heroImage: "/assets/projets/cafe-inspire/01_Caf\xE9 Pyramide v3.png",
    gallery: [
      {
        src: "/assets/projets/cafe-inspire/01_Caf\xE9 Pyramide v3.png",
        caption: "Mise en avant signature \u2014 Caf\xE9 Pyramide (Version principale)"
      },
      {
        src: "/assets/projets/cafe-inspire/02_Caf\xE9 Pyramide v2.png",
        caption: "D\xE9clinaison visuelle \u2014 Caf\xE9 Pyramide"
      },
      {
        src: "/assets/projets/cafe-inspire/03_Anniversaire_Caf\xE9_Inspire_v2.1.png",
        caption: "Visuel \xE9v\xE9nementiel \u2014 Anniversaire Caf\xE9 Inspire"
      },
      {
        src: "/assets/projets/cafe-inspire/04_Livraison_Gratuite_Mercredi_Caf\xE9 Inspire v2.png",
        caption: "Offre promotionnelle \u2014 Livraison gratuite du mercredi"
      },
      {
        src: "/assets/projets/cafe-inspire/05_Bon_Mois_Septembre v2.png",
        caption: "Visuel relationnel & v\u0153ux \u2014 Bon mois de septembre"
      },
      {
        src: "/assets/projets/cafe-inspire/06_Tacos_Caf\xE9_Inspire v2.png",
        caption: "Mise en avant gourmande \u2014 Tacos & restauration"
      },
      {
        src: "/assets/projets/cafe-inspire/07_Hiring_AideChef.png",
        caption: "Avis de recrutement \u2014 Aide Chef cuisinier"
      },
      {
        src: "/assets/projets/cafe-inspire/08_Nouveau_Plat_Caf\xE9 Inspire.png",
        caption: "Lancement au menu \u2014 Nouveau plat Caf\xE9 Inspire"
      }
    ]
  },
  {
    id: "bang",
    slug: "bang",
    title: "Bang",
    category: "Identit\xE9 Visuelle de Marque & Strat\xE9gie",
    tagline: "Une identit\xE9 singuli\xE8re pour r\xE9inventer l\u2019exp\xE9rience de r\xE9vision des \xE9l\xE8ves et \xE9tudiants.",
    accroche: "Une identit\xE9 singuli\xE8re pour r\xE9inventer l\u2019exp\xE9rience de r\xE9vision des \xE9l\xE8ves et \xE9tudiants.",
    clientGoal: "Rendre plus faciles et stimulantes les r\xE9visions des \xE9tudiants et \xE9l\xE8ves gr\xE2ce \xE0 une identit\xE9 visuelle distincte, m\xE9morable et structur\xE9e.",
    designedSolution: "Cr\xE9ation d\u2019une identit\xE9 unique avec une palette chromatique audacieuse rompant avec les codes acad\xE9miques conventionnels, et conception d\u2019un logotype original garanti sans similitude avec les marques existantes sur les moteurs de recherche.",
    result: "Client pleinement satisfait du positionnement novateur et de la reconnaissance imm\xE9diate de la marque.",
    testimonialPlaceholder: "\xAB L\u2019identit\xE9 Bang a tout de suite trouv\xE9 son public. Elle d\xE9gage exactement l\u2019\xE9nergie moderne et motivante dont les \xE9tudiants ont besoin. \xBB \u2014 Fondateur Bang",
    heroImage: "/assets/projets/bang/Pr\xE9sentation_bang_logo.png",
    gallery: [
      {
        src: "/assets/projets/bang/Pr\xE9sentation_bang_logo.png",
        caption: "Planche de pr\xE9sentation officielle du logotype et de l\u2019identit\xE9"
      },
      {
        src: "/assets/projets/bang/SUBWAY LED BILLBOARD bang.png",
        caption: "Affichage num\xE9rique dynamique grand format en station"
      },
      {
        src: "/assets/projets/bang/sky billboard bang.png",
        caption: "Panneau d\u2019affichage urbain Sky Billboard"
      },
      {
        src: "/assets/projets/bang/Polo Shirt on Mannequin bang koko donda sans col.png",
        caption: "Application textile & merchandising sur polo Koko Donda"
      },
      {
        src: "/assets/projets/bang/App Icon bang.png",
        caption: "Ic\xF4ne officielle de l\u2019application mobile"
      },
      {
        src: "/assets/projets/bang/Horizontal_bang.png",
        caption: "D\xE9clinaison horizontale du logotype"
      },
      {
        src: "/assets/projets/bang/symbol_bang.png",
        caption: "Symbole graphique isol\xE9 de la marque Bang"
      },
      {
        src: "/assets/projets/bang/Lanyard_ID_badge_bang_1.png",
        caption: "Badges d\u2019identification et cordons tour de cou"
      },
      {
        src: "/assets/projets/bang/Orangebang_logo.png",
        caption: "Variante chromatique Orange Signature"
      },
      {
        src: "/assets/projets/bang/Vertbang_logo.png",
        caption: "Variante chromatique Vert Dynamique"
      },
      {
        src: "/assets/projets/bang/bang Motifs_bang.png",
        caption: "Motifs et patterns identitaires de la marque"
      },
      {
        src: "/assets/projets/bang/explain_bang.png",
        caption: "Sch\xE9ma d\u2019explication du concept de la marque"
      },
      {
        src: "/assets/projets/bang/Plan de travail 1 copie 3_bang.png",
        caption: "Planche de d\xE9clinaison graphique compl\xE9mentaire"
      }
    ]
  }
];

// src/data/faq.ts
var FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Combien de temps faut-il pour recevoir mes visuels ou mon identit\xE9 ?",
    answer: "Les d\xE9lais d\xE9pendent de l\u2019envergure du projet : les visuels \xE0 l\u2019unit\xE9 et supports imprim\xE9s urgents sont livr\xE9s sous 24 heures. Un site web vitrine est con\xE7u et mis en ligne en quelques jours. Pour une identit\xE9 visuelle compl\xE8te (recherche de concepts, d\xE9clinaisons, charte), le d\xE9lai moyen est convenu au pr\xE9alable lors de notre premier \xE9change et rigoureusement respect\xE9."
  },
  {
    id: "faq-2",
    question: "Comment se passe le r\xE8glement d\u2019un projet ?",
    answer: "La collaboration d\xE9marre \xE0 la signature du bon de commande avec un acompte de 70% pour r\xE9server le cr\xE9neau de production et engager les recherches strat\xE9giques. Le solde restant de 30% est r\xE9gl\xE9 \xE0 la validation finale, avant la transmission int\xE9grale des fichiers sources et droits d\u2019utilisation."
  },
  {
    id: "faq-3",
    question: "Est-ce que je peux demander des retouches si le r\xE9sultat ne me convient pas ?",
    answer: "Absolument. Toutes nos formules int\xE8grent des cycles de r\xE9visions. Gr\xE2ce \xE0 la phase de cadrage en amont (o\xF9 nous validons ensemble vos objectifs et vos pr\xE9f\xE9rences), les propositions tombent juste d\xE8s le premier jet, et les ajustements n\xE9cessaires sont apport\xE9s rapidement."
  },
  {
    id: "faq-4",
    question: "Pourquoi passer par Class S plut\xF4t que par un logo g\xE9n\xE9r\xE9 par IA ou un freelance low-cost ?",
    answer: "Une IA ou un g\xE9n\xE9rateur assemble des formes g\xE9n\xE9riques sans comprendre votre march\xE9 local, vos concurrents ni le comportement d\u2019achat de vos clients. Chez Class S, nous concevons une identit\xE9 strat\xE9gique unique, m\xE9morable et pens\xE9e pour vendre. Votre logo ne ressemblera \xE0 aucun autre sur votre secteur."
  },
  {
    id: "faq-5",
    question: "Je ne sais pas encore exactement ce qu\u2019il me faut, puis-je quand m\xEAme vous contacter ?",
    answer: "C\u2019est justement le meilleur moment pour \xE9changer. Choisissez l\u2019option \xAB Je ne sais pas encore \xBB dans le formulaire : nous prendrons un temps d\u2019\xE9change sur WhatsApp pour \xE9valuer vos priorit\xE9s et vous orienter vers la solution la plus rentable pour votre stade de d\xE9veloppement."
  }
];

// src/config/site.ts
var SITE_URL = "https://www.wendclass.com";
var SITE_CONFIG = {
  name: "Class S",
  alternateName: "Class S Design",
  founder: "Scott Nana",
  jobTitle: "Brand & Graphic Designer",
  locality: "Ouagadougou",
  country: "Burkina Faso",
  anchorPhrase: "Class S est un studio d'identit\xE9 visuelle \xE0 Ouagadougou, au service des entrepreneurs et des PME.",
  defaultTitle: "Class S \u2014 L'identit\xE9 visuelle qui vous impose | Scott Nana",
  defaultDescription: "Class S est un studio d'identit\xE9 visuelle \xE0 Ouagadougou, au service des entrepreneurs et des PME. D'une image qui existe \xE0 une image qui fait vendre.",
  logoUrl: `${SITE_URL}/assets/logo/logo-violet.png`,
  // Bannière de partage officielle 1200x630 (PNG, < 300 Ko)
  ogImageUrl: `${SITE_URL}/og/banniere-class-s.png`,
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/wendclass",
    facebook: "https://web.facebook.com/wendclass",
    behance: "https://www.behance.net/wendclass"
  }
};

// src/data/image-manifest.json
var image_manifest_default = {
  "/assets/about/scott-nana.png": {
    width: 1087,
    height: 1447,
    aspectRatio: 0.7512,
    hash: "1bbb2194",
    variants: {
      "480": "/assets/optimized/about/scott-nana-480.1bbb2194.webp",
      "800": "/assets/optimized/about/scott-nana-800.1bbb2194.webp"
    },
    fallback: "/assets/optimized/about/scott-nana-800.1bbb2194.webp"
  },
  "/assets/logo/favicon.png": {
    width: 128,
    height: 128,
    aspectRatio: 1,
    hash: "2ba90915",
    variants: {
      "480": "/assets/optimized/logo/favicon-480.2ba90915.webp",
      "800": "/assets/optimized/logo/favicon-800.2ba90915.webp"
    },
    fallback: "/assets/optimized/logo/favicon-800.2ba90915.webp"
  },
  "/assets/logo/logo-blanc.png": {
    width: 915,
    height: 403,
    aspectRatio: 2.2705,
    hash: "b5fd8087",
    variants: {
      "480": "/assets/optimized/logo/logo-blanc-480.b5fd8087.webp",
      "800": "/assets/optimized/logo/logo-blanc-800.b5fd8087.webp"
    },
    fallback: "/assets/optimized/logo/logo-blanc-800.b5fd8087.webp"
  },
  "/assets/logo/logo-violet.png": {
    width: 92,
    height: 31,
    aspectRatio: 2.9677,
    hash: "f7af6544",
    variants: {
      "480": "/assets/optimized/logo/logo-violet-480.f7af6544.webp",
      "800": "/assets/optimized/logo/logo-violet-800.f7af6544.webp"
    },
    fallback: "/assets/optimized/logo/logo-violet-800.f7af6544.webp"
  },
  "/assets/projets/72h-cj-2026/8 mars 72h 2026.png": {
    width: 3080,
    height: 3080,
    aspectRatio: 1,
    hash: "5a676444",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/8-mars-72h-2026-480.5a676444.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/8-mars-72h-2026-800.5a676444.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/8-mars-72h-2026-1200.5a676444.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/8-mars-72h-2026-1920.5a676444.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/8-mars-72h-2026-1200.5a676444.webp"
  },
  "/assets/projets/72h-cj-2026/Ambassadrice & Ambassadeur 72h 2026 v2.1.png": {
    width: 3080,
    height: 3080,
    aspectRatio: 1,
    hash: "2023b452",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/ambassadrice-ambassadeur-72h-2026-v2-1-480.2023b452.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/ambassadrice-ambassadeur-72h-2026-v2-1-800.2023b452.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/ambassadrice-ambassadeur-72h-2026-v2-1-1200.2023b452.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/ambassadrice-ambassadeur-72h-2026-v2-1-1920.2023b452.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/ambassadrice-ambassadeur-72h-2026-v2-1-1200.2023b452.webp"
  },
  "/assets/projets/72h-cj-2026/Appel \xE0 comp\xE9tition v3.0.png": {
    width: 3080,
    height: 3080,
    aspectRatio: 1,
    hash: "d9c2dfa1",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/appel-a-competition-v3-0-480.d9c2dfa1.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/appel-a-competition-v3-0-800.d9c2dfa1.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/appel-a-competition-v3-0-1200.d9c2dfa1.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/appel-a-competition-v3-0-1920.d9c2dfa1.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/appel-a-competition-v3-0-1200.d9c2dfa1.webp"
  },
  "/assets/projets/72h-cj-2026/Carrousel 0 72h 2026.png": {
    width: 3080,
    height: 3080,
    aspectRatio: 1,
    hash: "80a44c88",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/carrousel-0-72h-2026-480.80a44c88.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/carrousel-0-72h-2026-800.80a44c88.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/carrousel-0-72h-2026-1200.80a44c88.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/carrousel-0-72h-2026-1920.80a44c88.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/carrousel-0-72h-2026-1200.80a44c88.webp"
  },
  "/assets/projets/72h-cj-2026/Carrousel 1 72h 2026.png": {
    width: 3080,
    height: 3080,
    aspectRatio: 1,
    hash: "6e2cbef2",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/carrousel-1-72h-2026-480.6e2cbef2.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/carrousel-1-72h-2026-800.6e2cbef2.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/carrousel-1-72h-2026-1200.6e2cbef2.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/carrousel-1-72h-2026-1920.6e2cbef2.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/carrousel-1-72h-2026-1200.6e2cbef2.webp"
  },
  "/assets/projets/72h-cj-2026/Carrousel 2 72h 2026.png": {
    width: 3080,
    height: 3080,
    aspectRatio: 1,
    hash: "7f56ab17",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/carrousel-2-72h-2026-480.7f56ab17.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/carrousel-2-72h-2026-800.7f56ab17.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/carrousel-2-72h-2026-1200.7f56ab17.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/carrousel-2-72h-2026-1920.7f56ab17.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/carrousel-2-72h-2026-1200.7f56ab17.webp"
  },
  "/assets/projets/72h-cj-2026/Carrousel 3 72h 2026.png": {
    width: 3080,
    height: 3080,
    aspectRatio: 1,
    hash: "ec3c2b0a",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/carrousel-3-72h-2026-480.ec3c2b0a.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/carrousel-3-72h-2026-800.ec3c2b0a.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/carrousel-3-72h-2026-1200.ec3c2b0a.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/carrousel-3-72h-2026-1920.ec3c2b0a.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/carrousel-3-72h-2026-1200.ec3c2b0a.webp"
  },
  "/assets/projets/72h-cj-2026/Chronogramme Jour 1 72h ed 26 PAD.png": {
    width: 2480,
    height: 3508,
    aspectRatio: 0.707,
    hash: "45d5b59a",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-1-72h-ed-26-pad-480.45d5b59a.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-1-72h-ed-26-pad-800.45d5b59a.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-1-72h-ed-26-pad-1200.45d5b59a.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-1-72h-ed-26-pad-1920.45d5b59a.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-1-72h-ed-26-pad-1200.45d5b59a.webp"
  },
  "/assets/projets/72h-cj-2026/Chronogramme Jour 2 72h 26 PAD.png": {
    width: 2480,
    height: 3508,
    aspectRatio: 0.707,
    hash: "68eba6fc",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-2-72h-26-pad-480.68eba6fc.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-2-72h-26-pad-800.68eba6fc.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-2-72h-26-pad-1200.68eba6fc.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-2-72h-26-pad-1920.68eba6fc.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-2-72h-26-pad-1200.68eba6fc.webp"
  },
  "/assets/projets/72h-cj-2026/Chronogramme Jour 3 72h 26 PAD.png": {
    width: 2480,
    height: 3508,
    aspectRatio: 0.707,
    hash: "1305cfc5",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-3-72h-26-pad-480.1305cfc5.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-3-72h-26-pad-800.1305cfc5.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-3-72h-26-pad-1200.1305cfc5.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-3-72h-26-pad-1920.1305cfc5.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/chronogramme-jour-3-72h-26-pad-1200.1305cfc5.webp"
  },
  "/assets/projets/72h-cj-2026/Cover Rapport d'Activit\xE9s 72H 2026.png": {
    width: 2480,
    height: 3508,
    aspectRatio: 0.707,
    hash: "7a2f93e2",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/cover-rapport-d-activites-72h-2026-480.7a2f93e2.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/cover-rapport-d-activites-72h-2026-800.7a2f93e2.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/cover-rapport-d-activites-72h-2026-1200.7a2f93e2.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/cover-rapport-d-activites-72h-2026-1920.7a2f93e2.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/cover-rapport-d-activites-72h-2026-1200.7a2f93e2.webp"
  },
  "/assets/projets/72h-cj-2026/Final des Comp\xE9titions v1.png": {
    width: 3080,
    height: 3080,
    aspectRatio: 1,
    hash: "34490be0",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/final-des-competitions-v1-480.34490be0.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/final-des-competitions-v1-800.34490be0.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/final-des-competitions-v1-1200.34490be0.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/final-des-competitions-v1-1920.34490be0.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/final-des-competitions-v1-1200.34490be0.webp"
  },
  "/assets/projets/72h-cj-2026/LOGOTYPE 72H.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "0215bb03",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/logotype-72h-480.0215bb03.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/logotype-72h-800.0215bb03.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/logotype-72h-1200.0215bb03.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/logotype-72h-1920.0215bb03.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/logotype-72h-1200.0215bb03.webp"
  },
  "/assets/projets/72h-cj-2026/R\xE9capitulatif Chronogramme 72heures.png": {
    width: 2480,
    height: 3508,
    aspectRatio: 0.707,
    hash: "59ed8e6c",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/recapitulatif-chronogramme-72heures-480.59ed8e6c.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/recapitulatif-chronogramme-72heures-800.59ed8e6c.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/recapitulatif-chronogramme-72heures-1200.59ed8e6c.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/recapitulatif-chronogramme-72heures-1920.59ed8e6c.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/recapitulatif-chronogramme-72heures-1200.59ed8e6c.webp"
  },
  "/assets/projets/72h-cj-2026/Stands disponibles 72h 2026.png": {
    width: 3080,
    height: 3080,
    aspectRatio: 1,
    hash: "c0d08bf0",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/stands-disponibles-72h-2026-480.c0d08bf0.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/stands-disponibles-72h-2026-800.c0d08bf0.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/stands-disponibles-72h-2026-1200.c0d08bf0.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/stands-disponibles-72h-2026-1920.c0d08bf0.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/stands-disponibles-72h-2026-1200.c0d08bf0.webp"
  },
  "/assets/projets/72h-cj-2026/Visuel Prix Pazouknam Ouedraogo v2.png": {
    width: 3080,
    height: 3080,
    aspectRatio: 1,
    hash: "275e78ab",
    variants: {
      "480": "/assets/optimized/projets/72h-cj-2026/visuel-prix-pazouknam-ouedraogo-v2-480.275e78ab.webp",
      "800": "/assets/optimized/projets/72h-cj-2026/visuel-prix-pazouknam-ouedraogo-v2-800.275e78ab.webp",
      "1200": "/assets/optimized/projets/72h-cj-2026/visuel-prix-pazouknam-ouedraogo-v2-1200.275e78ab.webp",
      "1920": "/assets/optimized/projets/72h-cj-2026/visuel-prix-pazouknam-ouedraogo-v2-1920.275e78ab.webp"
    },
    fallback: "/assets/optimized/projets/72h-cj-2026/visuel-prix-pazouknam-ouedraogo-v2-1200.275e78ab.webp"
  },
  "/assets/projets/bang/App Icon bang.png": {
    width: 1368,
    height: 1058,
    aspectRatio: 1.293,
    hash: "eee88140",
    variants: {
      "480": "/assets/optimized/projets/bang/app-icon-bang-480.eee88140.webp",
      "800": "/assets/optimized/projets/bang/app-icon-bang-800.eee88140.webp",
      "1200": "/assets/optimized/projets/bang/app-icon-bang-1200.eee88140.webp"
    },
    fallback: "/assets/optimized/projets/bang/app-icon-bang-1200.eee88140.webp"
  },
  "/assets/projets/bang/bang Motifs_bang.png": {
    width: 1080,
    height: 1080,
    aspectRatio: 1,
    hash: "7a0485c2",
    variants: {
      "480": "/assets/optimized/projets/bang/bang-motifs_bang-480.7a0485c2.webp",
      "800": "/assets/optimized/projets/bang/bang-motifs_bang-800.7a0485c2.webp"
    },
    fallback: "/assets/optimized/projets/bang/bang-motifs_bang-800.7a0485c2.webp"
  },
  "/assets/projets/bang/explain_bang.png": {
    width: 1080,
    height: 1080,
    aspectRatio: 1,
    hash: "8cf35989",
    variants: {
      "480": "/assets/optimized/projets/bang/explain_bang-480.8cf35989.webp",
      "800": "/assets/optimized/projets/bang/explain_bang-800.8cf35989.webp"
    },
    fallback: "/assets/optimized/projets/bang/explain_bang-800.8cf35989.webp"
  },
  "/assets/projets/bang/Horizontal_bang.png": {
    width: 1080,
    height: 1080,
    aspectRatio: 1,
    hash: "7fa7336e",
    variants: {
      "480": "/assets/optimized/projets/bang/horizontal_bang-480.7fa7336e.webp",
      "800": "/assets/optimized/projets/bang/horizontal_bang-800.7fa7336e.webp"
    },
    fallback: "/assets/optimized/projets/bang/horizontal_bang-800.7fa7336e.webp"
  },
  "/assets/projets/bang/Lanyard_ID_badge_bang_1.png": {
    width: 3500,
    height: 2625,
    aspectRatio: 1.3333,
    hash: "f52fb0a3",
    variants: {
      "480": "/assets/optimized/projets/bang/lanyard_id_badge_bang_1-480.f52fb0a3.webp",
      "800": "/assets/optimized/projets/bang/lanyard_id_badge_bang_1-800.f52fb0a3.webp",
      "1200": "/assets/optimized/projets/bang/lanyard_id_badge_bang_1-1200.f52fb0a3.webp",
      "1920": "/assets/optimized/projets/bang/lanyard_id_badge_bang_1-1920.f52fb0a3.webp"
    },
    fallback: "/assets/optimized/projets/bang/lanyard_id_badge_bang_1-1200.f52fb0a3.webp"
  },
  "/assets/projets/bang/Orangebang_logo.png": {
    width: 903,
    height: 427,
    aspectRatio: 2.1148,
    hash: "034d805f",
    variants: {
      "480": "/assets/optimized/projets/bang/orangebang_logo-480.034d805f.webp",
      "800": "/assets/optimized/projets/bang/orangebang_logo-800.034d805f.webp"
    },
    fallback: "/assets/optimized/projets/bang/orangebang_logo-800.034d805f.webp"
  },
  "/assets/projets/bang/Plan de travail 1 copie 3_bang.png": {
    width: 1080,
    height: 1080,
    aspectRatio: 1,
    hash: "cb71094f",
    variants: {
      "480": "/assets/optimized/projets/bang/plan-de-travail-1-copie-3_bang-480.cb71094f.webp",
      "800": "/assets/optimized/projets/bang/plan-de-travail-1-copie-3_bang-800.cb71094f.webp"
    },
    fallback: "/assets/optimized/projets/bang/plan-de-travail-1-copie-3_bang-800.cb71094f.webp"
  },
  "/assets/projets/bang/Polo Shirt on Mannequin bang koko donda sans col.png": {
    width: 4500,
    height: 3e3,
    aspectRatio: 1.5,
    hash: "6c19d0f5",
    variants: {
      "480": "/assets/optimized/projets/bang/polo-shirt-on-mannequin-bang-koko-donda-sans-col-480.6c19d0f5.webp",
      "800": "/assets/optimized/projets/bang/polo-shirt-on-mannequin-bang-koko-donda-sans-col-800.6c19d0f5.webp",
      "1200": "/assets/optimized/projets/bang/polo-shirt-on-mannequin-bang-koko-donda-sans-col-1200.6c19d0f5.webp",
      "1920": "/assets/optimized/projets/bang/polo-shirt-on-mannequin-bang-koko-donda-sans-col-1920.6c19d0f5.webp"
    },
    fallback: "/assets/optimized/projets/bang/polo-shirt-on-mannequin-bang-koko-donda-sans-col-1200.6c19d0f5.webp"
  },
  "/assets/projets/bang/Pr\xE9sentation_bang_logo.png": {
    width: 596,
    height: 1089,
    aspectRatio: 0.5473,
    hash: "e9d60af1",
    variants: {
      "480": "/assets/optimized/projets/bang/presentation_bang_logo-480.e9d60af1.webp",
      "800": "/assets/optimized/projets/bang/presentation_bang_logo-800.e9d60af1.webp"
    },
    fallback: "/assets/optimized/projets/bang/presentation_bang_logo-800.e9d60af1.webp"
  },
  "/assets/projets/bang/sky billboard bang.png": {
    width: 4e3,
    height: 2667,
    aspectRatio: 1.4998,
    hash: "9ac72a79",
    variants: {
      "480": "/assets/optimized/projets/bang/sky-billboard-bang-480.9ac72a79.webp",
      "800": "/assets/optimized/projets/bang/sky-billboard-bang-800.9ac72a79.webp",
      "1200": "/assets/optimized/projets/bang/sky-billboard-bang-1200.9ac72a79.webp",
      "1920": "/assets/optimized/projets/bang/sky-billboard-bang-1920.9ac72a79.webp"
    },
    fallback: "/assets/optimized/projets/bang/sky-billboard-bang-1200.9ac72a79.webp"
  },
  "/assets/projets/bang/SUBWAY LED BILLBOARD bang.png": {
    width: 4e3,
    height: 3e3,
    aspectRatio: 1.3333,
    hash: "2accd520",
    variants: {
      "480": "/assets/optimized/projets/bang/subway-led-billboard-bang-480.2accd520.webp",
      "800": "/assets/optimized/projets/bang/subway-led-billboard-bang-800.2accd520.webp",
      "1200": "/assets/optimized/projets/bang/subway-led-billboard-bang-1200.2accd520.webp",
      "1920": "/assets/optimized/projets/bang/subway-led-billboard-bang-1920.2accd520.webp"
    },
    fallback: "/assets/optimized/projets/bang/subway-led-billboard-bang-1200.2accd520.webp"
  },
  "/assets/projets/bang/symbol_bang.png": {
    width: 1080,
    height: 1080,
    aspectRatio: 1,
    hash: "3b702768",
    variants: {
      "480": "/assets/optimized/projets/bang/symbol_bang-480.3b702768.webp",
      "800": "/assets/optimized/projets/bang/symbol_bang-800.3b702768.webp"
    },
    fallback: "/assets/optimized/projets/bang/symbol_bang-800.3b702768.webp"
  },
  "/assets/projets/bang/Vertbang_logo.png": {
    width: 903,
    height: 427,
    aspectRatio: 2.1148,
    hash: "2420bcc2",
    variants: {
      "480": "/assets/optimized/projets/bang/vertbang_logo-480.2420bcc2.webp",
      "800": "/assets/optimized/projets/bang/vertbang_logo-800.2420bcc2.webp"
    },
    fallback: "/assets/optimized/projets/bang/vertbang_logo-800.2420bcc2.webp"
  },
  "/assets/projets/cafe-inspire/01_Caf\xE9 Pyramide v3.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "18e19922",
    variants: {
      "480": "/assets/optimized/projets/cafe-inspire/01_cafe-pyramide-v3-480.18e19922.webp",
      "800": "/assets/optimized/projets/cafe-inspire/01_cafe-pyramide-v3-800.18e19922.webp",
      "1200": "/assets/optimized/projets/cafe-inspire/01_cafe-pyramide-v3-1200.18e19922.webp",
      "1920": "/assets/optimized/projets/cafe-inspire/01_cafe-pyramide-v3-1920.18e19922.webp"
    },
    fallback: "/assets/optimized/projets/cafe-inspire/01_cafe-pyramide-v3-1200.18e19922.webp"
  },
  "/assets/projets/cafe-inspire/02_Caf\xE9 Pyramide v2.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "94b21267",
    variants: {
      "480": "/assets/optimized/projets/cafe-inspire/02_cafe-pyramide-v2-480.94b21267.webp",
      "800": "/assets/optimized/projets/cafe-inspire/02_cafe-pyramide-v2-800.94b21267.webp",
      "1200": "/assets/optimized/projets/cafe-inspire/02_cafe-pyramide-v2-1200.94b21267.webp",
      "1920": "/assets/optimized/projets/cafe-inspire/02_cafe-pyramide-v2-1920.94b21267.webp"
    },
    fallback: "/assets/optimized/projets/cafe-inspire/02_cafe-pyramide-v2-1200.94b21267.webp"
  },
  "/assets/projets/cafe-inspire/03_Anniversaire_Caf\xE9_Inspire_v2.1.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "d8a2a2ac",
    variants: {
      "480": "/assets/optimized/projets/cafe-inspire/03_anniversaire_cafe_inspire_v2-1-480.d8a2a2ac.webp",
      "800": "/assets/optimized/projets/cafe-inspire/03_anniversaire_cafe_inspire_v2-1-800.d8a2a2ac.webp",
      "1200": "/assets/optimized/projets/cafe-inspire/03_anniversaire_cafe_inspire_v2-1-1200.d8a2a2ac.webp",
      "1920": "/assets/optimized/projets/cafe-inspire/03_anniversaire_cafe_inspire_v2-1-1920.d8a2a2ac.webp"
    },
    fallback: "/assets/optimized/projets/cafe-inspire/03_anniversaire_cafe_inspire_v2-1-1200.d8a2a2ac.webp"
  },
  "/assets/projets/cafe-inspire/04_Livraison_Gratuite_Mercredi_Caf\xE9 Inspire v2.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "88d8da16",
    variants: {
      "480": "/assets/optimized/projets/cafe-inspire/04_livraison_gratuite_mercredi_cafe-inspire-v2-480.88d8da16.webp",
      "800": "/assets/optimized/projets/cafe-inspire/04_livraison_gratuite_mercredi_cafe-inspire-v2-800.88d8da16.webp",
      "1200": "/assets/optimized/projets/cafe-inspire/04_livraison_gratuite_mercredi_cafe-inspire-v2-1200.88d8da16.webp",
      "1920": "/assets/optimized/projets/cafe-inspire/04_livraison_gratuite_mercredi_cafe-inspire-v2-1920.88d8da16.webp"
    },
    fallback: "/assets/optimized/projets/cafe-inspire/04_livraison_gratuite_mercredi_cafe-inspire-v2-1200.88d8da16.webp"
  },
  "/assets/projets/cafe-inspire/05_Bon_Mois_Septembre v2.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "821d603a",
    variants: {
      "480": "/assets/optimized/projets/cafe-inspire/05_bon_mois_septembre-v2-480.821d603a.webp",
      "800": "/assets/optimized/projets/cafe-inspire/05_bon_mois_septembre-v2-800.821d603a.webp",
      "1200": "/assets/optimized/projets/cafe-inspire/05_bon_mois_septembre-v2-1200.821d603a.webp",
      "1920": "/assets/optimized/projets/cafe-inspire/05_bon_mois_septembre-v2-1920.821d603a.webp"
    },
    fallback: "/assets/optimized/projets/cafe-inspire/05_bon_mois_septembre-v2-1200.821d603a.webp"
  },
  "/assets/projets/cafe-inspire/06_Tacos_Caf\xE9_Inspire v2.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "e5bd0275",
    variants: {
      "480": "/assets/optimized/projets/cafe-inspire/06_tacos_cafe_inspire-v2-480.e5bd0275.webp",
      "800": "/assets/optimized/projets/cafe-inspire/06_tacos_cafe_inspire-v2-800.e5bd0275.webp",
      "1200": "/assets/optimized/projets/cafe-inspire/06_tacos_cafe_inspire-v2-1200.e5bd0275.webp",
      "1920": "/assets/optimized/projets/cafe-inspire/06_tacos_cafe_inspire-v2-1920.e5bd0275.webp"
    },
    fallback: "/assets/optimized/projets/cafe-inspire/06_tacos_cafe_inspire-v2-1200.e5bd0275.webp"
  },
  "/assets/projets/cafe-inspire/07_Hiring_AideChef.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "7e1d7ceb",
    variants: {
      "480": "/assets/optimized/projets/cafe-inspire/07_hiring_aidechef-480.7e1d7ceb.webp",
      "800": "/assets/optimized/projets/cafe-inspire/07_hiring_aidechef-800.7e1d7ceb.webp",
      "1200": "/assets/optimized/projets/cafe-inspire/07_hiring_aidechef-1200.7e1d7ceb.webp",
      "1920": "/assets/optimized/projets/cafe-inspire/07_hiring_aidechef-1920.7e1d7ceb.webp"
    },
    fallback: "/assets/optimized/projets/cafe-inspire/07_hiring_aidechef-1200.7e1d7ceb.webp"
  },
  "/assets/projets/cafe-inspire/08_Nouveau_Plat_Caf\xE9 Inspire.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "d76aeaac",
    variants: {
      "480": "/assets/optimized/projets/cafe-inspire/08_nouveau_plat_cafe-inspire-480.d76aeaac.webp",
      "800": "/assets/optimized/projets/cafe-inspire/08_nouveau_plat_cafe-inspire-800.d76aeaac.webp",
      "1200": "/assets/optimized/projets/cafe-inspire/08_nouveau_plat_cafe-inspire-1200.d76aeaac.webp",
      "1920": "/assets/optimized/projets/cafe-inspire/08_nouveau_plat_cafe-inspire-1920.d76aeaac.webp"
    },
    fallback: "/assets/optimized/projets/cafe-inspire/08_nouveau_plat_cafe-inspire-1200.d76aeaac.webp"
  },
  "/assets/projets/mon-frere-parle/Certification Mockup MFP.png": {
    width: 3e3,
    height: 2e3,
    aspectRatio: 1.5,
    hash: "c8274bc6",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/certification-mockup-mfp-480.c8274bc6.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/certification-mockup-mfp-800.c8274bc6.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/certification-mockup-mfp-1200.c8274bc6.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/certification-mockup-mfp-1920.c8274bc6.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/certification-mockup-mfp-1200.c8274bc6.webp"
  },
  "/assets/projets/mon-frere-parle/instagram post mockup MFP.png": {
    width: 2250,
    height: 1530,
    aspectRatio: 1.4706,
    hash: "dce4ebe6",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/instagram-post-mockup-mfp-480.dce4ebe6.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/instagram-post-mockup-mfp-800.dce4ebe6.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/instagram-post-mockup-mfp-1200.dce4ebe6.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/instagram-post-mockup-mfp-1920.dce4ebe6.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/instagram-post-mockup-mfp-1200.dce4ebe6.webp"
  },
  "/assets/projets/mon-frere-parle/Logotype_v1_mon_fr\xE8re_parle.png": {
    width: 1080,
    height: 1080,
    aspectRatio: 1,
    hash: "cfb5b526",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/logotype_v1_mon_frere_parle-480.cfb5b526.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/logotype_v1_mon_frere_parle-800.cfb5b526.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/logotype_v1_mon_frere_parle-800.cfb5b526.webp"
  },
  "/assets/projets/mon-frere-parle/MFP_HandCardMockup.png": {
    width: 3e3,
    height: 3500,
    aspectRatio: 0.8571,
    hash: "25a074e9",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mfp_handcardmockup-480.25a074e9.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mfp_handcardmockup-800.25a074e9.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mfp_handcardmockup-1200.25a074e9.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mfp_handcardmockup-1920.25a074e9.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mfp_handcardmockup-1200.25a074e9.webp"
  },
  "/assets/projets/mon-frere-parle/MFP_OutdoorPosterMockup004.png": {
    width: 4608,
    height: 3072,
    aspectRatio: 1.5,
    hash: "12496936",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mfp_outdoorpostermockup004-480.12496936.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mfp_outdoorpostermockup004-800.12496936.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mfp_outdoorpostermockup004-1200.12496936.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mfp_outdoorpostermockup004-1920.12496936.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mfp_outdoorpostermockup004-1200.12496936.webp"
  },
  "/assets/projets/mon-frere-parle/MFP_PostCardMockup.png": {
    width: 4e3,
    height: 2670,
    aspectRatio: 1.4981,
    hash: "f2b95ab7",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mfp_postcardmockup-480.f2b95ab7.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mfp_postcardmockup-800.f2b95ab7.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mfp_postcardmockup-1200.f2b95ab7.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mfp_postcardmockup-1920.f2b95ab7.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mfp_postcardmockup-1200.f2b95ab7.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Chroogramme_v2.jpg": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "6f541893",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_chroogramme_v2-480.6f541893.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_chroogramme_v2-800.6f541893.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_chroogramme_v2-1200.6f541893.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_chroogramme_v2-1920.6f541893.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_chroogramme_v2-1200.6f541893.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Coming_soon_0.jpg": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "9a811892",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_0-480.9a811892.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_0-800.9a811892.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_0-1200.9a811892.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_0-1920.9a811892.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_0-1200.9a811892.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Coming_soon_2.jpg": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "65b30e34",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_2-480.65b30e34.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_2-800.65b30e34.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_2-1200.65b30e34.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_2-1920.65b30e34.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_2-1200.65b30e34.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Coming_soon_3.jpg": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "c2d8f689",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_3-480.c2d8f689.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_3-800.c2d8f689.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_3-1200.c2d8f689.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_3-1920.c2d8f689.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_coming_soon_3-1200.c2d8f689.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_D\xE9compte.jpg": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "d38f5602",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_decompte-480.d38f5602.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_decompte-800.d38f5602.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_decompte-1200.d38f5602.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_decompte-1920.d38f5602.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_decompte-1200.d38f5602.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Invitation.jpg": {
    width: 3840,
    height: 2160,
    aspectRatio: 1.7778,
    hash: "d31f0d8b",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_invitation-480.d31f0d8b.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_invitation-800.d31f0d8b.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_invitation-1200.d31f0d8b.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_invitation-1920.d31f0d8b.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_invitation-1200.d31f0d8b.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Invit\xE9_Sp\xE9cial.jpg": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "e7ffe037",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_invite_special-480.e7ffe037.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_invite_special-800.e7ffe037.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_invite_special-1200.e7ffe037.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_invite_special-1920.e7ffe037.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_invite_special-1200.e7ffe037.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Objectif.jpg": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "0279d3f6",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_objectif-480.0279d3f6.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_objectif-800.0279d3f6.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_objectif-1200.0279d3f6.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_objectif-1920.0279d3f6.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_objectif-1200.0279d3f6.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Thanks_FANKANI.jpg": {
    width: 3840,
    height: 2160,
    aspectRatio: 1.7778,
    hash: "517a9210",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_thanks_fankani-480.517a9210.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_thanks_fankani-800.517a9210.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_thanks_fankani-1200.517a9210.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_thanks_fankani-1920.517a9210.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_thanks_fankani-1200.517a9210.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_T\xE9moignage.jpg": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "d4414a1f",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_temoignage-480.d4414a1f.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_temoignage-800.d4414a1f.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_temoignage-1200.d4414a1f.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_temoignage-1920.d4414a1f.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_temoignage-1200.d4414a1f.webp"
  },
  "/assets/projets/mon-frere-parle/Mon_Fr\xE8re_Parle_Visuel_Principal.jpg": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "98b7a6ff",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_visuel_principal-480.98b7a6ff.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_visuel_principal-800.98b7a6ff.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_visuel_principal-1200.98b7a6ff.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_visuel_principal-1920.98b7a6ff.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/mon_frere_parle_visuel_principal-1200.98b7a6ff.webp"
  },
  "/assets/projets/mon-frere-parle/Teaser Instagram Post Mockup MFP.png": {
    width: 4500,
    height: 3e3,
    aspectRatio: 1.5,
    hash: "8b1cc5c1",
    variants: {
      "480": "/assets/optimized/projets/mon-frere-parle/teaser-instagram-post-mockup-mfp-480.8b1cc5c1.webp",
      "800": "/assets/optimized/projets/mon-frere-parle/teaser-instagram-post-mockup-mfp-800.8b1cc5c1.webp",
      "1200": "/assets/optimized/projets/mon-frere-parle/teaser-instagram-post-mockup-mfp-1200.8b1cc5c1.webp",
      "1920": "/assets/optimized/projets/mon-frere-parle/teaser-instagram-post-mockup-mfp-1920.8b1cc5c1.webp"
    },
    fallback: "/assets/optimized/projets/mon-frere-parle/teaser-instagram-post-mockup-mfp-1200.8b1cc5c1.webp"
  },
  "/assets/projets/off-day/24 Off Day logo design.png": {
    width: 612,
    height: 408,
    aspectRatio: 1.5,
    hash: "77adcbf0",
    variants: {
      "480": "/assets/optimized/projets/off-day/24-off-day-logo-design-480.77adcbf0.webp",
      "800": "/assets/optimized/projets/off-day/24-off-day-logo-design-800.77adcbf0.webp"
    },
    fallback: "/assets/optimized/projets/off-day/24-off-day-logo-design-800.77adcbf0.webp"
  },
  "/assets/projets/off-day/Banni\xE8re_Facebook_OffDay.png": {
    width: 1640,
    height: 924,
    aspectRatio: 1.7749,
    hash: "f7e08f7a",
    variants: {
      "480": "/assets/optimized/projets/off-day/banniere_facebook_offday-480.f7e08f7a.webp",
      "800": "/assets/optimized/projets/off-day/banniere_facebook_offday-800.f7e08f7a.webp",
      "1200": "/assets/optimized/projets/off-day/banniere_facebook_offday-1200.f7e08f7a.webp"
    },
    fallback: "/assets/optimized/projets/off-day/banniere_facebook_offday-1200.f7e08f7a.webp"
  },
  "/assets/projets/off-day/Invitation_Off_Day RECTO.png": {
    width: 874,
    height: 1240,
    aspectRatio: 0.7048,
    hash: "d339cdbf",
    variants: {
      "480": "/assets/optimized/projets/off-day/invitation_off_day-recto-480.d339cdbf.webp",
      "800": "/assets/optimized/projets/off-day/invitation_off_day-recto-800.d339cdbf.webp"
    },
    fallback: "/assets/optimized/projets/off-day/invitation_off_day-recto-800.d339cdbf.webp"
  },
  "/assets/projets/off-day/Invitation_Off_Day VERSO.png": {
    width: 874,
    height: 1240,
    aspectRatio: 0.7048,
    hash: "8a59f4c7",
    variants: {
      "480": "/assets/optimized/projets/off-day/invitation_off_day-verso-480.8a59f4c7.webp",
      "800": "/assets/optimized/projets/off-day/invitation_off_day-verso-800.8a59f4c7.webp"
    },
    fallback: "/assets/optimized/projets/off-day/invitation_off_day-verso-800.8a59f4c7.webp"
  },
  "/assets/projets/off-day/Off_Day_Coming_Soon_2_v2.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "0d931fd4",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_coming_soon_2_v2-480.0d931fd4.webp",
      "800": "/assets/optimized/projets/off-day/off_day_coming_soon_2_v2-800.0d931fd4.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_coming_soon_2_v2-1200.0d931fd4.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_coming_soon_2_v2-1920.0d931fd4.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_coming_soon_2_v2-1200.0d931fd4.webp"
  },
  "/assets/projets/off-day/Off_Day_Coming_Soon_3.2.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "78169996",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_coming_soon_3-2-480.78169996.webp",
      "800": "/assets/optimized/projets/off-day/off_day_coming_soon_3-2-800.78169996.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_coming_soon_3-2-1200.78169996.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_coming_soon_3-2-1920.78169996.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_coming_soon_3-2-1200.78169996.webp"
  },
  "/assets/projets/off-day/Off_Day_Coming_Soon_v2.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "2102d44e",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_coming_soon_v2-480.2102d44e.webp",
      "800": "/assets/optimized/projets/off-day/off_day_coming_soon_v2-800.2102d44e.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_coming_soon_v2-1200.2102d44e.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_coming_soon_v2-1920.2102d44e.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_coming_soon_v2-1200.2102d44e.webp"
  },
  "/assets/projets/off-day/Off_Day_Flyer_Recto.png": {
    width: 1748,
    height: 2480,
    aspectRatio: 0.7048,
    hash: "3c80b517",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_flyer_recto-480.3c80b517.webp",
      "800": "/assets/optimized/projets/off-day/off_day_flyer_recto-800.3c80b517.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_flyer_recto-1200.3c80b517.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_flyer_recto-1200.3c80b517.webp"
  },
  "/assets/projets/off-day/Off_Day_Flyer_Verso.png": {
    width: 1748,
    height: 2480,
    aspectRatio: 0.7048,
    hash: "85cc01f6",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_flyer_verso-480.85cc01f6.webp",
      "800": "/assets/optimized/projets/off-day/off_day_flyer_verso-800.85cc01f6.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_flyer_verso-1200.85cc01f6.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_flyer_verso-1200.85cc01f6.webp"
  },
  "/assets/projets/off-day/Off_Day_Invisibilit\xE9_D\xE9fi.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "688bd8be",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_invisibilite_defi-480.688bd8be.webp",
      "800": "/assets/optimized/projets/off-day/off_day_invisibilite_defi-800.688bd8be.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_invisibilite_defi-1200.688bd8be.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_invisibilite_defi-1920.688bd8be.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_invisibilite_defi-1200.688bd8be.webp"
  },
  "/assets/projets/off-day/Off_Day_Invisibilit\xE9_Teaser.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "26e5211c",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_invisibilite_teaser-480.26e5211c.webp",
      "800": "/assets/optimized/projets/off-day/off_day_invisibilite_teaser-800.26e5211c.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_invisibilite_teaser-1200.26e5211c.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_invisibilite_teaser-1920.26e5211c.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_invisibilite_teaser-1200.26e5211c.webp"
  },
  "/assets/projets/off-day/Off_Day_Mode_Snooz_v2.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "146c9baa",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_mode_snooz_v2-480.146c9baa.webp",
      "800": "/assets/optimized/projets/off-day/off_day_mode_snooz_v2-800.146c9baa.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_mode_snooz_v2-1200.146c9baa.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_mode_snooz_v2-1920.146c9baa.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_mode_snooz_v2-1200.146c9baa.webp"
  },
  "/assets/projets/off-day/Off_Day_Movie_Night_14th_v2.2.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "234861cd",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_movie_night_14th_v2-2-480.234861cd.webp",
      "800": "/assets/optimized/projets/off-day/off_day_movie_night_14th_v2-2-800.234861cd.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_movie_night_14th_v2-2-1200.234861cd.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_movie_night_14th_v2-2-1920.234861cd.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_movie_night_14th_v2-2-1200.234861cd.webp"
  },
  "/assets/projets/off-day/Off_Day_Plaidoirie_v3.6.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "1701ca9c",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_plaidoirie_v3-6-480.1701ca9c.webp",
      "800": "/assets/optimized/projets/off-day/off_day_plaidoirie_v3-6-800.1701ca9c.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_plaidoirie_v3-6-1200.1701ca9c.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_plaidoirie_v3-6-1920.1701ca9c.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_plaidoirie_v3-6-1200.1701ca9c.webp"
  },
  "/assets/projets/off-day/Off_Day_Plaidorie_Modalit\xE9s_v2.png": {
    width: 2160,
    height: 3e3,
    aspectRatio: 0.72,
    hash: "71d26a7e",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_plaidorie_modalites_v2-480.71d26a7e.webp",
      "800": "/assets/optimized/projets/off-day/off_day_plaidorie_modalites_v2-800.71d26a7e.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_plaidorie_modalites_v2-1200.71d26a7e.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_plaidorie_modalites_v2-1920.71d26a7e.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_plaidorie_modalites_v2-1200.71d26a7e.webp"
  },
  "/assets/projets/off-day/Off_Day_Quiz_Teaser.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "07c2d9eb",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_quiz_teaser-480.07c2d9eb.webp",
      "800": "/assets/optimized/projets/off-day/off_day_quiz_teaser-800.07c2d9eb.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_quiz_teaser-1200.07c2d9eb.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_quiz_teaser-1920.07c2d9eb.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_quiz_teaser-1200.07c2d9eb.webp"
  },
  "/assets/projets/off-day/Off_Day_Soir\xE9e_Cin\xE9.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "08fabd8c",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_soiree_cine-480.08fabd8c.webp",
      "800": "/assets/optimized/projets/off-day/off_day_soiree_cine-800.08fabd8c.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_soiree_cine-1200.08fabd8c.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_soiree_cine-1920.08fabd8c.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_soiree_cine-1200.08fabd8c.webp"
  },
  "/assets/projets/off-day/Off_Day_StayFree_00.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "32533adf",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_stayfree_00-480.32533adf.webp",
      "800": "/assets/optimized/projets/off-day/off_day_stayfree_00-800.32533adf.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_stayfree_00-1200.32533adf.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_stayfree_00-1920.32533adf.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_stayfree_00-1200.32533adf.webp"
  },
  "/assets/projets/off-day/Off_Day_StayFree_01.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "f17b4bc0",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_stayfree_01-480.f17b4bc0.webp",
      "800": "/assets/optimized/projets/off-day/off_day_stayfree_01-800.f17b4bc0.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_stayfree_01-1200.f17b4bc0.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_stayfree_01-1920.f17b4bc0.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_stayfree_01-1200.f17b4bc0.webp"
  },
  "/assets/projets/off-day/Off_Day_StayFree_02.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "2af51517",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_stayfree_02-480.2af51517.webp",
      "800": "/assets/optimized/projets/off-day/off_day_stayfree_02-800.2af51517.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_stayfree_02-1200.2af51517.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_stayfree_02-1920.2af51517.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_stayfree_02-1200.2af51517.webp"
  },
  "/assets/projets/off-day/Off_Day_StayFree_03.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "0fda0e5c",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_stayfree_03-480.0fda0e5c.webp",
      "800": "/assets/optimized/projets/off-day/off_day_stayfree_03-800.0fda0e5c.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_stayfree_03-1200.0fda0e5c.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_stayfree_03-1920.0fda0e5c.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_stayfree_03-1200.0fda0e5c.webp"
  },
  "/assets/projets/off-day/Off_Day_StayFree_04.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "5b6f90fa",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_stayfree_04-480.5b6f90fa.webp",
      "800": "/assets/optimized/projets/off-day/off_day_stayfree_04-800.5b6f90fa.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_stayfree_04-1200.5b6f90fa.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_stayfree_04-1920.5b6f90fa.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_stayfree_04-1200.5b6f90fa.webp"
  },
  "/assets/projets/off-day/Off_Day_Visual_v2.2 Corrig\xE9.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "f86bbb9f",
    variants: {
      "480": "/assets/optimized/projets/off-day/off_day_visual_v2-2-corrige-480.f86bbb9f.webp",
      "800": "/assets/optimized/projets/off-day/off_day_visual_v2-2-corrige-800.f86bbb9f.webp",
      "1200": "/assets/optimized/projets/off-day/off_day_visual_v2-2-corrige-1200.f86bbb9f.webp",
      "1920": "/assets/optimized/projets/off-day/off_day_visual_v2-2-corrige-1920.f86bbb9f.webp"
    },
    fallback: "/assets/optimized/projets/off-day/off_day_visual_v2-2-corrige-1200.f86bbb9f.webp"
  },
  "/assets/projets/off-day/Profis_Quiz_OffDay_La_Consciente.png": {
    width: 1080,
    height: 1350,
    aspectRatio: 0.8,
    hash: "20855510",
    variants: {
      "480": "/assets/optimized/projets/off-day/profis_quiz_offday_la_consciente-480.20855510.webp",
      "800": "/assets/optimized/projets/off-day/profis_quiz_offday_la_consciente-800.20855510.webp"
    },
    fallback: "/assets/optimized/projets/off-day/profis_quiz_offday_la_consciente-800.20855510.webp"
  },
  "/assets/projets/off-day/Profis_Quiz_OffDay_La_Fragile.png": {
    width: 1080,
    height: 1350,
    aspectRatio: 0.8,
    hash: "7b93be5e",
    variants: {
      "480": "/assets/optimized/projets/off-day/profis_quiz_offday_la_fragile-480.7b93be5e.webp",
      "800": "/assets/optimized/projets/off-day/profis_quiz_offday_la_fragile-800.7b93be5e.webp"
    },
    fallback: "/assets/optimized/projets/off-day/profis_quiz_offday_la_fragile-800.7b93be5e.webp"
  },
  "/assets/projets/off-day/Profis_Quiz_OffDay_La_Zombie_connectee.png": {
    width: 1080,
    height: 1350,
    aspectRatio: 0.8,
    hash: "57c7da7e",
    variants: {
      "480": "/assets/optimized/projets/off-day/profis_quiz_offday_la_zombie_connectee-480.57c7da7e.webp",
      "800": "/assets/optimized/projets/off-day/profis_quiz_offday_la_zombie_connectee-800.57c7da7e.webp"
    },
    fallback: "/assets/optimized/projets/off-day/profis_quiz_offday_la_zombie_connectee-800.57c7da7e.webp"
  },
  "/assets/projets/off-day/Profis_Quiz_OffDay_Le_Conscient.png": {
    width: 1080,
    height: 1350,
    aspectRatio: 0.8,
    hash: "ab5cfc3f",
    variants: {
      "480": "/assets/optimized/projets/off-day/profis_quiz_offday_le_conscient-480.ab5cfc3f.webp",
      "800": "/assets/optimized/projets/off-day/profis_quiz_offday_le_conscient-800.ab5cfc3f.webp"
    },
    fallback: "/assets/optimized/projets/off-day/profis_quiz_offday_le_conscient-800.ab5cfc3f.webp"
  },
  "/assets/projets/off-day/Profis_Quiz_OffDay_Le_Fragile.png": {
    width: 1080,
    height: 1350,
    aspectRatio: 0.8,
    hash: "c77f0e57",
    variants: {
      "480": "/assets/optimized/projets/off-day/profis_quiz_offday_le_fragile-480.c77f0e57.webp",
      "800": "/assets/optimized/projets/off-day/profis_quiz_offday_le_fragile-800.c77f0e57.webp"
    },
    fallback: "/assets/optimized/projets/off-day/profis_quiz_offday_le_fragile-800.c77f0e57.webp"
  },
  "/assets/projets/off-day/Profis_Quiz_OffDay_Le_Zombie_connecte.png": {
    width: 1080,
    height: 1350,
    aspectRatio: 0.8,
    hash: "f1b24567",
    variants: {
      "480": "/assets/optimized/projets/off-day/profis_quiz_offday_le_zombie_connecte-480.f1b24567.webp",
      "800": "/assets/optimized/projets/off-day/profis_quiz_offday_le_zombie_connecte-800.f1b24567.webp"
    },
    fallback: "/assets/optimized/projets/off-day/profis_quiz_offday_le_zombie_connecte-800.f1b24567.webp"
  },
  "/assets/projets/off-day/R\xE9seaux_Sociaux_Conf\xE9rence_Presse_Off_Day_v2.2.png": {
    width: 2e3,
    height: 2e3,
    aspectRatio: 1,
    hash: "406b2102",
    variants: {
      "480": "/assets/optimized/projets/off-day/reseaux_sociaux_conference_presse_off_day_v2-2-480.406b2102.webp",
      "800": "/assets/optimized/projets/off-day/reseaux_sociaux_conference_presse_off_day_v2-2-800.406b2102.webp",
      "1200": "/assets/optimized/projets/off-day/reseaux_sociaux_conference_presse_off_day_v2-2-1200.406b2102.webp",
      "1920": "/assets/optimized/projets/off-day/reseaux_sociaux_conference_presse_off_day_v2-2-1920.406b2102.webp"
    },
    fallback: "/assets/optimized/projets/off-day/reseaux_sociaux_conference_presse_off_day_v2-2-1200.406b2102.webp"
  }
};

// src/lib/images.ts
var manifest = image_manifest_default;
function normalizeKey(path2) {
  if (!path2) return "";
  return path2.startsWith("/") ? path2 : `/${path2}`;
}
function getOptimizedImage(src, options) {
  if (!src) {
    return { src: "" };
  }
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return { src };
  }
  const key = normalizeKey(src);
  const entry = manifest[key];
  if (!entry) {
    return { src };
  }
  let selectedSrc = entry.fallback;
  if (options?.width) {
    const target = options.width;
    const availableWidths = Object.keys(entry.variants).map(Number).sort((a, b) => a - b);
    const bestWidth = availableWidths.find((w) => w >= target) || availableWidths[availableWidths.length - 1];
    if (bestWidth && entry.variants[String(bestWidth)]) {
      selectedSrc = entry.variants[String(bestWidth)];
    }
  }
  const srcSetParts = Object.entries(entry.variants).sort(([a], [b]) => Number(a) - Number(b)).map(([w, url]) => `${url} ${w}w`);
  const srcSet = srcSetParts.length > 0 ? srcSetParts.join(", ") : void 0;
  return {
    src: selectedSrc,
    srcSet,
    width: entry.width,
    height: entry.height,
    aspectRatio: entry.aspectRatio
  };
}

// src/config/rubriques.ts
var RUBRIQUES = [
  {
    slug: "identite-visuelle",
    name: "Identit\xE9 visuelle",
    description: "Logos, univers graphiques et signatures visuelles de marque.",
    order: 1
  },
  {
    slug: "strategie-de-marque",
    name: "Strat\xE9gie de marque",
    description: "Positionnement, coh\xE9rence de marque et architecture d\u2019image.",
    order: 2
  },
  {
    slug: "reseaux-sociaux",
    name: "R\xE9seaux sociaux",
    description: "Visuels d\u2019impact pour Facebook, Instagram, LinkedIn et engagement.",
    order: 3
  },
  {
    slug: "design-graphique",
    name: "Design graphique",
    description: "Principes de composition, typographie, affiches et supports.",
    order: 4
  },
  {
    slug: "business-conversion",
    name: "Business & conversion",
    description: "Impact commercial, tarification premium et transformation de prospects.",
    order: 5
  }
];
var getRubriqueBySlug = (slug) => {
  if (!slug) return void 0;
  return RUBRIQUES.find((r) => r.slug === slug);
};
var getRubriqueName = (slug) => {
  if (!slug) return "";
  const found = getRubriqueBySlug(slug);
  return found ? found.name : slug;
};
var TAG_TO_RUBRIQUE_MAP = {
  // 1. Identité visuelle
  "identite visuelle": "identite-visuelle",
  "identit\xE9 visuelle": "identite-visuelle",
  "charte graphique": "identite-visuelle",
  "logo": "identite-visuelle",
  "logotype": "identite-visuelle",
  // 2. Stratégie de marque
  "strategie de marque": "strategie-de-marque",
  "strat\xE9gie de marque": "strategie-de-marque",
  "branding": "strategie-de-marque",
  "brand": "strategie-de-marque",
  "image de marque": "strategie-de-marque",
  "coh\xE9rence visuelle": "strategie-de-marque",
  "coherence visuelle": "strategie-de-marque",
  "branding premium": "strategie-de-marque",
  // 3. Réseaux sociaux
  "reseaux sociaux": "reseaux-sociaux",
  "r\xE9seaux sociaux": "reseaux-sociaux",
  "facebook": "reseaux-sociaux",
  "instagram": "reseaux-sociaux",
  "linkedin": "reseaux-sociaux",
  "visibilite": "reseaux-sociaux",
  "visibilit\xE9": "reseaux-sociaux",
  // 4. Design graphique
  "design graphique": "design-graphique",
  "typographie": "design-graphique",
  "graphisme": "design-graphique",
  "affiche": "design-graphique",
  // 5. Business & conversion
  "business": "business-conversion",
  "conversion": "business-conversion",
  "tarifs": "business-conversion",
  "startup": "business-conversion",
  "entrepreneur": "business-conversion"
};
var inferRubriqueFromTags = (tags) => {
  if (!tags || tags.length === 0) return "identite-visuelle";
  for (const tag of tags) {
    const normalized = tag.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (TAG_TO_RUBRIQUE_MAP[normalized]) {
      return TAG_TO_RUBRIQUE_MAP[normalized];
    }
  }
  return "identite-visuelle";
};

// src/lib/projectHelpers.ts
function getProjectAccroche(p) {
  if (p.accroche && p.accroche.trim()) {
    return p.accroche.trim();
  }
  if (p.tagline && p.tagline.trim().length <= 110) {
    return p.tagline.trim();
  }
  const raw = p.clientGoal || p.client_goal || p.tagline || "";
  const clean = raw.trim();
  if (!clean) return "";
  if (clean.length <= 110) return clean;
  const slice = clean.substring(0, 107);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 40 ? slice.substring(0, lastSpace) : slice) + "...";
}

// src/ssr.ts
var supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://mtinydrkpxffrlsuwpzh.supabase.co";
var supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
var fallbackArticles = {
  "identite-visuelle-definition-entrepreneur": {
    title: "Identit\xE9 visuelle : \xE0 quoi sert-elle \xE0 un entrepreneur ?",
    meta_title: "Identit\xE9 visuelle : \xE0 quoi sert-elle \xE0 un entrepreneur ?",
    meta_description: "Identit\xE9 visuelle : d\xE9finition, \xE9l\xE9ments, diff\xE9rence avec la charte graphique et raisons pour lesquelles un entrepreneur en a besoin.",
    excerpt: "Votre identit\xE9 visuelle est la premi\xE8re chose que vos clients voient de votre entreprise. Elle ne se r\xE9sume pas au logo : couleurs, typographies et images en font aussi partie. Entrepreneur au Burkina Faso, d\xE9couvrez comment elle construit votre image de marque.",
    published_at: "2026-11-03T09:00:00Z",
    rubrique: "identite-visuelle",
    status: "publie",
    tags: ["Identit\xE9 visuelle", "Charte graphique", "Logo", "Branding", "Burkina Faso"],
    reading_time: 4,
    created_at: "2026-10-31T01:46:00.000Z",
    updated_at: "2026-10-31T01:46:00.000Z",
    content: `<p>Imaginez deux boutiques de v\xEAtements sur Facebook. Elles vendent les m\xEAmes articles au m\xEAme prix. L\u2019une a des couleurs, une police et un logo coh\xE9rents, l\u2019autre change d\u2019allure \xE0 chaque publication.</p>
<p>Laquelle semble la plus s\xE9rieuse ? Laquelle reconnaissez-vous en un coup d\u2019\u0153il ? La r\xE9ponse vient presque toujours sans effort.</p>
<p>Cette diff\xE9rence porte un nom : l\u2019identit\xE9 visuelle. Dans cet article, vous d\xE9couvrez ce qu\u2019elle contient et pourquoi elle compte pour votre entreprise. Vous repartez avec des signes concrets pour savoir si la v\xF4tre est \xE0 revoir.</p>
<h2>L\u2019identit\xE9 visuelle, c\u2019est bien plus qu\u2019un logo</h2>
<p>L\u2019identit\xE9 visuelle d\xE9signe l\u2019ensemble des \xE9l\xE9ments visuels qui repr\xE9sentent une marque. On y trouve le logo, les couleurs, les typographies, les images et les ic\xF4nes. Ensemble, ils distinguent l\u2019entreprise de ses concurrents.</p>
<p>Le logo n\u2019en est que la partie la plus visible. Beaucoup d\u2019entrepreneurs s\u2019arr\xEAtent \xE0 lui et oublient le reste. Un logo seul ne construit pas une marque reconnaissable.</p>
<p>Pensez \xE0 la mani\xE8re dont vous reconnaissez un ami dans une foule. Vous ne vous fiez pas seulement \xE0 son visage, mais aussi \xE0 sa silhouette, sa d\xE9marche et son parfum. Une marque se reconna\xEEt de la m\xEAme fa\xE7on.</p>
<h2>Les \xE9l\xE9ments qui composent une identit\xE9 visuelle</h2>
<p>Le logo reste le point d\u2019entr\xE9e. Il doit rester lisible en grand comme en petit. Il doit aussi fonctionner en couleur comme en noir et blanc.</p>
<p>La palette de couleurs donne le ton. Deux ou trois couleurs principales suffisent souvent. Une identit\xE9 visuelle repose en g\xE9n\xE9ral sur deux ou trois polices au maximum.</p>
<p>Viennent ensuite les images, les ic\xF4nes, les motifs et la mise en page. Ces \xE9l\xE9ments donnent un style propre \xE0 vos affiches, vos publications et votre site. Ils forment la signature visuelle de votre entreprise.</p>
<h2>Identit\xE9 visuelle, charte graphique, branding : quelle diff\xE9rence ?</h2>
<p>Ces trois termes se confondent souvent. Pourtant, chacun d\xE9signe une chose pr\xE9cise. Les distinguer vous \xE9vite des malentendus avec un graphiste.</p>
<p>L\u2019identit\xE9 visuelle est la personnalit\xE9 graphique d\u2019une marque, et la charte graphique en est le <a href="https://www.canva.com/fr_fr/decouvrir/identite-visuelle-et-charte-graphique/" target="_blank" rel="noopener noreferrer">mode d\u2019emploi</a>. Cette charte fixe les r\xE8gles d\u2019usage du logo, des couleurs et des polices. Elle garantit que les graphistes, les imprimeurs et les responsables des r\xE9seaux sociaux appliquent l\u2019identit\xE9 de la m\xEAme fa\xE7on.</p>
<p>Le branding est plus large. C\u2019est le processus qui d\xE9finit le message et l\u2019identit\xE9 de marque que vous souhaitez transmettre au public. L\u2019identit\xE9 visuelle en est l\u2019expression graphique.</p>
<h2>Pourquoi un entrepreneur en a besoin</h2>
<p>Une identit\xE9 visuelle coh\xE9rente rend votre entreprise reconnaissable. Vos clients vous rep\xE8rent plus vite dans un fil d\u2019actualit\xE9 charg\xE9. Ils vous associent \xE0 une qualit\xE9 pr\xE9cise.</p>
<p>La coh\xE9rence inspire aussi confiance. Une \xE9tude de Lucidpress, aujourd\u2019hui Marq, avance qu\u2019une pr\xE9sentation coh\xE9rente de la marque peut accro\xEEtre les revenus jusqu\u2019\xE0 33 %. Ce chiffre vient d\u2019un \xE9diteur de logiciels de marque : lisez-le comme une tendance, pas comme une promesse.</p>
<p>Elle vous fait enfin gagner du temps. Avec des r\xE8gles claires, chaque affiche ou publication se cr\xE9e plus vite. Vous \xE9vitez de repartir de z\xE9ro \xE0 chaque fois.</p>
<h2>Vos clients vous voient d\u2019abord sur les r\xE9seaux sociaux</h2>
<p>Facebook domine largement parmi les r\xE9seaux sociaux mesur\xE9s au Burkina Faso. Selon <a href="https://napoleoncat.com/stats/facebook-users-in-burkina-faso/" target="_blank" rel="noopener noreferrer">NapoleonCat</a>, le pays comptait environ 4,8 millions d\u2019utilisateurs en septembre 2026. Cela repr\xE9sente un peu plus de 19 % de la population.</p>
<p>\xC0 titre de comparaison, LinkedIn comptait environ 600 000 membres et Instagram environ 231 000 \xE0 la m\xEAme date. Chaque plateforme n\u2019a pas le m\xEAme public. Votre identit\xE9 visuelle doit pourtant rester la m\xEAme partout.</p>
<p>Votre premi\xE8re impression se joue donc souvent sur un \xE9cran de t\xE9l\xE9phone, en quelques instants. Votre photo de profil, votre couverture et vos visuels parlent avant vous. Un ensemble soign\xE9 donne une image s\xE9rieuse d\xE8s le premier regard.</p>
<h2>Les signes qu\u2019il est temps de revoir votre identit\xE9</h2>
<p>Votre logo est flou ou illisible en petit format. Vos couleurs changent d\u2019une publication \xE0 l\u2019autre. Chaque support semble venir d\u2019une entreprise diff\xE9rente.</p>
<p>Vos clients vous confondent avec un concurrent. Vous h\xE9sitez \xE0 montrer votre marque \xE0 de gros clients. Votre site, vos affiches et vos r\xE9seaux n\u2019ont aucun point commun.</p>
<p>Un seul de ces signes m\xE9rite d\xE9j\xE0 votre attention. Plusieurs d\u2019entre eux annoncent le moment de structurer votre identit\xE9. Mieux vaut le faire avant d\u2019imprimer ou de publier en masse.</p>
<h2>Par o\xF9 commencer ?</h2>
<p>Commencez par clarifier ce que votre entreprise repr\xE9sente et pour qui. Choisissez ensuite vos couleurs, vos typographies et votre logo. Rassemblez enfin ces r\xE8gles dans une charte graphique.</p>
<p>Vous pouvez le faire seul, mais un graphiste vous \xE9vite les erreurs de d\xE9part. Il traduit vos valeurs en \xE9l\xE9ments visuels coh\xE9rents. Il vous remet aussi un document pour garder le cap.</p>
<p>Chez Class S, je cr\xE9e des <a href="/offres">identit\xE9s visuelles</a> pour entrepreneurs et startups. Si vous pr\xE9parez la v\xF4tre, parlons de votre projet. Le <a href="/contact">formulaire de contact</a> est \xE0 votre disposition.</p>`
  },
  "pourquoi-un-logo-seul-ne-sauvera-pas-votre-entreprise": {
    title: "Pourquoi un logo seul ne sauvera jamais votre entreprise (et ce qu'il vous faut vraiment)",
    excerpt: "Beaucoup d'entrepreneurs pensent qu'un joli logo suffit \xE0 attirer des clients haut de gamme. En r\xE9alit\xE9, un logo sans syst\xE8me d'identit\xE9 visuelle est une coquille vide. D\xE9cryptage d'une erreur co\xFBteuse.",
    meta_description: "D\xE9couvrez pourquoi un logo seul ne suffit pas \xE0 asseoir votre cr\xE9dibilit\xE9 et comment un v\xE9ritable syst\xE8me d'identit\xE9 visuelle transforme la perception de votre entreprise.",
    cover_image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-10-09T10:00:00.000Z",
    rubrique: "strategie-de-marque",
    content: "<p>Un logo sans \xE9cosyst\xE8me visuel ne cr\xE9e aucune valeur per\xE7ue. B\xE2tissez un univers complet pour inspirer confiance et justifier des tarifs premium.</p>"
  },
  "5-erreurs-graphiques-reseaux-sociaux-credibilite": {
    title: "Les 5 erreurs graphiques sur les r\xE9seaux sociaux qui d\xE9truisent votre cr\xE9dibilit\xE9",
    excerpt: "Des visuels satur\xE9s, des polices illisibles, une incoh\xE9rence de couleurs d'un post \xE0 l'autre... Voici les faux pas visuels qui font fuir vos prospects qualifi\xE9s et comment les corriger sans tarder.",
    meta_description: "Typographies illisibles, manque de coh\xE9rence chromatique, surcharge d'informations : \xE9vitez ces 5 erreurs graphiques qui font fuir vos prospects sur les r\xE9seaux sociaux.",
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-10-05T10:00:00.000Z",
    rubrique: "reseaux-sociaux",
    content: "<p>Sur les r\xE9seaux sociaux, 1,7 seconde d\xE9cide de l'attention d'un prospect. \xC9vitez les erreurs graphiques qui ruinent votre professionnalisme.</p>"
  },
  "transformer-identite-visuelle-en-levier-de-conversion": {
    title: "Comment transformer une identit\xE9 visuelle en levier de conversion commerciale",
    excerpt: "Le design n'est pas une simple d\xE9coration esth\xE9tique : c'est un outil de vente puissant. D\xE9couvrez comment structurer votre univers de marque pour inspirer confiance et justifier des tarifs premium.",
    meta_description: "Le design graphique n'est pas une simple d\xE9pense esth\xE9tique : c'est un investissement strat\xE9gique qui r\xE9duit les frictions de vente et justifie des tarifs \xE9lev\xE9s.",
    cover_image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-09-28T10:00:00.000Z",
    rubrique: "business-conversion",
    content: "<p>Le design graphique est un multiplicateur de conversion commerciale. D\xE9couvrez comment structurer votre marque pour r\xE9duire les objections de prix.</p>"
  }
};
async function getProjects() {
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/projets?select=*,projet_images(*)&status=eq.publie&order=display_order.asc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((p) => {
            const sortedImages = (p.projet_images || []).sort(
              (a, b) => (a.display_order || 0) - (b.display_order || 0)
            );
            const hero = sortedImages.find((img) => img.is_hero) || sortedImages[0];
            return {
              id: p.id,
              slug: normalizeProjectSlug(p.slug || p.id),
              title: p.title,
              category: p.category,
              tagline: p.tagline,
              accroche: p.accroche,
              clientGoal: p.client_goal,
              designedSolution: p.designed_solution,
              result: p.result,
              disclaimer: p.disclaimer,
              heroImage: hero ? hero.image_url : "/assets/logo/logo-violet.png",
              gallery: sortedImages.map((img) => ({
                src: img.image_url,
                caption: img.caption || p.title
              }))
            };
          });
        }
      }
    } catch (err) {
      console.warn("[SSR] Supabase projects fetch fallback:", err);
    }
  }
  return projectsData;
}
async function getTestimonials() {
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/temoignages?select=*&status=eq.publie&order=display_order.asc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn("[SSR] Supabase testimonials fetch fallback:", err);
    }
  }
  return projectsData.filter((p) => p.testimonialPlaceholder).map((p) => ({
    id: `testim-${p.id}`,
    author_name: p.title.includes("72") ? "Comit\xE9 72h CJ" : p.title.includes("Bang") ? "Fondateur" : "Client",
    author_role_company: p.title,
    content: p.testimonialPlaceholder || "",
    rating: 5,
    impact_result: p.result
  }));
}
async function getArticle(slug) {
  let art = fallbackArticles[slug] || null;
  if (slug && supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.publie&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          art = list[0];
        }
      }
    } catch (err) {
      console.warn("[SSR] Supabase article fetch fallback:", err);
    }
  }
  if (!art) return null;
  if (art.status !== "publie") return null;
  if (art.published_at && new Date(art.published_at).getTime() > Date.now()) {
    return null;
  }
  return art;
}
async function getArticlesList() {
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=slug,title,excerpt,cover_image,cover_image_alt,published_at,rubrique,reading_time,tags&status=eq.publie&order=published_at.desc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      }
    } catch (err) {
      console.warn("[SSR] Supabase articles list fetch fallback:", err);
    }
  }
  return Object.keys(fallbackArticles).map((slug) => ({
    slug,
    ...fallbackArticles[slug]
  }));
}
function normalizeProjectSlug(idOrSlug) {
  if (!idOrSlug) return "";
  const clean = idOrSlug.toLowerCase().trim();
  if (clean === "72h-cj-2026" || clean.includes("72h") || clean.includes("72-heures") || clean.includes("72")) {
    return "72-heures-cj-2026";
  }
  if (clean.includes("frere") || clean.includes("fr\xE8re")) {
    return "mon-frere-parle";
  }
  if (clean.includes("off") || clean.includes("day")) {
    return "off-day";
  }
  if (clean.includes("cafe") || clean.includes("caf\xE9") || clean.includes("inspire")) {
    return "cafe-inspire";
  }
  if (clean.includes("bang")) {
    return "bang";
  }
  return clean;
}
async function getProjectRedirect(slug) {
  if (slug === "72h-cj-2026" || slug === "72h") return "72-heures-cj-2026";
  if (slug && supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/projet_redirects?select=new_slug&old_slug=eq.${encodeURIComponent(slug)}&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0 && list[0]?.new_slug) {
          return list[0].new_slug;
        }
      }
    } catch (err) {
      console.warn("[SSR] Supabase project redirect fetch fallback:", err);
    }
  }
  return null;
}
async function getArticleRedirect(slug) {
  if (slug && supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/article_redirects?select=new_slug&old_slug=eq.${encodeURIComponent(slug)}&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        }
      );
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0 && list[0]?.new_slug) {
          return list[0].new_slug;
        }
      }
    } catch (err) {
      console.warn("[SSR] Supabase redirect fetch fallback:", err);
    }
  }
  return null;
}
function sanitizeServerHtml(html) {
  if (!html) return "";
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "").replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "").replace(/<embed\b[^>]*>/gi, "").replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "").replace(/<!--[\s\S]*?-->/gi, "");
  clean = clean.replace(/\s+on[a-z0-9_-]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");
  clean = clean.replace(/\s+style\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");
  clean = clean.replace(/<h1(\b[^>]*)>/gi, "<h2$1>").replace(/<\/h1>/gi, "</h2>");
  clean = clean.replace(/<h[4-6](\b[^>]*)>/gi, "<h3$1>").replace(/<\/h[4-6]>/gi, "</h3>");
  clean = clean.replace(/<a\b([^>]*)>/gi, (_, attrs) => {
    const hrefMatch = attrs.match(/href\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+))/i);
    const href = hrefMatch ? hrefMatch[1] || hrefMatch[2] || hrefMatch[3] || "" : "";
    const lowerHref = href.toLowerCase().trim();
    if (lowerHref.startsWith("javascript:") || lowerHref.startsWith("data:") || lowerHref.startsWith("vbscript:")) {
      return "<span>";
    }
    const isExternal = lowerHref.startsWith("http://") || lowerHref.startsWith("https://");
    let newAttrs = attrs.replace(/\s+rel\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "").replace(/\s+target\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");
    if (isExternal) {
      newAttrs += ' target="_blank" rel="noopener noreferrer"';
    }
    return `<a ${newAttrs.trim()}>`;
  });
  clean = clean.replace(/<img\b([^>]*)>/gi, (_, attrs) => {
    const getAttr = (name) => {
      const m = attrs.match(new RegExp(`${name}\\s*=\\s*(?:'([^']*)'|"([^"]*)"|([^\\s>]+))`, "i"));
      return m ? m[1] || m[2] || m[3] || "" : null;
    };
    const src = getAttr("src");
    if (!src) return "";
    const alt = getAttr("alt") || "";
    const srcset = getAttr("srcset");
    const sizes = getAttr("sizes");
    const width = getAttr("width");
    const height = getAttr("height");
    let out = `<img src="${src}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy" decoding="async"`;
    if (srcset) out += ` srcset="${srcset.replace(/"/g, "&quot;")}"`;
    if (sizes) out += ` sizes="${sizes.replace(/"/g, "&quot;")}"`;
    if (width) out += ` width="${width}"`;
    if (height) out += ` height="${height}"`;
    out += ' class="rounded-2xl w-full my-6 border border-white/10 shadow-lg object-cover" />';
    return out;
  });
  return clean.trim();
}
function render404Content() {
  return `
    <main class="min-h-[85vh] flex flex-col justify-center py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 font-body" style="font-family:'Jost', sans-serif; color:#0D0A18;">
      <span class="sr-only">Erreur 404 : Page introuvable</span>

      <div class="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider" style="background-color:rgba(102,0,204,0.1); border:1px solid rgba(102,0,204,0.2); color:#6600CC; display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:9999px;">
          <span>Erreur 404 \u2022 Hors piste</span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-[1.15] tracking-tight" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18; font-size:2.5rem; line-height:1.15; margin:1rem 0;">
          Page introuvable. Votre image, elle, ne devrait jamais l\u2019\xEAtre.
        </h1>

        <p class="text-sm sm:text-base text-onyx/75 max-w-xl mx-auto leading-relaxed" style="color:rgba(13,10,24,0.75); font-size:1rem; max-width:36rem; margin:0 auto; line-height:1.6;">
          L\u2019adresse demand\xE9e n\u2019existe pas ou a \xE9t\xE9 d\xE9plac\xE9e. En attendant de retrouver votre chemin, esquivez les visuels sans \xE2me pour les corriger avec l\u2019identit\xE9 Class S.
        </p>
      </div>

      <div class="w-full max-w-4xl mx-auto mb-8 aspect-[16/6] min-h-[260px] rounded-3xl bg-onyx/5 border border-violet-imperial/10 flex flex-col items-center justify-center space-y-3" style="background-color:rgba(13,10,24,0.04); border:1px solid rgba(102,0,204,0.15); border-radius:1.5rem; min-height:260px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <span class="text-xs text-onyx/60" style="color:rgba(13,10,24,0.6); font-size:0.875rem;">Chargement du jeu runner...</span>
      </div>

      <div class="text-center pt-2">
        <a href="/" class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-onyx/70 hover:text-violet-imperial transition-colors" style="color:rgba(13,10,24,0.7); font-size:0.875rem; text-decoration:none; font-weight:600;">
          \u2190 Ou quitter le jeu et revenir directement \xE0 l\u2019accueil
        </a>
      </div>
    </main>
  `;
}
async function handler(req, res) {
  const baseUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || SITE_URL;
  const rawRoute = req.query.route || req.url?.split("?")[0] || "/";
  const cleanPath = (rawRoute.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  if (/\.(js|css|png|jpg|jpeg|webp|svg|ico|map|woff|woff2|ttf|json|txt|xml|pdf)$/i.test(cleanPath)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(404).send("404 Not Found");
  }
  const slug = cleanPath.startsWith("/blog/") ? cleanPath.slice("/blog/".length) : req.query.slug || "";
  const projectSlug = cleanPath.startsWith("/projets/") ? cleanPath.slice("/projets/".length) : "";
  let normalizedRoute = "/";
  if (cleanPath === "/contact") {
    res.setHeader("Location", `${baseUrl}/#contact`);
    return res.status(301).end();
  }
  if (cleanPath === "/") normalizedRoute = "/";
  else if (cleanPath === "/offres") normalizedRoute = "/offres";
  else if (cleanPath === "/projets") normalizedRoute = "/projets";
  else if (cleanPath.startsWith("/projets/")) normalizedRoute = "/projets/:slug";
  else if (cleanPath === "/a-propos") normalizedRoute = "/a-propos";
  else if (cleanPath.startsWith("/blog/")) normalizedRoute = "/blog/:slug";
  else if (cleanPath === "/blog") normalizedRoute = "/blog";
  else normalizedRoute = "404";
  let html = "";
  const candidatePaths = [
    path.join(process.cwd(), "dist", "app.html"),
    path.join(process.cwd(), "dist", "index.html"),
    path.join(process.cwd(), "index.html")
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        html = fs.readFileSync(p, "utf-8");
        break;
      } catch {
      }
    }
  }
  if (!html) {
    html = `<!doctype html><html lang="fr"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Class S</title></head><body class="bg-ivoire-violet text-onyx font-body"><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`;
  }
  let pageTitle = SITE_CONFIG.defaultTitle;
  let pageDesc = SITE_CONFIG.defaultDescription;
  let pageCanonical = `${baseUrl}/`;
  let pageImage = SITE_CONFIG.ogImageUrl;
  let pageImageWidth = 1200;
  let pageImageHeight = 630;
  let pageImageAlt = "Class S \u2014 Studio d'Identit\xE9 Visuelle & Brand Design par Scott Nana";
  let pageType = "website";
  let ssrContent = "";
  let jsonLd = null;
  let statusCode = 200;
  let isNoIndex = false;
  let isNoIndexFollow = false;
  let extraMetaTags = "";
  if (normalizedRoute === "/") {
    pageTitle = "Class S \u2014 L'identit\xE9 visuelle qui vous impose | Scott Nana";
    pageDesc = "Class S est un studio d'identit\xE9 visuelle \xE0 Ouagadougou, au service des entrepreneurs et des PME. D'une image qui existe \xE0 une image qui fait vendre.";
    pageCanonical = `${baseUrl}/`;
    const projects = await getProjects();
    const testimonials = await getTestimonials();
    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfessionalService",
          "@id": `${baseUrl}/#organization`,
          name: SITE_CONFIG.name,
          alternateName: SITE_CONFIG.alternateName,
          url: `${baseUrl}/`,
          logo: SITE_CONFIG.logoUrl,
          image: pageImage,
          description: SITE_CONFIG.anchorPhrase,
          founder: {
            "@type": "Person",
            name: SITE_CONFIG.founder,
            jobTitle: SITE_CONFIG.jobTitle,
            sameAs: Object.values(SITE_CONFIG.socialLinks)
          },
          areaServed: {
            "@type": "AdministrativeArea",
            name: "Ouagadougou, Burkina Faso"
          }
        },
        {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          name: SITE_CONFIG.name,
          url: `${baseUrl}/`,
          description: pageDesc,
          publisher: {
            "@id": `${baseUrl}/#organization`
          }
        },
        {
          "@type": "FAQPage",
          "@id": `${baseUrl}/#faq`,
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }
      ]
    };
    ssrContent = `
      <main class="space-y-0" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- 1. Hero Section: Exact parity with Accueil.tsx 2-column grid -->
        <section class="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <!-- Left Copy: lg:col-span-6 matching React component perfectly -->
              <div class="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider">
                  <span>Brand & Graphic Design \u2022 Ouagadougou</span>
                </div>

                <h1 class="text-[2.2rem] sm:text-5xl lg:text-6xl xl:text-7xl font-title font-semibold text-onyx leading-[1.1] tracking-tight" style="font-family:'Cormorant Garamond', Georgia, serif;">
                  D'une image qui existe \xE0 une image qui fait vendre.
                </h1>

                <p class="text-base sm:text-lg lg:text-xl text-onyx/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Avant chaque projet, je d\xE9finis ce que vos clients doivent faire, puis je con\xE7ois chaque \xE9l\xE9ment pour les y conduire.
                </p>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <a href="/#contact" class="px-6 py-3.5 bg-[#6600CC] text-white font-semibold rounded-full inline-block text-center text-sm sm:text-base">Prendre contact</a>
                  <a href="/projets" class="px-6 py-3.5 border border-onyx/20 text-onyx font-semibold rounded-full inline-block text-center text-sm sm:text-base">Voir mes r\xE9alisations</a>
                </div>

                <div class="pt-6 border-t border-violet-imperial/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-onyx/70">
                  <span>\u2713 Direction artistique sur mesure</span>
                  <span>\u2713 D\xE9lais d'ex\xE9cution rapides</span>
                  <span>\u2713 Z\xE9ro mod\xE8le g\xE9n\xE9rique</span>
                </div>
              </div>

              <!-- Right Visual Showcase: aligned on first React mount (bg-onyx container SANS image with aria-label) -->
              <div class="lg:col-span-6 w-full">
                <div class="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
                  <div class="relative bg-onyx rounded-2xl md:rounded-3xl p-3 sm:p-4 shadow-soft-lg border border-violet-imperial/20 overflow-hidden">
                    <div class="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-white/10 text-xs text-ivoire-violet/70">
                      <div class="flex items-center gap-2">
                        <span class="inline-block w-2.5 h-2.5 rounded-full bg-amethyste"></span>
                        <span class="font-medium tracking-wide uppercase text-[11px] text-or-champagne">Vitrine de projets Class S</span>
                      </div>
                      <span class="text-[11px] text-ivoire-violet/50">Direction Artistique</span>
                    </div>
                    <div class="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-xl overflow-hidden bg-onyx/90" aria-label="Vitrine anim\xE9e des projets Class S">
                      <div class="w-full h-full grid grid-cols-4 grid-rows-4 gap-[2px] bg-onyx"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Promesse -->
        <section class="py-12 bg-[#0D0A18] text-white text-center px-4">
          <span class="text-xs uppercase font-semibold tracking-widest text-[#C9A070] block mb-2">La promesse Class S</span>
          <p class="text-xl sm:text-2xl font-title italic max-w-3xl mx-auto mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
            \xAB Si vous me confiez votre image, chaque visuel est pens\xE9 pour que celui qui le voit prenne contact, et que votre activit\xE9 vende plus. \xBB
          </p>
          <span class="text-xs text-[#A87FE8]">\u2014 Scott Nana, Fondateur de Class S</span>
        </section>

        <!-- M\xE9thode en 3 \xE9tapes -->
        <section class="py-16 max-w-6xl mx-auto px-4">
          <h2 class="text-2xl sm:text-3xl font-title font-semibold text-center mb-10" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Une m\xE9thode rigoureuse en 3 \xE9tapes
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 bg-white rounded-2xl border border-violet-imperial/10 shadow-soft">
              <span class="text-xs font-bold text-[#C9A070] uppercase">\xC9tape 01</span>
              <h3 class="text-xl font-title font-semibold my-2">Le Cadrage Strat\xE9gique</h3>
              <p class="text-sm text-onyx/75">Avant d'ouvrir un logiciel de cr\xE9ation, nous identifions pr\xE9cis\xE9ment qui sont vos clients id\xE9aux, quel message doit passer et quelle action concr\xE8te ils doivent accomplir.</p>
            </div>
            <div class="p-6 bg-white rounded-2xl border border-violet-imperial/10 shadow-soft">
              <span class="text-xs font-bold text-[#C9A070] uppercase">\xC9tape 02</span>
              <h3 class="text-xl font-title font-semibold my-2">La Conception Sans Mod\xE8le</h3>
              <p class="text-sm text-onyx/75">Cr\xE9ation sur mesure d'une identit\xE9 originale : typographies, palettes de couleurs, hi\xE9rarchies visuelles. Z\xE9ro mod\xE8le g\xE9n\xE9rique pour que votre marque ne ressemble \xE0 aucune autre.</p>
            </div>
            <div class="p-6 bg-white rounded-2xl border border-violet-imperial/10 shadow-soft">
              <span class="text-xs font-bold text-[#C9A070] uppercase">\xC9tape 03</span>
              <h3 class="text-xl font-title font-semibold my-2">La Livraison Op\xE9rationnelle</h3>
              <p class="text-sm text-onyx/75">Remise de l'ensemble des fichiers pr\xEAts \xE0 l'emploi (print et digital), guide d'utilisation clair et accompagnement pour un d\xE9ploiement fluide et imm\xE9diat.</p>
            </div>
          </div>
        </section>

        <!-- Preuve par les projets r\xE9cents -->
        <section class="py-16 max-w-7xl mx-auto px-4 bg-white/50">
          <h2 class="text-2xl sm:text-3xl font-title font-semibold text-center mb-8" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Des images con\xE7ues pour faire vendre
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${projects.slice(0, 3).map((p) => `
              <article class="bg-white rounded-2xl p-6 border border-violet-imperial/10 shadow-soft">
                <span class="text-xs uppercase font-semibold text-[#C9A070]">${p.category}</span>
                <h3 class="text-xl font-title font-semibold my-2">${p.title}</h3>
                <p class="text-sm text-onyx/75 mb-3">${p.tagline}</p>
                <div class="text-xs text-onyx/80 space-y-1">
                  <p><strong>But :</strong> ${p.clientGoal}</p>
                  <p><strong>R\xE9sultat :</strong> ${p.result}</p>
                </div>
              </article>
            `).join("")}
          </div>
          <div class="text-center mt-8">
            <a href="/projets" class="text-[#6600CC] font-semibold hover:underline">D\xE9couvrir toutes les r\xE9alisations \u2192</a>
          </div>
        </section>

        <!-- Mur de t\xE9moignages -->
        ${testimonials.length > 0 ? `
          <section class="py-16 bg-[#0D0A18] text-white px-4">
            <h2 class="text-2xl sm:text-3xl font-title font-semibold text-center mb-8 text-white" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Ce que disent les dirigeants accompagn\xE9s
            </h2>
            <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              ${testimonials.slice(0, 4).map((t) => `
                <blockquote class="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p class="text-sm italic mb-4 text-[#F8F5FF]/90">\xAB ${t.content} \xBB</p>
                  <footer class="text-xs text-[#C9A070] font-semibold">${t.author_name} ${t.author_role_company ? `\u2014 ${t.author_role_company}` : ""}</footer>
                </blockquote>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <!-- FAQ -->
        <section class="py-16 max-w-4xl mx-auto px-4">
          <h2 class="text-2xl sm:text-3xl font-title font-semibold text-center mb-8" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Questions fr\xE9quentes
          </h2>
          <div class="space-y-4">
            ${FAQ_ITEMS.map((faq) => `
              <div class="p-5 bg-white rounded-2xl border border-violet-imperial/10">
                <h3 class="font-semibold text-base mb-2 text-onyx">${faq.question}</h3>
                <p class="text-sm text-onyx/80 leading-relaxed">${faq.answer}</p>
              </div>
            `).join("")}
          </div>
        </section>

        <!-- Ancrage Footer -->
        <footer class="py-10 border-t border-violet-imperial/10 text-center text-xs text-onyx/70 max-w-4xl mx-auto px-4">
          <p class="font-medium text-onyx mb-1">${SITE_CONFIG.anchorPhrase}</p>
          <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Class S \u2022 Scott Nana. Tous droits r\xE9serv\xE9s.</p>
        </footer>
      </main>
    `;
  } else if (normalizedRoute === "/offres") {
    pageTitle = "Formules & Accompagnement Brand Design | Class S";
    pageDesc = "D\xE9couvrez nos 5 familles d'accompagnement : Logo & Identit\xE9 Visuelle, Branding Social Media, Communication \xC9v\xE9nementielle, Sites Web et Visuels 24h \xE0 Ouagadougou.";
    pageCanonical = `${baseUrl}/offres`;
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pageTitle,
      url: pageCanonical,
      description: pageDesc,
      provider: {
        "@type": "ProfessionalService",
        name: SITE_CONFIG.name,
        url: baseUrl
      },
      mainEntity: {
        "@type": "OfferCatalog",
        name: "Catalogue des solutions d'accompagnement Class S",
        numberOfItems: offerFamilies.length,
        itemListElement: offerFamilies.map((fam, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: fam.title,
            description: fam.subtitle,
            provider: {
              "@type": "ProfessionalService",
              name: SITE_CONFIG.name
            }
          }
        }))
      }
    };
    const renderTable = (headers, rows, caption, isDark = false) => {
      const borderCol = isDark ? "rgba(255,255,255,0.15)" : "rgba(102,0,204,0.15)";
      const bgHeader = isDark ? "rgba(255,255,255,0.05)" : "rgba(102,0,204,0.05)";
      const textCol = isDark ? "#F8F5FF" : "#0D0A18";
      return `
        <div style="overflow-x:auto; margin: 2rem 0;">
          <table style="width:100%; border-collapse:collapse; font-size:0.875rem; text-align:left; border:1px solid ${borderCol}; color:${textCol};">
            <caption style="text-align:left; font-weight:600; padding:0.5rem 0; font-size:1rem;">${caption}</caption>
            <thead>
              <tr style="background:${bgHeader}; border-bottom:2px solid ${borderCol};">
                <th scope="col" style="padding:12px 16px;">Crit\xE8re</th>
                ${headers.map((h) => `<th scope="col" style="padding:12px 16px; text-align:center;">${h.label}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rows.map((r) => `
                <tr style="border-bottom:1px solid ${borderCol};">
                  <th scope="row" style="padding:10px 16px; font-weight:500;">${r.label}</th>
                  ${headers.map((h) => {
        const val = r.values[h.id];
        let text = "\u2014";
        if (val === true) text = "\u2713 Inclus";
        else if (val === false) text = "\u2014";
        else if (val) text = String(val);
        return `<td style="padding:10px 16px; text-align:center;">${text}</td>`;
      }).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    };
    const familyLogo = offerFamilies.find((f) => f.id === "logo-identite");
    const familySocial = offerFamilies.find((f) => f.id === "social-media");
    const familyEvent = offerFamilies.find((f) => f.id === "evenementiel");
    const familyWeb = offerFamilies.find((f) => f.id === "sites-web");
    const familySingle = offerFamilies.find((f) => f.id === "visuels-unite");
    ssrContent = `
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Ent\xEAte compact -->
        <header class="text-center max-w-3xl mx-auto mb-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Nos formules d'accompagnement</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Des formules con\xE7ues pour faire grandir votre activit\xE9
          </h1>
          <p class="text-base sm:text-lg text-onyx/75 leading-relaxed mb-6">
            Chaque offre est calibr\xE9e pour apporter une r\xE9ponse graphique strat\xE9gique \xE0 un besoin pr\xE9cis. Aucun tarif g\xE9n\xE9rique : chaque collaboration fait l'objet d'un \xE9change pr\xE9alable pour adapter le dispositif \xE0 vos objectifs.
          </p>
          <div class="p-5 rounded-2xl bg-gradient-to-r from-violet-imperial/10 via-white to-or-champagne/10 border border-violet-imperial/20 text-center">
            <p class="text-base sm:text-lg font-title italic" style="font-family:'Cormorant Garamond', Georgia, serif;">
              \xAB Chaque \xE9l\xE9ment de votre identit\xE9 sera construit pour qu'elle s'impose dans votre march\xE9 et ne se noie pas parmi vos concurrents. \xBB
            </p>
            <span class="text-xs text-violet-imperial font-semibold uppercase tracking-wider mt-1 block">\u2014 Engagement de conception Class S</span>
          </div>
        </header>

        <!-- Guide : Quelle offre pour vous ? -->
        <section aria-labelledby="guide-heading" class="mb-12 p-6 sm:p-8 rounded-3xl bg-white border border-violet-imperial/15 shadow-soft">
          <h2 id="guide-heading" class="text-2xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Quelle offre pour vous ?
          </h2>
          <p class="text-sm text-onyx/75 mb-6">
            S\xE9lectionnez votre situation actuelle pour acc\xE9der directement \xE0 la formule adapt\xE9e :
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${GUIDE_SITUATIONS.map((s) => `
              <a href="#${s.targetId}" class="p-3.5 rounded-2xl bg-ivoire-violet/50 border border-violet-imperial/10 hover:border-violet-imperial/30 block text-sm font-medium text-onyx transition-colors">
                <span>${s.text}</span>
                <span class="block text-xs text-violet-imperial font-semibold mt-1">\u2192 ${s.category}</span>
              </a>
            `).join("")}
          </div>
        </section>

        <!-- Navigation ancres -->
        <nav aria-label="Familles d'offres" class="mb-14 flex flex-wrap gap-2.5 justify-center">
          ${offerFamilies.map((fam) => `
            <a href="#${fam.anchorId}" class="px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-white border border-violet-imperial/20 text-onyx hover:bg-violet-imperial hover:text-white transition-colors">
              ${fam.navLabel}
            </a>
          `).join("")}
        </nav>

        <!-- Famille 01 : Logo & Identit\xE9 Visuelle -->
        <section id="famille-logo" class="mb-20 scroll-mt-28">
          <div class="mb-8">
            <span class="text-xs font-bold text-violet-imperial uppercase tracking-wider">01 \xB7 Logo & Identit\xE9</span>
            <h2 class="text-3xl sm:text-4xl font-title font-semibold text-onyx mt-1 mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
              ${familyLogo.title}
            </h2>
            <p class="text-base text-onyx/75 max-w-2xl">${familyLogo.subtitle}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            ${(familyLogo.formulas || []).map((f) => `
              <article id="${f.slugAnchor}" class="p-6 rounded-3xl bg-white border border-violet-imperial/15 shadow-soft flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider text-violet-imperial">Formule</span>
                    ${f.badge ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-or-champagne/20 text-onyx">${f.badge}</span>` : ""}
                  </div>
                  <h3 class="text-2xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
                    ${f.name}
                  </h3>
                  <p class="text-sm italic text-violet-imperial/90 mb-4 bg-ivoire-violet/60 p-3 rounded-xl border border-violet-imperial/10">
                    ${f.idealFor}
                  </p>
                  <ul class="space-y-2 text-sm text-onyx/80 mb-6">
                    ${f.keyPoints.map((kp) => `<li class="flex items-start gap-2"><span class="text-[#6600CC]">\u2713</span><span>${kp}</span></li>`).join("")}
                  </ul>
                </div>
                <div class="pt-4 border-t border-violet-imperial/10">
                  ${f.deliveryTime ? `<p class="text-xs text-onyx/65 mb-3">D\xE9lai moyen : <strong>${f.deliveryTime}</strong></p>` : ""}
                  <a href="/#contact?type=logo" class="block w-full text-center px-4 py-2.5 bg-violet-imperial text-white font-medium text-sm rounded-full">
                    Choisir la formule ${f.name}
                  </a>
                </div>
              </article>
            `).join("")}
          </div>

          ${familyLogo.namingOptionNote ? `
            <div class="p-4 rounded-2xl bg-ivoire-violet/70 border border-violet-imperial/15 text-xs text-onyx/80 mb-8">
              <strong>Option Naming :</strong> ${familyLogo.namingOptionNote}
            </div>
          ` : ""}

          <!-- Matrice Logo -->
          <div class="mt-8">
            <h3 class="text-xl font-title font-semibold mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Comparer les formules Logo & Identit\xE9 en d\xE9tail
            </h3>
            ${renderTable(familyLogo.comparisonHeaders, familyLogo.comparisonRows, "Matrice comparative \u2014 Logo & Identit\xE9")}
          </div>
        </section>

        <!-- Famille 02 : Branding Social Media -->
        <section id="famille-social" class="mb-20 scroll-mt-28">
          <div class="mb-8">
            <span class="text-xs font-bold text-violet-imperial uppercase tracking-wider">02 \xB7 R\xE9seaux Sociaux</span>
            <h2 class="text-3xl sm:text-4xl font-title font-semibold text-onyx mt-1 mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
              ${familySocial.title}
            </h2>
            <p class="text-base text-onyx/75 max-w-2xl">${familySocial.subtitle}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            ${(familySocial.formulas || []).map((f) => `
              <article id="${f.slugAnchor}" class="p-6 sm:p-8 rounded-3xl bg-white border border-violet-imperial/15 shadow-soft flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider text-violet-imperial">Formule Mensuelle</span>
                    ${f.badge ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-imperial/10 text-violet-imperial">${f.badge}</span>` : ""}
                  </div>
                  <h3 class="text-2xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
                    ${f.name}
                  </h3>
                  <p class="text-sm italic text-violet-imperial/90 mb-4 bg-ivoire-violet/60 p-3 rounded-xl border border-violet-imperial/10">
                    ${f.idealFor}
                  </p>
                  <ul class="space-y-2 text-sm text-onyx/80 mb-6">
                    ${f.keyPoints.map((kp) => `<li class="flex items-start gap-2"><span class="text-[#6600CC]">\u2713</span><span>${kp}</span></li>`).join("")}
                  </ul>
                </div>
                <div class="pt-4 border-t border-violet-imperial/10">
                  ${f.deliveryTime ? `<p class="text-xs text-onyx/65 mb-3">Rythme : <strong>${f.deliveryTime}</strong></p>` : ""}
                  <a href="/#contact?type=social" class="block w-full text-center px-4 py-2.5 bg-violet-imperial text-white font-medium text-sm rounded-full">
                    Activer ${f.name}
                  </a>
                </div>
              </article>
            `).join("")}
          </div>

          <!-- Matrice Social Media -->
          <div class="mt-8">
            <h3 class="text-xl font-title font-semibold mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Comparer les formules R\xE9seaux Sociaux en d\xE9tail
            </h3>
            ${renderTable(familySocial.comparisonHeaders, familySocial.comparisonRows, "Matrice comparative \u2014 Branding Social Media")}
          </div>
        </section>

        <!-- Famille 03 : Communication \xC9v\xE9nementielle -->
        <section id="famille-evenementiel" class="mb-20 scroll-mt-28">
          <div class="p-6 sm:p-10 rounded-3xl bg-white border border-or-champagne/30 shadow-soft">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span class="text-xs font-bold text-or-champagne uppercase tracking-wider">03 \xB7 \xC9v\xE9nementiel</span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-or-champagne/15 text-[#8A5E2E]">Sur devis personnalis\xE9</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              ${familyEvent.title}
            </h2>
            <p class="text-base text-onyx/75 max-w-2xl mb-4">${familyEvent.subtitle}</p>
            <p class="text-sm italic text-violet-imperial mb-6 bg-ivoire-violet/60 p-3 rounded-xl border border-violet-imperial/10 max-w-2xl">
              ${familyEvent.idealFor}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm text-onyx/80">
              <div class="p-4 rounded-2xl bg-ivoire-violet/40">
                <h4 class="font-semibold text-onyx mb-2">Supports Print & Signal\xE9tique</h4>
                <p>Affiches officielles, kak\xE9monos, b\xE2ches, badges d'invit\xE9s, programmes imprim\xE9s et signal\xE9tique d'orientation sur site.</p>
              </div>
              <div class="p-4 rounded-2xl bg-ivoire-violet/40">
                <h4 class="font-semibold text-onyx mb-2">Campagne Num\xE9rique & M\xE9dias</h4>
                <p>Visuels de teasing, compte \xE0 rebours, annonces d'intervenants, banni\xE8res partenaires et habillage vid\xE9o d'\xE9cran sc\xE8ne.</p>
              </div>
            </div>
            <a href="/#contact?type=event" class="inline-block px-6 py-3 bg-or-champagne text-onyx font-semibold text-sm rounded-full">
              Demander un devis \xE9v\xE9nementiel
            </a>
          </div>
        </section>

        <!-- Famille 04 : Sites Web (Bande sombre Onyx) -->
        <section id="famille-sites-web" class="mb-20 scroll-mt-28 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16" style="background-color:#0D0A18; color:#F8F5FF;">
          <div class="max-w-6xl mx-auto">
            <div class="mb-10 text-center max-w-3xl mx-auto">
              <span class="text-xs font-bold uppercase tracking-wider" style="color:#C9A070;">04 \xB7 Pr\xE9sence Web Haute Performance</span>
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold mt-2 mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#F8F5FF;">
                ${familyWeb.title}
              </h2>
              <p class="text-base text-ivoire-violet/75 max-w-2xl mx-auto mb-6">${familyWeb.subtitle}</p>
              
              <!-- Vitesse comparative -->
              <div class="p-4 rounded-2xl border border-white/10 max-w-xl mx-auto text-left" style="background:rgba(255,255,255,0.03);">
                <p class="text-xs text-ivoire-violet/70 mb-2 font-medium">Temps moyen de chargement mobile sur r\xE9seau 3G/4G locale :</p>
                <div class="space-y-2 text-xs">
                  <div>
                    <div class="flex justify-between mb-1 text-ivoire-violet/60"><span>Standards march\xE9 classiques</span><span>4 \xE0 8 secondes</span></div>
                    <div class="w-full bg-white/10 h-2 rounded-full"><div class="bg-red-400/80 h-2 rounded-full" style="width:85%"></div></div>
                  </div>
                  <div>
                    <div class="flex justify-between mb-1" style="color:#C9A070;"><span>Architecture Class S ultra-optimis\xE9e</span><span>~1 seconde</span></div>
                    <div class="w-full bg-white/10 h-2 rounded-full"><div class="h-2 rounded-full" style="width:20%; background-color:#C9A070;"></div></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2 Formats Web -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              ${websiteFormats.map((fmt) => `
                <div class="p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between" style="background:rgba(255,255,255,0.03);">
                  <div>
                    <h3 class="text-2xl font-title font-semibold mb-2" style="font-family:'Cormorant Garamond', Georgia, serif; color:#F8F5FF;">
                      ${fmt.title}
                    </h3>
                    <p class="text-sm text-ivoire-violet/70 mb-6">${fmt.subtitle}</p>

                    <div class="space-y-6">
                      <!-- Variante Essentiel -->
                      <div class="p-4 rounded-2xl border border-white/10" style="background:rgba(255,255,255,0.02);">
                        <h4 class="text-sm font-bold uppercase tracking-wider text-or-champagne mb-1">${fmt.variants.essentiel.label}</h4>
                        <p class="text-xs italic text-ivoire-violet/70 mb-3">${fmt.variants.essentiel.idealFor}</p>
                        <ul class="space-y-1.5 text-xs text-ivoire-violet/80">
                          ${fmt.variants.essentiel.keyPoints.map((kp) => `<li>\u2022 ${kp}</li>`).join("")}
                        </ul>
                      </div>

                      <!-- Variante Premium -->
                      <div class="p-4 rounded-2xl border border-or-champagne/30" style="background:rgba(201,160,112,0.05);">
                        <h4 class="text-sm font-bold uppercase tracking-wider text-or-champagne mb-1">${fmt.variants.premium.label}</h4>
                        <p class="text-xs italic text-ivoire-violet/70 mb-3">${fmt.variants.premium.idealFor}</p>
                        <ul class="space-y-1.5 text-xs text-ivoire-violet/80">
                          ${fmt.variants.premium.keyPoints.map((kp) => `<li>\u2022 ${kp}</li>`).join("")}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="pt-6 mt-6 border-t border-white/10">
                    <a href="/#contact?type=website" class="block w-full text-center px-4 py-3 bg-white text-onyx font-semibold text-sm rounded-full">
                      Commander mon site ${fmt.title}
                    </a>
                  </div>
                </div>
              `).join("")}
            </div>

            ${familyWeb.hostingDomainNote ? `
              <p class="text-xs text-center text-ivoire-violet/60 mb-8 max-w-2xl mx-auto">
                ${familyWeb.hostingDomainNote}
              </p>
            ` : ""}

            <!-- Matrice Web -->
            <div class="mt-8">
              <h3 class="text-xl font-title font-semibold mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#F8F5FF;">
                Comparer les formats de sites web
              </h3>
              ${renderTable(familyWeb.comparisonHeaders, familyWeb.comparisonRows, "Matrice comparative \u2014 Sites Web", true)}
            </div>
          </div>
        </section>

        <!-- Famille 05 : Visuels \xE0 l'unit\xE9 -->
        <section id="famille-visuels" class="mb-20 scroll-mt-28">
          <div class="p-6 sm:p-8 rounded-3xl bg-white border border-violet-imperial/15 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="max-w-2xl">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xs font-bold text-violet-imperial uppercase tracking-wider">05 \xB7 R\xE9activit\xE9</span>
                <span class="px-3 py-0.5 rounded-full text-xs font-semibold bg-violet-imperial/10 text-violet-imperial">Livraison garantie sous 24h</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
                ${familySingle.title}
              </h2>
              <p class="text-sm text-onyx/75 mb-3">${familySingle.subtitle}</p>
              <p class="text-xs italic text-violet-imperial/90 mb-0">
                ${familySingle.idealFor}
              </p>
            </div>
            <a href="/#contact?type=print" class="shrink-0 px-6 py-3 bg-violet-imperial text-white font-medium text-sm rounded-full">
              Commander un visuel express
            </a>
          </div>
        </section>

        <!-- FAQ Prestations -->
        <section aria-labelledby="faq-heading" class="max-w-4xl mx-auto mb-16">
          <h2 id="faq-heading" class="text-2xl sm:text-3xl font-title font-semibold text-center mb-8" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Questions fr\xE9quentes sur nos prestations
          </h2>
          <div class="space-y-4">
            ${FAQ_ITEMS.map((faq) => `
              <div class="p-5 bg-white rounded-2xl border border-violet-imperial/10">
                <h3 class="font-semibold text-base mb-2 text-onyx">${faq.question}</h3>
                <p class="text-sm text-onyx/80 leading-relaxed">${faq.answer}</p>
              </div>
            `).join("")}
          </div>
        </section>

        <!-- Bandeau final CTA -->
        <section class="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-imperial/10 via-white to-or-champagne/10 border border-violet-imperial/20 mb-16">
          <h2 class="text-2xl sm:text-3xl font-title font-semibold mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Un projet sp\xE9cifique ou une question sur nos formules ?
          </h2>
          <p class="text-sm sm:text-base text-onyx/75 max-w-xl mx-auto mb-6">
            Chaque identit\xE9 de marque est unique. \xC9changeons sur vos ambitions et concevons l'accompagnement le plus pertinent pour vous imposer.
          </p>
          <a href="/#contact" class="inline-block px-8 py-3.5 bg-violet-imperial text-white font-medium text-base rounded-full shadow-soft hover:shadow-glow">
            Prendre contact avec Scott Nana
          </a>
        </section>

        <footer class="py-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
          <p>${SITE_CONFIG.anchorPhrase}</p>
        </footer>
      </main>
    `;
  } else if (normalizedRoute === "/projets") {
    pageTitle = "R\xE9alisations & \xC9tudes de Cas | Class S";
    pageDesc = "Explorez nos r\xE9alisations et \xE9tudes de cas de marques \xE0 Ouagadougou : objectifs clients, conception graphique strat\xE9gique et r\xE9sultats commerciaux obtenus.";
    pageCanonical = `${baseUrl}/projets`;
    const projects = await getProjects();
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: pageTitle,
      url: pageCanonical,
      description: pageDesc,
      provider: {
        "@type": "ProfessionalService",
        name: SITE_CONFIG.name,
        url: baseUrl
      },
      mainEntity: {
        "@type": "ItemList",
        name: "R\xE9alisations & \xC9tudes de Cas Class S",
        numberOfItems: projects.length,
        itemListElement: projects.map((proj, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: proj.title,
            description: getProjectAccroche(proj),
            url: `${baseUrl}/projets/${proj.slug}`,
            creator: {
              "@type": "Person",
              name: SITE_CONFIG.founder
            }
          }
        }))
      }
    };
    const featuredProject = projects[0];
    const otherProjects = projects.slice(1);
    const featuredOpt = featuredProject ? getOptimizedImage(featuredProject.heroImage, { width: 1200 }) : { src: "" };
    ssrContent = `
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4" style="background-color:rgba(102,0,204,0.1); border:1px solid rgba(102,0,204,0.2); color:#6600CC; display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:9999px;">
            <span>R\xC9ALISATIONS &amp; \xC9TUDES DE CAS</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
            Chaque visuel a une mission commerciale
          </h1>
          <p class="text-base sm:text-lg text-onyx/75 leading-relaxed" style="color:rgba(13,10,24,0.75);">
            D\xE9couvrez l\u2019int\xE9gralit\xE9 des visuels et dispositifs con\xE7us pour chaque projet, avec leur intention strat\xE9gique et leur impact.
          </p>
        </div>

        ${featuredProject ? `
          <!-- Featured Project Card (Full Width) -->
          <article class="mb-10 group bg-white rounded-3xl overflow-hidden border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg transition-all duration-300">
            <a href="/projets/${featuredProject.slug}" class="block grid grid-cols-1 lg:grid-cols-12 gap-0 text-inherit" style="text-decoration:none; color:inherit;">
              <div class="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden bg-onyx">
                <img
                  src="${featuredOpt.src}"
                  ${featuredOpt.srcSet ? `srcset="${featuredOpt.srcSet}"` : ""}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  alt="${featuredProject.title}"
                  width="${featuredOpt.width || 1200}"
                  height="${featuredOpt.height || 675}"
                  class="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div class="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-2.5 mb-3">
                    <span class="px-3 py-1 rounded-full bg-violet-imperial text-white text-[11px] font-semibold uppercase tracking-wider" style="background-color:#6600CC; color:#ffffff; padding:4px 12px; border-radius:9999px;">
                      Projet vedette
                    </span>
                    <span class="text-xs uppercase font-semibold text-[#C9A070] tracking-wider" style="color:#C9A070;">
                      ${featuredProject.category}
                    </span>
                  </div>
                  <h2 class="text-2xl sm:text-3xl lg:text-4xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
                    ${featuredProject.title}
                  </h2>
                  <p class="text-sm sm:text-base text-onyx/75 leading-relaxed mb-6" style="color:rgba(13,10,24,0.75);">
                    ${getProjectAccroche(featuredProject)}
                  </p>
                </div>
                <div class="pt-4 border-t border-violet-imperial/10 flex items-center justify-between text-xs sm:text-sm font-semibold text-violet-imperial" style="color:#6600CC;">
                  <span class="text-onyx/60" style="color:rgba(13,10,24,0.6);">${featuredProject.gallery.length} visuels</span>
                  <span>Voir l\u2019\xE9tude compl\xE8te \u2192</span>
                </div>
              </div>
            </a>
          </article>
        ` : ""}

        <!-- 2-Column Grid for Remaining Projects -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          ${otherProjects.map((p) => {
      const opt = getOptimizedImage(p.heroImage, { width: 800 });
      return `
              <article class="group bg-white rounded-3xl overflow-hidden border border-violet-imperial/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col">
                <a href="/projets/${p.slug}" class="block text-inherit flex-grow flex flex-col" style="text-decoration:none; color:inherit;">
                  <div class="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-onyx">
                    <img
                      src="${opt.src}"
                      ${opt.srcSet ? `srcset="${opt.srcSet}"` : ""}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      alt="${p.title}"
                      width="${opt.width || 800}"
                      height="${opt.height || 550}"
                      class="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div class="absolute top-3 left-3 bg-onyx/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[11px] font-semibold text-white uppercase tracking-wider" style="position:absolute; top:12px; left:12px; background:rgba(13,10,24,0.8); padding:4px 12px; border-radius:9999px; color:#fff;">
                      ${p.category}
                    </div>
                  </div>
                  <div class="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                    <div>
                      <h2 class="text-xl sm:text-2xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
                        ${p.title}
                      </h2>
                      <p class="text-xs sm:text-sm text-onyx/75 leading-relaxed mb-4" style="color:rgba(13,10,24,0.75);">
                        ${getProjectAccroche(p)}
                      </p>
                    </div>
                    <div class="pt-4 border-t border-violet-imperial/10 flex items-center justify-between text-xs font-semibold text-violet-imperial" style="color:#6600CC;">
                      <span class="text-onyx/60" style="color:rgba(13,10,24,0.6);">${p.gallery.length} visuels</span>
                      <span>Voir le projet \u2192</span>
                    </div>
                  </div>
                </a>
              </article>
            `;
    }).join("")}
        </div>

        <footer class="py-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
          <p>${SITE_CONFIG.anchorPhrase}</p>
        </footer>
      </main>
    `;
  } else if (normalizedRoute === "/projets/:slug") {
    const redirectSlug = await getProjectRedirect(projectSlug);
    if (redirectSlug && redirectSlug !== projectSlug) {
      res.setHeader("Location", `${baseUrl}/projets/${redirectSlug}`);
      return res.status(301).end();
    }
    const projects = await getProjects();
    const targetNorm = normalizeProjectSlug(projectSlug);
    let project = projects.find(
      (p) => normalizeProjectSlug(p.slug || p.id) === targetNorm || p.id === projectSlug || p.slug === projectSlug
    );
    if (!project) {
      project = projectsData.find(
        (p) => normalizeProjectSlug(p.slug || p.id) === targetNorm || p.id === projectSlug || p.slug === projectSlug
      );
    }
    if (!project) {
      pageTitle = "Page introuvable | Class S";
      pageDesc = "Page introuvable. Votre image, elle, ne devrait jamais l'\xEAtre.";
      pageCanonical = "";
      statusCode = 404;
      isNoIndex = true;
      ssrContent = render404Content();
    } else {
      const accroche = getProjectAccroche(project);
      pageTitle = `${project.title} | Class S`;
      pageDesc = accroche;
      pageCanonical = `${baseUrl}/projets/${project.slug}`;
      pageImage = `${baseUrl}/og/projets/${project.slug}.jpg`;
      pageImageWidth = 1200;
      pageImageHeight = 630;
      pageImageAlt = project.title;
      pageType = "article";
      const testimonials = await getTestimonials();
      const testimonial = testimonials.find(
        (t) => t.projet_id === project.id || t.projet_id === project.slug
      ) || (project.testimonialPlaceholder ? {
        author_name: project.title.includes("72") ? "Comit\xE9 72h CJ" : project.title.includes("Bang") ? "Fondateur" : "Client",
        author_role_company: project.title,
        content: project.testimonialPlaceholder
      } : null);
      jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CreativeWork",
            "@id": `${pageCanonical}#work`,
            name: project.title,
            description: accroche,
            image: pageImage,
            url: pageCanonical,
            genre: project.category,
            inLanguage: "fr",
            creator: {
              "@type": "Person",
              name: SITE_CONFIG.founder,
              jobTitle: SITE_CONFIG.jobTitle,
              url: baseUrl
            },
            provider: {
              "@type": "ProfessionalService",
              name: SITE_CONFIG.name,
              url: baseUrl
            }
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${pageCanonical}#breadcrumb`,
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Accueil",
                item: `${baseUrl}/`
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Projets",
                item: `${baseUrl}/projets`
              },
              {
                "@type": "ListItem",
                position: 3,
                name: project.title,
                item: pageCanonical
              }
            ]
          }
        ]
      };
      const heroOpt = getOptimizedImage(project.heroImage, { width: 1200 });
      const currentIndex = projects.findIndex(
        (p) => p.id === project.id || p.slug === project.slug
      );
      const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
      const nextProject = projects[(currentIndex + 1) % projects.length];
      ssrContent = `
        <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16" style="font-family:'Jost', sans-serif; color:#0D0A18;">
          <!-- Breadcrumb -->
          <nav class="mb-6 sm:mb-8 text-xs font-medium text-onyx/60" aria-label="Fil d'Ariane" style="font-size:0.75rem; color:rgba(13,10,24,0.6);">
            <ol class="flex items-center flex-wrap gap-2" style="display:flex; align-items:center; flex-wrap:wrap; gap:8px; list-style:none; padding:0; margin:0;">
              <li><a href="/" class="hover:text-violet-imperial transition-colors" style="color:inherit; text-decoration:none;">Accueil</a></li>
              <li aria-hidden="true">\u203A</li>
              <li><a href="/projets" class="hover:text-violet-imperial transition-colors" style="color:inherit; text-decoration:none;">Projets</a></li>
              <li aria-hidden="true">\u203A</li>
              <li class="text-violet-imperial font-semibold" aria-current="page" style="color:#6600CC; font-weight:600;">${project.title}</li>
            </ol>
          </nav>

          <!-- Project Header -->
          <header class="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-3" style="background-color:rgba(102,0,204,0.1); border:1px solid rgba(102,0,204,0.2); color:#6600CC; display:inline-flex; align-items:center; gap:8px; padding:4px 12px; border-radius:9999px;">
              <span>${project.category}</span>
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
              ${project.title}
            </h1>
            <p class="text-base sm:text-lg md:text-xl text-onyx/75 leading-relaxed font-body" style="color:rgba(13,10,24,0.75);">
              ${accroche}
            </p>
          </header>

          <!-- Hero Image: Pr\xE9servation int\xE9grale, sans rognage ni d\xE9formation -->
          <div class="relative w-full rounded-3xl overflow-hidden bg-[#0D0A18] border border-violet-imperial/15 shadow-soft-lg mb-12 sm:mb-16 p-3 sm:p-6 md:p-8 flex items-center justify-center min-h-[320px] sm:min-h-[460px] md:min-h-[540px]" style="background-color:#0D0A18; border-radius:1.5rem; overflow:hidden; border:1px solid rgba(102,0,204,0.15); display:flex; align-items:center; justify-content:center; position:relative; padding:1.5rem; margin-bottom:3rem;">
            <div style="position:absolute; inset:0; background-image:url(${heroOpt.src}); background-size:cover; background-position:center; filter:blur(40px); opacity:0.25; transform:scale(1.1); pointer-events:none;" aria-hidden="true"></div>
            <img
              src="${heroOpt.src}"
              ${heroOpt.srcSet ? `srcset="${heroOpt.srcSet}"` : ""}
              sizes="(min-width: 1024px) 80vw, 100vw"
              alt="${project.title}"
              width="${heroOpt.width || 1200}"
              height="${heroOpt.height || 675}"
              class="relative z-10 max-h-[580px] sm:max-h-[680px] md:max-h-[760px] w-auto max-w-full h-auto rounded-2xl shadow-soft object-contain"
              style="position:relative; z-index:10; max-height:680px; width:auto; max-width:100%; height:auto; border-radius:1rem; object-fit:contain; margin:0 auto; display:block;"
              loading="eager"
              decoding="async"
            />
          </div>

          <!-- Narrative Grid (3 Blocks) -->
          <section class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12" aria-label="\xC9tude de cas d\xE9taill\xE9e">
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft">
              <span class="text-xs font-bold uppercase tracking-wider text-[#C9A070] block mb-2" style="color:#C9A070;">01. But du client</span>
              <h2 class="text-xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">L\u2019objectif vis\xE9</h2>
              <p class="text-sm sm:text-base text-onyx/80 leading-relaxed font-body" style="color:rgba(13,10,24,0.8); font-size:0.95rem; line-height:1.6;">${project.clientGoal}</p>
            </div>
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft">
              <span class="text-xs font-bold uppercase tracking-wider text-violet-imperial block mb-2" style="color:#6600CC;">02. Ce qui a \xE9t\xE9 con\xE7u</span>
              <h2 class="text-xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">La r\xE9ponse graphique</h2>
              <p class="text-sm sm:text-base text-onyx/80 leading-relaxed font-body" style="color:rgba(13,10,24,0.8); font-size:0.95rem; line-height:1.6;">${project.designedSolution}</p>
            </div>
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-2" style="color:#059669;">03. R\xE9sultat</span>
              <h2 class="text-xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">L\u2019impact constat\xE9</h2>
              <p class="text-sm sm:text-base text-onyx/80 leading-relaxed font-body" style="color:rgba(13,10,24,0.8); font-size:0.95rem; line-height:1.6;">${project.result}</p>
            </div>
          </section>

          <!-- Pr\xE9cision (Disclaimer) if present -->
          ${project.disclaimer ? `
            <aside class="mb-12 p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-onyx/85" style="background-color:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.25); border-radius:1rem; padding:1.25rem;">
              <div class="flex items-start gap-3" style="display:flex; align-items:flex-start; gap:12px;">
                <span class="text-amber-600 text-lg" style="color:#d97706; font-size:1.25rem;">\u26A0\uFE0F</span>
                <div class="text-xs sm:text-sm leading-relaxed" style="font-size:0.875rem; line-height:1.6;">
                  <strong class="font-semibold block text-onyx mb-1" style="color:#0D0A18; font-weight:600; display:block; margin-bottom:4px;">Pr\xE9cision de paternit\xE9 graphique</strong>
                  ${project.disclaimer}
                </div>
              </div>
            </aside>
          ` : ""}

          <!-- Testimonial if present -->
          ${testimonial ? `
            <section class="mb-16 bg-gradient-to-br from-violet-imperial/10 via-white to-or-champagne/10 rounded-3xl p-6 sm:p-10 border border-violet-imperial/20 shadow-soft" style="background:linear-gradient(135deg, rgba(102,0,204,0.08), #ffffff, rgba(201,160,112,0.08)); border-radius:1.5rem; border:1px solid rgba(102,0,204,0.2); padding:2rem;">
              <div class="max-w-2xl mx-auto text-center space-y-4">
                <span class="text-xs font-semibold uppercase tracking-wider text-violet-imperial block" style="color:#6600CC; font-size:0.75rem; letter-spacing:0.05em;">Retour client</span>
                <blockquote class="text-lg sm:text-xl font-title italic text-onyx" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18; font-style:italic;">
                  \xAB ${testimonial.content} \xBB
                </blockquote>
                <footer class="text-xs text-onyx/60 font-medium" style="color:rgba(13,10,24,0.6); font-size:0.75rem;">
                  <strong class="text-onyx block text-sm" style="color:#0D0A18; font-size:0.875rem;">${testimonial.author_name}</strong>
                  ${testimonial.author_role_company || "Client Class S"}
                </footer>
              </div>
            </section>
          ` : ""}

          <!-- Full Masonry Gallery -->
          <section class="mb-16" aria-label="Galerie compl\xE8te des r\xE9alisations">
            <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#C9A070] block mb-2" style="color:#C9A070; font-size:0.75rem; letter-spacing:0.05em;">Galerie int\xE9grale</span>
              <h2 class="text-2xl sm:text-3xl md:text-4xl font-title font-semibold text-onyx" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
                L'ensemble des r\xE9alisations (${project.gallery.length} visuels)
              </h2>
              <p class="text-xs sm:text-sm text-onyx/65 mt-2" style="color:rgba(13,10,24,0.65);">
                Toutes les pi\xE8ces graphiques con\xE7ues pour ce projet, dans leur format original.
              </p>
            </div>

            <div class="columns-2 md:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              ${project.gallery.map((img, idx) => {
        const opt = getOptimizedImage(img.src, { width: 1200 });
        return `
                  <figure class="break-inside-avoid rounded-2xl overflow-hidden bg-onyx border border-violet-imperial/15 shadow-soft mb-4 sm:mb-6" style="border-radius:1rem; overflow:hidden; border:1px solid rgba(102,0,204,0.15); page-break-inside:avoid; break-inside:avoid; margin-bottom:1.25rem;">
                    <img
                      src="${opt.src}"
                      ${opt.srcSet ? `srcset="${opt.srcSet}"` : ""}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 50vw"
                      alt="${img.caption || `${project.title} - visuel ${idx + 1}`}"
                      width="${opt.width || 800}"
                      height="${opt.height || 600}"
                      class="w-full h-auto block"
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                `;
      }).join("")}
            </div>
          </section>

          <!-- Prev / Next Navigation -->
          <nav class="pt-8 border-t border-violet-imperial/15 mb-16" aria-label="Navigation entre projets" style="border-top:1px solid rgba(102,0,204,0.15); padding-top:2rem; margin-bottom:4rem;">
            <div class="flex items-center justify-between gap-4" style="display:flex; justify-content:space-between; align-items:center;">
              <a href="/projets/${prevProject.slug}" class="group text-left p-3 rounded-2xl hover:bg-white/80 transition-all" style="text-decoration:none; color:inherit; text-align:left;">
                <span class="text-xs text-onyx/50 block mb-1" style="display:block; font-size:0.75rem; color:rgba(13,10,24,0.5);">\u2190 Projet pr\xE9c\xE9dent</span>
                <span class="text-base sm:text-lg font-title font-semibold text-onyx group-hover:text-violet-imperial transition-colors" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
                  ${prevProject.title}
                </span>
              </a>
              <a href="/projets/${nextProject.slug}" class="group text-right p-3 rounded-2xl hover:bg-white/80 transition-all" style="text-decoration:none; color:inherit; text-align:right;">
                <span class="text-xs text-onyx/50 block mb-1" style="display:block; font-size:0.75rem; color:rgba(13,10,24,0.5);">Projet suivant \u2192</span>
                <span class="text-base sm:text-lg font-title font-semibold text-onyx group-hover:text-violet-imperial transition-colors" style="font-family:'Cormorant Garamond', Georgia, serif; color:#0D0A18;">
                  ${nextProject.title}
                </span>
              </a>
            </div>
          </nav>

          <!-- CTA Banner -->
          <section class="text-center py-12 px-6 rounded-3xl bg-[#0D0A18] text-white" style="background-color:#0D0A18; color:#ffffff; border-radius:1.5rem; padding:3rem 1.5rem; text-align:center;">
            <h2 class="text-2xl sm:text-3xl font-title font-semibold mb-3 text-white" style="font-family:'Cormorant Garamond', Georgia, serif; color:#ffffff;">
              Pr\xEAt \xE0 confier votre identit\xE9 visuelle \xE0 Scott ?
            </h2>
            <p class="text-sm sm:text-base text-white/75 max-w-lg mx-auto mb-6" style="color:rgba(255,255,255,0.75); max-width:32rem; margin:0 auto 1.5rem auto;">
              Discutons de vos objectifs et cr\xE9ons ensemble les visuels qui feront grandir votre marque.
            </p>
            <a href="/#contact" class="inline-block px-7 py-3.5 bg-white text-[#0D0A18] font-semibold text-sm rounded-full hover:bg-white/90 transition-all" style="display:inline-block; background:#ffffff; color:#0D0A18; font-weight:600; padding:12px 28px; border-radius:9999px; text-decoration:none;">
              D\xE9marrer mon projet
            </a>
          </section>
        </main>
      `;
    }
  } else if (normalizedRoute === "/a-propos") {
    pageTitle = "\xC0 Propos de Scott Nana & Class S | Studio d'Identit\xE9 Visuelle";
    pageDesc = "Class S est un studio d'identit\xE9 visuelle \xE0 Ouagadougou, au service des entrepreneurs et des PME. D\xE9couvrez l'histoire et la vision du design d'impact par Scott Nana.";
    pageCanonical = `${baseUrl}/a-propos`;
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: pageTitle,
      url: pageCanonical,
      description: pageDesc,
      mainEntity: {
        "@type": "Person",
        name: SITE_CONFIG.founder,
        jobTitle: SITE_CONFIG.jobTitle,
        worksFor: {
          "@type": "ProfessionalService",
          name: SITE_CONFIG.name,
          url: baseUrl
        },
        sameAs: Object.values(SITE_CONFIG.socialLinks)
      }
    };
    ssrContent = `
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <span>L'histoire & la vision</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Derri\xE8re Class S
          </h1>
          <p class="text-base sm:text-lg text-onyx/75 leading-relaxed font-medium mb-3">
            ${SITE_CONFIG.anchorPhrase}
          </p>
          <p class="text-sm sm:text-base text-onyx/70 leading-relaxed">
            Comprendre pourquoi une image fait vendre commence par comprendre l\u2019intention derri\xE8re chaque coup de crayon.
          </p>
        </div>

        <!-- 5-Step Narrative Progression -->
        <div class="space-y-10 bg-white rounded-3xl p-6 sm:p-12 border border-violet-imperial/15 shadow-soft mb-12">
          <!-- 01. Le constat -->
          <section class="pb-8 border-b border-violet-imperial/10">
            <span class="text-xs font-bold uppercase text-violet-imperial tracking-wider block mb-2">01. Le constat</span>
            <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Il y a les images qui meublent l'espace, et celles qui g\xE9n\xE8rent du chiffre.
            </h2>
            <div class="space-y-3 text-base text-onyx/80 leading-relaxed">
              <p>Beaucoup d\u2019entreprises et d\u2019entrepreneurs investissent du temps et de l\u2019\xE9nergie dans leur activit\xE9, mais confient leur image au hasard ou \xE0 des mod\xE8les pr\xE9fabriqu\xE9s. Le r\xE9sultat ? Une pr\xE9sence qui passe inaper\xE7ue au milieu du flux continu d\u2019informations, ou qui peine \xE0 inspirer la confiance n\xE9cessaire pour transformer un curieux en acheteur.</p>
              <p>\xC0 l\u2019oppos\xE9, une identit\xE9 visuelle pens\xE9e avec m\xE9thode ne cherche pas simplement \xE0 \xEAtre \xAB jolie \xBB. Elle attire le bon regard, pose instantan\xE9ment l\u2019autorit\xE9 de votre marque et pr\xE9pare le prospect \xE0 passer \xE0 l\u2019action.</p>
            </div>
          </section>

          <!-- 02. Le parcours -->
          <section class="pb-8 border-b border-violet-imperial/10">
            <span class="text-xs font-bold uppercase text-[#C9A070] tracking-wider block mb-2">02. Le parcours</span>
            <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              De la passion du graphisme \xE0 la rigueur de la marque
            </h2>
            <div class="space-y-3 text-base text-onyx/80 leading-relaxed">
              <p>Je m\u2019appelle Scott Nana. Depuis Ouagadougou, j'ai fond\xE9 <strong>Class S</strong> pour accompagner les dirigeants de PME, porteurs de projets et organisateurs d\u2019\xE9v\xE9nements qui veulent donner \xE0 leur structure la stature visuelle qu\u2019elle m\xE9rite.</p>
              <p>D\xE8s mes d\xE9buts et \xE0 l\u2019issue de mes premi\xE8res s\xE9lections techniques dans le domaine de la communication, j\u2019ai rapidement choisi de ne pas me limiter \xE0 la simple ex\xE9cution de visuels. Ce qui m\u2019animait \xE9tait de comprendre les rouages commerciaux derri\xE8re chaque support pour en faire un v\xE9ritable levier de croissance.</p>
            </div>
          </section>

          <!-- 03. Le d\xE9clic -->
          <section class="pb-8 border-b border-violet-imperial/10">
            <span class="text-xs font-bold uppercase text-[#A87FE8] tracking-wider block mb-2">03. Le d\xE9clic</span>
            <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-3" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Le moment o\xF9 tout a pris son sens
            </h2>
            <div class="space-y-3 text-base text-onyx/80 leading-relaxed">
              <p>Environ un an apr\xE8s le lancement de Class S, le vrai d\xE9clic s\u2019est produit. Ce d\xE9clic n\u2019\xE9tait pas une r\xE9action d\u2019agacement face \xE0 des visuels amateurs crois\xE9s dans la rue : c\u2019\xE9tait la prise de conscience \xE9clatante de <strong>l\u2019impact direct et mesurable qu\u2019un design r\xE9fl\xE9chi a sur le d\xE9veloppement des affaires de mes clients</strong>.</p>
              <p>Lorsqu\u2019un client m\u2019a partag\xE9 comment une campagne ou une identit\xE9 repens\xE9e avait d\xE9bloqu\xE9 des prises de contact, rempli une salle ou convaincu des partenaires exigeants, ma vision du m\xE9tier s\u2019est d\xE9finitivement cristallis\xE9e.</p>
            </div>
          </section>

          <!-- 04. La conviction fondamentale -->
          <section class="py-6">
            <div class="p-8 rounded-2xl bg-[#0D0A18] text-white text-center space-y-3">
              <span class="text-xs uppercase font-semibold tracking-widest text-[#C9A070]">04. La conviction fondamentale</span>
              <blockquote class="text-2xl sm:text-3xl font-title font-semibold text-white leading-snug" style="font-family:'Cormorant Garamond', Georgia, serif;">
                \xAB Le design n'est pas une question d'esth\xE9tique. C'est un outil d'impact. \xBB
              </blockquote>
              <p class="text-xs sm:text-sm text-[#F8F5FF]/70 max-w-lg mx-auto">
                Tout ce que je con\xE7ois pour votre marque \u2014 de la couleur d'un bouton au choix d'une typographie \u2014 r\xE9pond \xE0 cette seule exigence d'utilit\xE9 et de r\xE9sultat.
              </p>
            </div>
          </section>

          <!-- 05. \xC9crivons la suite ensemble -->
          <section class="pt-4 text-center space-y-4">
            <span class="text-xs font-bold uppercase text-violet-imperial tracking-wider block">05. \xC9crivons la suite ensemble</span>
            <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Et si nous donnions \xE0 votre marque l'image qui s'impose ?
            </h2>
            <p class="text-sm sm:text-base text-onyx/75 max-w-xl mx-auto">
              Parlez-moi de votre activit\xE9, de vos d\xE9fis actuels et de vos ambitions. Je vous proposerai un cadre de travail sur mesure.
            </p>
            <div class="pt-2">
              <a href="/#contact" class="px-6 py-3 bg-[#6600CC] text-white font-semibold rounded-full inline-block">Prendre contact avec Scott</a>
            </div>
          </section>
        </div>

        <footer class="py-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
          <p>${SITE_CONFIG.anchorPhrase}</p>
        </footer>
      </main>
    `;
  } else if (normalizedRoute === "/blog" || normalizedRoute === "/blog/:slug") {
    let article = null;
    if (slug) {
      article = await getArticle(slug);
    }
    if (slug && !article) {
      const redirectSlug = await getArticleRedirect(slug);
      if (redirectSlug && redirectSlug !== slug) {
        res.setHeader("Location", `${baseUrl}/blog/${redirectSlug}`);
        return res.status(301).end();
      }
      pageTitle = "Page introuvable | Class S";
      pageDesc = "Page introuvable. Votre image, elle, ne devrait jamais l'\xEAtre.";
      pageCanonical = "";
      statusCode = 404;
      isNoIndex = true;
      ssrContent = render404Content();
    } else if (slug && article) {
      pageTitle = `${article.title} | Class S`;
      pageDesc = article.meta_description || article.excerpt || pageDesc;
      if (article.cover_image_og_jpeg && article.cover_image_og_jpeg.trim()) {
        pageImage = article.cover_image_og_jpeg.startsWith("/") ? `${baseUrl}${article.cover_image_og_jpeg}` : article.cover_image_og_jpeg;
      } else if (article.cover_image && article.cover_image.trim()) {
        pageImage = article.cover_image.startsWith("/") ? `${baseUrl}${article.cover_image}` : article.cover_image;
      } else {
        pageImage = SITE_CONFIG.ogImageUrl;
      }
      pageImageWidth = 1200;
      pageImageHeight = 630;
      pageImageAlt = article.cover_image_alt || article.title;
      pageCanonical = `${baseUrl}/blog/${slug}`;
      pageType = "article";
      extraMetaTags = `
    <meta property="article:published_time" content="${article.published_at || article.created_at}" />
    <meta property="article:modified_time" content="${article.updated_at || article.published_at || article.created_at}" />
    ${(article.tags || []).map((t) => `<meta property="article:tag" content="${t.replace(/"/g, "&quot;")}" />`).join("\n    ")}
      `.trim();
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: pageDesc,
        inLanguage: "fr",
        image: [pageImage],
        datePublished: article.published_at || article.created_at || (/* @__PURE__ */ new Date()).toISOString(),
        dateModified: article.updated_at || article.published_at || article.created_at || (/* @__PURE__ */ new Date()).toISOString(),
        author: {
          "@type": "Person",
          name: SITE_CONFIG.founder,
          jobTitle: SITE_CONFIG.jobTitle,
          url: `${baseUrl}/a-propos`
        },
        publisher: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
          logo: {
            "@type": "ImageObject",
            url: SITE_CONFIG.logoUrl
          }
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageCanonical
        }
      };
      const sanitizedContent = sanitizeServerHtml(article.content || `<p>${article.excerpt}</p>`);
      ssrContent = `
        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
          <header class="mb-8">
            <a href="/blog" class="text-xs uppercase font-bold text-violet-imperial tracking-wider hover:underline" style="color:#6600CC;">\u2190 Retour au Journal Class S</a>
            ${article.tags && article.tags.length > 0 ? `
              <div class="flex flex-wrap gap-2 mt-4">
                ${article.tags.map((t) => `<span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-imperial/10 text-violet-imperial" style="background-color:rgba(102,0,204,0.1); color:#6600CC;">${t}</span>`).join("")}
              </div>
            ` : ""}
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight mt-4 mb-3" style="font-family:'Cormorant Garamond', Georgia, serif; font-size:clamp(2rem, 4vw, 3.25rem); line-height:1.2; color:#0D0A18;">
              ${article.title}
            </h1>
            <div class="flex items-center gap-3 text-xs text-onyx/60" style="color:rgba(13,10,24,0.6);">
              <span>Par Scott Nana \xB7 Brand & Graphic Designer</span>
              <span>\u2022</span>
              <span>${article.reading_time || 1} min de lecture</span>
            </div>
          </header>

          ${article.cover_image ? `
            <figure class="my-8 rounded-2xl overflow-hidden border border-black/10">
              <img src="${article.cover_image}" alt="${(article.cover_image_alt || article.title).replace(/"/g, "&quot;")}" fetchpriority="high" class="w-full max-h-[520px] object-cover" />
              ${article.cover_image_alt ? `<figcaption class="text-xs text-center text-onyx/60 mt-2 italic font-body">${article.cover_image_alt}</figcaption>` : ""}
            </figure>
          ` : ""}

          ${article.excerpt ? `
            <div class="p-6 rounded-2xl my-6 border-l-4 border-or-champagne" style="background-color:rgba(212,175,55,0.08); border-left:4px solid #D4AF37;">
              <p class="text-base sm:text-lg text-onyx/95 leading-relaxed" style="font-family:'Jost', sans-serif; color:#0D0A18; margin:0;">${article.excerpt}</p>
            </div>
          ` : ""}

          <div class="prose max-w-none text-base sm:text-lg leading-relaxed text-onyx/90" style="line-height:1.75; max-width:70ch;">
            ${sanitizedContent}
          </div>

          <footer class="mt-16 pt-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
            <p>${SITE_CONFIG.anchorPhrase}</p>
          </footer>
        </article>
      `;
    } else {
      pageTitle = "Journal & Analyses | Strat\xE9gie Visuelle, Branding & Design | Class S";
      pageDesc = "Analyses, d\xE9cryptages et principes graphiques pour transformer l'identit\xE9 visuelle de votre entreprise en levier de conversion commerciale. Par Scott Nana.";
      pageCanonical = `${baseUrl}/blog`;
      pageType = "website";
      const urlObj = new URL(req.url || "/", "https://www.wendclass.com");
      const reqRubrique = (req.query?.rubrique || urlObj.searchParams.get("rubrique") || "").trim();
      const reqQ = (req.query?.q || urlObj.searchParams.get("q") || "").trim();
      const hasBlogFilters = Boolean(reqRubrique || reqQ);
      if (hasBlogFilters) {
        isNoIndexFollow = true;
        pageCanonical = `${baseUrl}/blog`;
      }
      const allArticles = await getArticlesList();
      const top3Articles = allArticles.slice(0, 3);
      const firstHeroCard = top3Articles[0] || null;
      let filteredArticles = allArticles;
      if (reqRubrique && reqRubrique !== "tous") {
        filteredArticles = filteredArticles.filter((art) => {
          const rub = art.rubrique || (art.tags ? inferRubriqueFromTags(art.tags) : "");
          return rub === reqRubrique;
        });
      }
      if (reqQ) {
        const normQ = reqQ.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        filteredArticles = filteredArticles.filter((art) => {
          const matchTitle = (art.title || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQ);
          const matchExcerpt = (art.excerpt || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQ);
          const rubName = getRubriqueName(art.rubrique || (art.tags ? inferRubriqueFromTags(art.tags) : ""));
          const matchRub = ((art.rubrique || "") + " " + rubName).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQ);
          const matchTags = (art.tags || []).some((t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normQ));
          return matchTitle || matchExcerpt || matchRub || matchTags;
        });
      }
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Le Journal Class S \xB7 Scott Nana",
        description: pageDesc,
        url: pageCanonical,
        author: {
          "@type": "Person",
          name: SITE_CONFIG.founder,
          jobTitle: SITE_CONFIG.jobTitle
        }
      };
      ssrContent = `
        <div class="min-h-screen bg-onyx text-ivoire-violet pt-24 pb-20 relative overflow-hidden" style="background-color:#0D0A18; color:#F8F5FF; font-family:'Jost', sans-serif;">
          <!-- SSR HERO -->
          <section aria-label="En-t\xEAte et articles \xE0 la une du Journal Class S" class="relative w-full overflow-hidden border-b border-white/5 pb-12 pt-6 lg:pb-16 lg:pt-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" style="min-height:420px;">
                <!-- Left Text -->
                <div class="lg:col-span-6 flex flex-col justify-center space-y-5 text-left">
                  <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/20 border border-violet-imperial/30 text-amethyste text-xs font-semibold uppercase tracking-widest w-fit" style="background-color:rgba(102,0,204,0.2); border:1px solid rgba(102,0,204,0.3); color:#A87FE8;">
                    <span>\xC9ditorial & Strat\xE9gie Visuelle</span>
                  </div>
                  <h1 class="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]" style="font-family:'Cormorant Garamond', Georgia, serif; color:#FFFFFF;">
                    Le Journal <span style="color:#C9A070;">Class S</span>
                  </h1>
                  <p class="text-base sm:text-lg text-ivoire-violet/75 leading-relaxed max-w-xl" style="color:rgba(248,245,255,0.75);">
                    Analyses, retours d'exp\xE9rience et conseils concrets pour b\xE2tir une marque singuli\xE8re, cr\xE9dible et m\xE9morable.
                  </p>
                  <div class="pt-2">
                    <a href="#filtres-blog" class="inline-flex items-center gap-2 text-xs font-semibold text-amethyste hover:text-white transition-colors" style="color:#A87FE8;">
                      <span>Voir tous les articles \u2193</span>
                    </a>
                  </div>
                </div>

                <!-- Right Animated Stack (First Card SSR Pre-rendered) -->
                <div class="lg:col-span-6 flex flex-col items-center justify-center relative w-full">
                  ${firstHeroCard ? `
                    <div class="relative w-full aspect-[16/10] max-h-[360px] rounded-3xl overflow-hidden border border-white/10 shadow-lg" style="background-color:#0D0A18; border:1px solid rgba(255,255,255,0.1);">
                      <a href="/blog/${firstHeroCard.slug}" class="block relative w-full h-full">
                        ${firstHeroCard.cover_image ? `
                          <img src="${firstHeroCard.cover_image}" alt="${(firstHeroCard.cover_image_alt || firstHeroCard.title).replace(/"/g, "&quot;")}" fetchpriority="high" class="w-full h-full object-cover" />
                        ` : `
                          <div class="w-full h-full bg-gradient-to-br from-ardoise to-onyx flex items-center justify-center">
                            <span class="text-xs uppercase text-amethyste font-bold">Class S Journal</span>
                          </div>
                        `}
                        <div class="absolute top-4 left-4 z-20">
                          <span class="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-onyx/85 text-amethyste border border-amethyste/40" style="background-color:rgba(13,10,24,0.85); color:#A87FE8; border:1px solid rgba(168,127,232,0.4);">
                            ${getRubriqueName(firstHeroCard.rubrique || inferRubriqueFromTags(firstHeroCard.tags))}
                          </span>
                        </div>
                        <div class="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-onyx via-onyx/85 to-transparent z-10 pointer-events-none" style="background:linear-gradient(to top, #0D0A18 0%, rgba(13,10,24,0.85) 60%, transparent 100%);"></div>
                        <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 flex flex-col justify-end space-y-2">
                          <div class="text-xs text-ivoire-violet/75" style="color:rgba(248,245,255,0.75);">
                            <span>${new Date(firstHeroCard.published_at || Date.now()).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span> \u2022 <span>${firstHeroCard.reading_time || 1} min de lecture</span>
                          </div>
                          <span class="block font-bold text-white text-base sm:text-lg lg:text-xl leading-snug" style="color:#FFFFFF;">
                            ${firstHeroCard.title}
                          </span>
                        </div>
                      </a>
                    </div>
                    <!-- Pre-render crawlable links to the other top 3 featured articles -->
                    <nav aria-label="Autres articles r\xE9cents" class="flex items-center gap-3 mt-3 text-xs" style="color:rgba(248,245,255,0.6);">
                      <span>\xC9galement r\xE9cents :</span>
                      ${top3Articles.slice(1).map((art) => `
                        <a href="/blog/${art.slug}" class="text-amethyste hover:underline" style="color:#A87FE8;">${art.title}</a>
                      `).join(" \u2022 ")}
                    </nav>
                  ` : ""}
                </div>
              </div>
            </div>
          </section>

          <!-- SSR FILTER & ARTICLES GRID -->
          <div id="filtres-blog" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
            <div class="flex items-center justify-between text-xs text-ivoire-violet/60 border-b border-white/5 pb-3">
              <span class="font-semibold text-ivoire-violet/90">${filteredArticles.length} ${filteredArticles.length > 1 ? "articles" : "article"}</span>
              <div class="flex items-center gap-2">
                <a href="/blog" class="hover:text-amethyste transition-colors" style="color:#A87FE8;">Tous les articles</a>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${filteredArticles.map((art) => {
        const rubName = getRubriqueName(art.rubrique || inferRubriqueFromTags(art.tags));
        const formattedDate = new Date(art.published_at || Date.now()).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
        return `
                  <article class="rounded-3xl bg-ardoise/60 border border-white/10 p-5 flex flex-col justify-between" style="background-color:rgba(58,47,92,0.6); border:1px solid rgba(255,255,255,0.1);">
                    <div class="space-y-4">
                      <a href="/blog/${art.slug}" class="block aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 relative">
                        ${art.cover_image ? `
                          <img src="${art.cover_image}" alt="${(art.cover_image_alt || art.title).replace(/"/g, "&quot;")}" loading="lazy" class="w-full h-full object-cover" />
                        ` : ""}
                        <div class="absolute top-3 left-3">
                          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-onyx/85 text-amethyste border border-amethyste/30" style="background-color:rgba(13,10,24,0.85); color:#A87FE8;">
                            ${rubName}
                          </span>
                        </div>
                      </a>
                      <div class="flex items-center gap-3 text-xs text-ivoire-violet/50" style="color:rgba(248,245,255,0.5);">
                        <span>${formattedDate}</span>
                        <span>\u2022</span>
                        <span>${art.reading_time || 1} min de lecture</span>
                      </div>
                      <h2 class="text-xl font-title font-bold text-white line-clamp-2 leading-snug" style="font-family:'Cormorant Garamond', Georgia, serif; color:#FFFFFF;">
                        <a href="/blog/${art.slug}" style="color:#FFFFFF;">${art.title}</a>
                      </h2>
                      <p class="text-xs sm:text-sm text-ivoire-violet/70 line-clamp-3 leading-relaxed" style="color:rgba(248,245,255,0.7);">
                        ${art.excerpt}
                      </p>
                    </div>
                    <div class="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                      <span class="text-ivoire-violet/50" style="color:rgba(248,245,255,0.5);">Par Scott Nana</span>
                      <a href="/blog/${art.slug}" class="font-semibold text-or-champagne hover:text-amethyste transition-colors" style="color:#C9A070;">
                        <span>Lire l'article \u2192</span>
                      </a>
                    </div>
                  </article>
                `;
      }).join("")}
            </div>
          </div>
        </div>
      `;
    }
  } else {
    pageTitle = "Page introuvable | Class S";
    pageDesc = "Page introuvable. Votre image, elle, ne devrait jamais l'\xEAtre.";
    pageCanonical = "";
    statusCode = 404;
    isNoIndex = true;
    ssrContent = render404Content();
  }
  if (html.includes("<title>")) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
  } else {
    html = html.replace("</head>", `<title>${pageTitle}</title></head>`);
  }
  const tagsToInject = `
    <meta name="description" content="${pageDesc.replace(/"/g, "&quot;")}" />
    ${pageCanonical ? `<link rel="canonical" href="${pageCanonical}" />` : ""}
    <!-- Open Graph -->
    <meta property="og:site_name" content="Class S \xB7 Scott Nana" />
    <meta property="og:title" content="${pageTitle.replace(/"/g, "&quot;")}" />
    <meta property="og:description" content="${pageDesc.replace(/"/g, "&quot;")}" />
    <meta property="og:type" content="${pageType}" />
    <meta property="og:url" content="${pageCanonical || baseUrl}" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:image" content="${pageImage}" />
    <meta property="og:image:width" content="${pageImageWidth}" />
    <meta property="og:image:height" content="${pageImageHeight}" />
    <meta property="og:image:alt" content="${pageImageAlt.replace(/"/g, "&quot;")}" />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle.replace(/"/g, "&quot;")}" />
    <meta name="twitter:description" content="${pageDesc.replace(/"/g, "&quot;")}" />
    <meta name="twitter:image" content="${pageImage}" />
    ${extraMetaTags ? extraMetaTags : ""}
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
    ${isNoIndexFollow ? '<meta name="robots" content="noindex, follow" />' : isNoIndex ? '<meta name="robots" content="noindex, nofollow" />' : ""}
  `;
  html = html.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<meta\s+name="description"[^>]*>/gi, "").replace(/<link\s+rel="canonical"[^>]*>/gi, "").replace(/<meta\s+property="og:[^>]*>/gi, "").replace(/<meta\s+property="article:[^>]*>/gi, "").replace(/<meta\s+property="twitter:[^>]*>/gi, "").replace(/<meta\s+name="twitter:[^>]*>/gi, "");
  if (isNoIndex) {
    html = html.replace(/<meta\s+name="robots"[^>]*>/gi, "");
  }
  html = html.replace("</head>", `${tagsToInject}
</head>`);
  if (ssrContent && html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${ssrContent}</div>`);
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (isNoIndexFollow) {
    res.setHeader("X-Robots-Tag", "noindex, follow");
  } else if (isNoIndex) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
  }
  if (statusCode === 200) {
    res.setHeader(
      "Cache-Control",
      "public, max-age=120, s-maxage=3600, stale-while-revalidate=86400"
    );
  } else {
    res.setHeader("Cache-Control", "no-store, max-age=0");
  }
  return res.status(statusCode).send(html);
}
export {
  handler as default,
  normalizeProjectSlug
};
