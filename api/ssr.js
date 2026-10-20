// src/ssr.ts
import fs from "fs";
import path from "path";

// src/data/offres.ts
var offersData = [
  {
    id: "logo-identite",
    number: "01",
    title: "Logo & Identit\xE9 Visuelle",
    subtitle: "Chaque \xE9l\xE9ment de votre identit\xE9 sera construit pour qu\u2019elle s\u2019impose dans votre march\xE9 et ne se noie pas parmi vos concurrents.",
    highlightPromise: "3 niveaux adapt\xE9s \xE0 votre stade de d\xE9veloppement (Essentiel, Standard, Signature) pour poser des fondations in\xE9branlables.",
    highlightDetails: [
      "Recherche de logo sur mesure, avec plusieurs propositions de concepts originaux selon le niveau choisi.",
      "Charte graphique compl\xE8te et fichiers finaux export\xE9s dans tous les formats utiles \xE0 votre usage quotidien (print & digital).",
      "Accompagnement et garanties : r\xE9visions incluses, garantie de satisfaction, jusqu\u2019\xE0 l\u2019exclusivit\xE9 sectorielle pour le niveau Signature."
    ],
    accordionDetails: [
      {
        title: "Livrables & D\xE9clinaisons compl\xE9mentaires",
        items: [
          "Mises en situation r\xE9alistes (mockups premium) pour visualiser la marque en conditions r\xE9elles",
          "Kit de lancement pour vos profils de r\xE9seaux sociaux (banni\xE8res, avatars normalis\xE9s)",
          "Sauvegarde s\xE9curis\xE9e permanente de vos fichiers sources originaux",
          "Dossier complet de pr\xE9sentation et d\u2019argumentation de marque",
          "Acc\xE8s \xE0 un mod\xE8le d\u2019outil de devis / facturation aux couleurs de votre identit\xE9",
          "D\xE9lais d\u2019ex\xE9cution clairs et engagements de livraison respect\xE9s"
        ]
      }
    ],
    ctaText: "Discuter de mon identit\xE9 visuelle"
  },
  {
    id: "branding-social-media",
    number: "02",
    title: "Branding Social Media",
    subtitle: "Une pr\xE9sence visuelle continue et percutante chaque mois pour nourrir l\u2019autorit\xE9 de votre marque sans jamais conna\xEEtre la panne d\u2019id\xE9es.",
    badge: "Abonnement mensuel",
    highlightPromise: "2 formules d\u2019accompagnement continu (Pr\xE9sence Continue, Croissance Acc\xE9l\xE9r\xE9e) pens\xE9es comme un moteur de conversion r\xE9gulier.",
    highlightDetails: [
      "Un rythme de publication r\xE9gulier et un planning \xE9ditorial visuel \xE9tabli au pr\xE9alable en d\xE9but de chaque mois.",
      "Des visuels finis, harmonis\xE9s avec votre charte, accompagn\xE9s d\u2019une proposition d\u2019accroche pr\xEAte \xE0 publier.",
      "Un accompagnement strat\xE9gique d\xE9di\xE9 : cr\xE9neau garanti et point d\u2019\xE9change mensuel d\u2019optimisation pour la formule la plus compl\xE8te."
    ],
    accordionDetails: [
      {
        title: "Avantages inclus dans l\u2019abonnement",
        items: [
          "D\xE9clinaison au format Story offerte pour chaque publication pour maximiser la port\xE9e",
          "Conception de carrousels p\xE9dagogiques et strat\xE9giques pour booster l\u2019engagement",
          "R\xE9visions incluses sur chaque livraison de visuels",
          "Garantie de r\xE9activit\xE9 et de retouche rapide en cas d\u2019ajustement impr\xE9vu"
        ]
      }
    ],
    ctaText: "Mettre en place mon abonnement social media"
  },
  {
    id: "sites-web",
    number: "03",
    title: "Sites Web",
    subtitle: "Un site web moderne, rapide et optimis\xE9 pour transformer vos visiteurs en prises de contact directes sur WhatsApp.",
    highlightPromise: "2 formats sur mesure (Vitrine une page ou Multi-pages) avec un atout d\xE9cisif : livr\xE9 en quelques jours.",
    highlightDetails: [
      "Un site livr\xE9 en quelques jours, pas en plusieurs semaines : commencez \xE0 convertir sans d\xE9lai.",
      "Une structure ergonomique fluide pens\xE9e pour valoriser votre offre et pousser chaque visiteur \xE0 l\u2019action.",
      "Un accompagnement post-lancement : p\xE9riode de support et d\u2019ajustements techniques incluse apr\xE8s la mise en ligne."
    ],
    accordionDetails: [
      {
        title: "Sp\xE9cifications techniques & Inclusions",
        items: [
          "Architecture one-page ou multi-pages selon la complexit\xE9 de votre catalogue d\u2019offres",
          "Optimisation SEO technique de base pour le r\xE9f\xE9rencement local (Ouagadougou & sous-r\xE9gion)",
          "Design 100% responsive et fluide sur mobile, tablette et \xE9cran desktop",
          "Int\xE9gration directe des canaux de contact direct (WhatsApp, formulaires conditionnels)",
          "Important : l\u2019h\xE9bergement et le nom de domaine restent \xE0 la charge du client (conseils de choix fournis)."
        ]
      }
    ],
    ctaText: "Lancer la cr\xE9ation de mon site web"
  },
  {
    id: "communication-evenementielle",
    number: "04",
    title: "Communication \xC9v\xE9nementielle",
    subtitle: "Chaque \xE9v\xE9nement a son envergure, son public et ses contraintes propres. Votre dispositif visuel est calibr\xE9 sur mesure pour marquer les esprits.",
    isCustomQuoteOnly: true,
    highlightPromise: "Dispositif complet personnalis\xE9 : affichage grand format, roll-ups, tickets, badges, dossiers de partenariat et campagne digitale.",
    highlightDetails: [],
    ctaText: "Demander un devis sur mesure"
  },
  {
    id: "visuels-a-lunite",
    number: "05",
    title: "Visuels \xE0 l\u2019unit\xE9 & Supports imprim\xE9s",
    subtitle: "Un besoin ponctuel et urgent ? Vos visuels unitaires ou supports imprim\xE9s (kak\xE9monos, b\xE2ches, affiches) con\xE7us et livr\xE9s sous 24 heures.",
    isSingleLine: true,
    deliveryTime: "Livraison garantie sous 24h",
    highlightDetails: [],
    ctaText: "Commander un visuel express"
  }
];

// src/data/projets.ts
var projectsData = [
  {
    id: "72h-cj-2026",
    slug: "72h-cj-2026",
    title: "72 Heures des \xE9tudiants en communication et journalisme 2026",
    category: "Communication \xC9v\xE9nementielle & Carrousel",
    tagline: "Une strat\xE9gie visuelle rythm\xE9e pour surpasser l\u2019impact des \xE9ditions pr\xE9c\xE9dentes.",
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
var SITE_URL = "https://wendclass.vercel.app";
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
  ogImageUrl: `${SITE_URL}/assets/logo/og-image.png`,
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/wendclass",
    facebook: "https://web.facebook.com/wendclass",
    behance: "https://www.behance.net/wendclass"
  }
};

// src/ssr.ts
var supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://mtinydrkpxffrlsuwpzh.supabase.co";
var supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
var fallbackArticles = {
  "pourquoi-un-logo-seul-ne-sauvera-pas-votre-entreprise": {
    title: "Pourquoi un logo seul ne sauvera jamais votre entreprise (et ce qu'il vous faut vraiment)",
    excerpt: "Beaucoup d'entrepreneurs pensent qu'un joli logo suffit \xE0 attirer des clients haut de gamme. En r\xE9alit\xE9, un logo sans syst\xE8me d'identit\xE9 visuelle est une coquille vide. D\xE9cryptage d'une erreur co\xFBteuse.",
    meta_description: "D\xE9couvrez pourquoi un logo seul ne suffit pas \xE0 asseoir votre cr\xE9dibilit\xE9 et comment un v\xE9ritable syst\xE8me d'identit\xE9 visuelle transforme la perception de votre entreprise.",
    cover_image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-10-09T10:00:00.000Z",
    content: "<p>Un logo sans \xE9cosyst\xE8me visuel ne cr\xE9e aucune valeur per\xE7ue. B\xE2tissez un univers complet pour inspirer confiance et justifier des tarifs premium.</p>"
  },
  "5-erreurs-graphiques-reseaux-sociaux-credibilite": {
    title: "Les 5 erreurs graphiques sur les r\xE9seaux sociaux qui d\xE9truisent votre cr\xE9dibilit\xE9",
    excerpt: "Des visuels satur\xE9s, des polices illisibles, une incoh\xE9rence de couleurs d'un post \xE0 l'autre... Voici les faux pas visuels qui font fuir vos prospects qualifi\xE9s et comment les corriger sans tarder.",
    meta_description: "Typographies illisibles, manque de coh\xE9rence chromatique, surcharge d'informations : \xE9vitez ces 5 erreurs graphiques qui font fuir vos prospects sur les r\xE9seaux sociaux.",
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-10-05T10:00:00.000Z",
    content: "<p>Sur les r\xE9seaux sociaux, 1,7 seconde d\xE9cide de l'attention d'un prospect. \xC9vitez les erreurs graphiques qui ruinent votre professionnalisme.</p>"
  },
  "transformer-identite-visuelle-en-levier-de-conversion": {
    title: "Comment transformer une identit\xE9 visuelle en levier de conversion commerciale",
    excerpt: "Le design n'est pas une simple d\xE9coration esth\xE9tique : c'est un outil de vente puissant. D\xE9couvrez comment structurer votre univers de marque pour inspirer confiance et justifier des tarifs premium.",
    meta_description: "Le design graphique n'est pas une simple d\xE9pense esth\xE9tique : c'est un investissement strat\xE9gique qui r\xE9duit les frictions de vente et justifie des tarifs \xE9lev\xE9s.",
    cover_image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-09-28T10:00:00.000Z",
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
              slug: p.slug,
              title: p.title,
              category: p.category,
              tagline: p.tagline,
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
          return list[0];
        }
      }
    } catch (err) {
      console.warn("[SSR] Supabase article fetch fallback:", err);
    }
  }
  return fallbackArticles[slug] || null;
}
async function getArticlesList() {
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=slug,title,excerpt,cover_image,published_at&status=eq.publie&order=published_at.desc`,
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
  const slug = req.query.slug || (cleanPath.startsWith("/blog/") ? cleanPath.slice("/blog/".length) : "");
  let normalizedRoute = "/";
  if (cleanPath === "/") normalizedRoute = "/";
  else if (cleanPath === "/offres") normalizedRoute = "/offres";
  else if (cleanPath === "/projets") normalizedRoute = "/projets";
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
  let pageType = "website";
  let ssrContent = "";
  let jsonLd = null;
  let statusCode = 200;
  let isNoIndex = false;
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
    pageDesc = "D\xE9couvrez nos 5 formules d'accompagnement en identit\xE9 visuelle, branding social media, sites web et communication \xE9v\xE9nementielle \xE0 Ouagadougou.";
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
        "@type": "ItemList",
        name: "Formules d'accompagnement Class S",
        numberOfItems: offersData.length,
        itemListElement: offersData.map((offer, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: offer.title,
            description: offer.subtitle,
            provider: {
              "@type": "ProfessionalService",
              name: SITE_CONFIG.name
            }
          }
        }))
      }
    };
    ssrContent = `
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Nos formules d'accompagnement</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Des formules con\xE7ues pour faire grandir votre activit\xE9
          </h1>
          <p class="text-base sm:text-lg text-onyx/75 leading-relaxed">
            Chaque offre est calibr\xE9e pour apporter une r\xE9ponse graphique strat\xE9gique \xE0 un besoin pr\xE9cis. Aucun tarif g\xE9n\xE9rique : chaque collaboration fait l\u2019objet d\u2019un \xE9change pr\xE9alable pour adapter le dispositif \xE0 vos objectifs.
          </p>
        </div>

        <!-- Engagement -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-violet-imperial/10 via-white to-or-champagne/10 border border-violet-imperial/20 text-center mb-12">
          <p class="text-lg font-title italic" style="font-family:'Cormorant Garamond', Georgia, serif;">
            \xAB Chaque \xE9l\xE9ment de votre identit\xE9 sera construit pour qu'elle s'impose dans votre march\xE9 et ne se noie pas parmi vos concurrents. \xBB
          </p>
          <span class="text-xs text-violet-imperial font-semibold uppercase tracking-wider mt-2 block">\u2014 Engagement de conception Class S</span>
        </div>

        <!-- 5 Offers with ALL Accordion Content in DOM -->
        <div class="space-y-8 mb-16">
          ${offersData.map((offer) => `
            <article class="bg-white rounded-3xl p-6 sm:p-8 border border-violet-imperial/15 shadow-soft">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-sm font-bold text-[#C9A070] uppercase">${offer.number}</span>
                ${offer.badge ? `<span class="px-3 py-0.5 rounded-full bg-violet-imperial/10 text-violet-imperial text-xs font-semibold">${offer.badge}</span>` : ""}
                ${offer.isCustomQuoteOnly ? `<span class="px-3 py-0.5 rounded-full bg-[#C9A070]/15 text-[#8A5E2E] text-xs font-semibold">Sur devis personnalis\xE9</span>` : ""}
              </div>
              <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
                ${offer.title}
              </h2>
              <p class="text-sm sm:text-base text-onyx/75 mb-4">${offer.subtitle}</p>

              ${offer.highlightPromise ? `
                <div class="p-4 rounded-xl bg-violet-imperial/5 border border-violet-imperial/10 mb-4 text-xs font-medium text-onyx/85">
                  ${offer.highlightPromise}
                </div>
              ` : ""}

              ${offer.highlightDetails && offer.highlightDetails.length > 0 ? `
                <ul class="space-y-2 mb-6 text-sm text-onyx/80">
                  ${offer.highlightDetails.map((detail) => `
                    <li class="flex items-start gap-2">
                      <span class="text-[#6600CC]">\u2713</span>
                      <span>${detail}</span>
                    </li>
                  `).join("")}
                </ul>
              ` : ""}

              <!-- Contenu des accord\xE9ons PR\xC9SENT DANS LE DOM INITIAL -->
              ${offer.accordionDetails && offer.accordionDetails.length > 0 ? `
                <div class="pt-4 border-t border-violet-imperial/10 space-y-3">
                  ${offer.accordionDetails.map((acc) => `
                    <div class="bg-ivoire-violet/50 rounded-xl p-4">
                      <h3 class="font-semibold text-xs uppercase tracking-wider text-onyx mb-2">${acc.title}</h3>
                      <ul class="space-y-1.5 text-xs text-onyx/75">
                        ${acc.items.map((it) => `
                          <li class="flex items-start gap-2">
                            <span class="text-[#C9A070]">\u2022</span>
                            <span>${it}</span>
                          </li>
                        `).join("")}
                      </ul>
                    </div>
                  `).join("")}
                </div>
              ` : ""}

              <div class="mt-6 pt-4">
                <a href="/#contact" class="inline-block px-5 py-2.5 bg-[#6600CC] text-white text-sm font-semibold rounded-full">${offer.ctaText}</a>
              </div>
            </article>
          `).join("")}
        </div>

        <!-- FAQ -->
        <section class="max-w-4xl mx-auto mb-16">
          <h2 class="text-2xl sm:text-3xl font-title font-semibold text-center mb-8" style="font-family:'Cormorant Garamond', Georgia, serif;">
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
            description: proj.tagline || proj.category,
            creator: {
              "@type": "Person",
              name: SITE_CONFIG.founder
            }
          }
        }))
      }
    };
    ssrContent = `
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <span>R\xE9alisations & \xC9tudes de cas</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
            Chaque visuel a une mission commerciale
          </h1>
          <p class="text-base sm:text-lg text-onyx/75 leading-relaxed">
            D\xE9couvrez l\u2019int\xE9gralit\xE9 des visuels et dispositifs con\xE7us pour chaque projet, avec leur intention strat\xE9gique et leur impact.
          </p>
        </div>

        <!-- Projects Deep Dives -->
        <div class="space-y-12 mb-16">
          ${projects.map((p, idx) => `
            <article id="${p.slug}" class="bg-white rounded-3xl p-6 sm:p-10 border border-violet-imperial/15 shadow-soft">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xs font-bold text-[#C9A070] uppercase">Projet 0${idx + 1}</span>
                <span class="px-3 py-0.5 rounded-full bg-violet-imperial/10 text-violet-imperial text-xs font-semibold uppercase">${p.category}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-title font-semibold text-onyx mb-1" style="font-family:'Cormorant Garamond', Georgia, serif;">
                ${p.title}
              </h2>
              <p class="text-sm italic text-onyx/75 mb-6">${p.tagline}</p>

              <!-- 3-Part Case Study Grid (But -> Solution -> R\xE9sultat) -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-ivoire-violet/70 rounded-2xl p-4 border border-violet-imperial/10">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-violet-imperial mb-2">1. But du client</h3>
                  <p class="text-sm text-onyx/85 leading-relaxed">${p.clientGoal}</p>
                </div>
                <div class="bg-ivoire-violet/70 rounded-2xl p-4 border border-violet-imperial/10">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-violet-imperial mb-2">2. Ce qui a \xE9t\xE9 con\xE7u</h3>
                  <p class="text-sm text-onyx/85 leading-relaxed">${p.designedSolution}</p>
                </div>
                <div class="bg-ivoire-violet/70 rounded-2xl p-4 border border-violet-imperial/10">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-violet-imperial mb-2">3. R\xE9sultat obtenu</h3>
                  <p class="text-sm text-onyx/85 leading-relaxed">${p.result}</p>
                </div>
              </div>

              ${p.disclaimer ? `
                <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-6">
                  \u26A0\uFE0F ${p.disclaimer}
                </div>
              ` : ""}

              <!-- Galerie de visuels -->
              <div class="pt-4 border-t border-violet-imperial/10">
                <h3 class="text-xs font-bold uppercase tracking-wider text-onyx mb-3">Galerie des r\xE9alisations (${p.gallery.length} visuels)</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  ${p.gallery.map((img) => `
                    <figure class="rounded-xl overflow-hidden bg-onyx aspect-square border border-violet-imperial/10">
                      <img src="${img.src}" alt="${img.caption || p.title}" class="w-full h-full object-cover" loading="lazy" />
                    </figure>
                  `).join("")}
                </div>
              </div>

              ${p.testimonialPlaceholder ? `
                <div class="mt-6 p-4 rounded-xl bg-violet-imperial/5 border border-violet-imperial/10 text-xs italic text-onyx/80">
                  \u{1F4AC} \xAB ${p.testimonialPlaceholder} \xBB
                </div>
              ` : ""}
            </article>
          `).join("")}
        </div>

        <footer class="py-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
          <p>${SITE_CONFIG.anchorPhrase}</p>
        </footer>
      </main>
    `;
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
      pageTitle = "Page introuvable | Class S";
      pageDesc = "Page introuvable. Votre image, elle, ne devrait jamais l'\xEAtre.";
      pageCanonical = "";
      statusCode = 404;
      isNoIndex = true;
      ssrContent = render404Content();
    } else if (slug && article) {
      pageTitle = `${article.title} | Class S`;
      pageDesc = article.meta_description || article.excerpt || pageDesc;
      pageImage = article.cover_image || `${baseUrl}/assets/logo/og-image.png`;
      pageCanonical = `${baseUrl}/blog/${slug}`;
      pageType = "article";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: pageDesc,
        image: [pageImage],
        datePublished: article.published_at || (/* @__PURE__ */ new Date()).toISOString(),
        author: {
          "@type": "Person",
          name: SITE_CONFIG.founder,
          jobTitle: SITE_CONFIG.jobTitle
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
      ssrContent = `
        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
          <div class="mb-8">
            <a href="/blog" class="text-xs uppercase font-bold text-violet-imperial tracking-wider hover:underline">\u2190 Retour au Journal Class S</a>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight mt-4 mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
              ${article.title}
            </h1>
            <p class="text-xs text-onyx/60">Par Scott Nana \u2014 Brand & Graphic Designer</p>
          </div>
          ${article.cover_image ? `
            <img src="${article.cover_image}" alt="${article.title}" class="w-full rounded-2xl mb-8 max-h-[480px] object-cover" />
          ` : ""}
          <div class="prose max-w-none text-base sm:text-lg leading-relaxed text-onyx/85">
            ${article.content || `<p>${article.excerpt}</p>`}
          </div>
          <footer class="mt-12 pt-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
            <p>${SITE_CONFIG.anchorPhrase}</p>
          </footer>
        </article>
      `;
    } else {
      pageTitle = "Le Journal Class S \u2014 Strat\xE9gie Visuelle & Branding | Scott Nana";
      pageDesc = "Analyses, d\xE9cryptages et principes graphiques pour transformer l'identit\xE9 visuelle de votre entreprise en levier de conversion commerciale.";
      pageCanonical = `${baseUrl}/blog`;
      const articlesList = await getArticlesList();
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Le Journal Class S",
        url: pageCanonical,
        description: pageDesc,
        author: {
          "@type": "Person",
          name: SITE_CONFIG.founder
        }
      };
      ssrContent = `
        <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" style="font-family:'Jost', sans-serif; color:#0D0A18;">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
              <span>\xC9ditorial & Strat\xE9gie</span>
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-title font-semibold text-onyx leading-tight mb-4" style="font-family:'Cormorant Garamond', Georgia, serif;">
              Le Journal Class S
            </h1>
            <p class="text-base sm:text-lg text-onyx/75 leading-relaxed">
              Analyses, d\xE9cryptages et principes graphiques par Scott Nana.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            ${articlesList.map((art) => `
              <article class="bg-white rounded-2xl overflow-hidden border border-violet-imperial/15 shadow-soft flex flex-col">
                ${art.cover_image ? `<img src="${art.cover_image}" alt="${art.title}" class="aspect-[16/10] w-full object-cover" loading="lazy" />` : ""}
                <div class="p-6 flex flex-col flex-grow">
                  <h2 class="text-xl font-title font-semibold text-onyx mb-2" style="font-family:'Cormorant Garamond', Georgia, serif;">
                    <a href="/blog/${art.slug}" class="hover:text-violet-imperial transition-colors">${art.title}</a>
                  </h2>
                  <p class="text-xs text-onyx/75 leading-relaxed mb-4 flex-grow">${art.excerpt}</p>
                  <a href="/blog/${art.slug}" class="text-xs font-semibold text-violet-imperial hover:underline">Lire l'analyse \u2192</a>
                </div>
              </article>
            `).join("")}
          </div>

          <footer class="py-8 border-t border-violet-imperial/10 text-center text-xs text-onyx/70">
            <p>${SITE_CONFIG.anchorPhrase}</p>
          </footer>
        </main>
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
    <meta property="og:title" content="${pageTitle.replace(/"/g, "&quot;")}" />
    <meta property="og:description" content="${pageDesc.replace(/"/g, "&quot;")}" />
    <meta property="og:type" content="${pageType}" />
    <meta property="og:url" content="${pageCanonical}" />
    <meta property="og:image" content="${pageImage}" />
    <meta property="og:site_name" content="Class S \u2014 Scott Nana" />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle.replace(/"/g, "&quot;")}" />
    <meta name="twitter:description" content="${pageDesc.replace(/"/g, "&quot;")}" />
    <meta name="twitter:image" content="${pageImage}" />
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
    ${isNoIndex ? '<meta name="robots" content="noindex, nofollow" />' : ""}
  `;
  html = html.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<meta\s+name="description"[^>]*>/gi, "").replace(/<link\s+rel="canonical"[^>]*>/gi, "").replace(/<meta\s+property="og:[^>]*>/gi, "").replace(/<meta\s+property="twitter:[^>]*>/gi, "").replace(/<meta\s+name="twitter:[^>]*>/gi, "");
  if (isNoIndex) {
    html = html.replace(/<meta\s+name="robots"[^>]*>/gi, "");
  }
  html = html.replace("</head>", `${tagsToInject}
</head>`);
  if (ssrContent && html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${ssrContent}</div>`);
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (isNoIndex) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
  }
  if (statusCode === 200) {
    res.setHeader(
      "Cache-Control",
      "public, max-age=60, s-maxage=120, stale-while-revalidate=600"
    );
  } else {
    res.setHeader("Cache-Control", "no-store, max-age=0");
  }
  return res.status(statusCode).send(html);
}
export {
  handler as default
};
