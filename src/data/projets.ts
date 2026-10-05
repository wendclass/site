export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  clientGoal: string;
  designedSolution: string;
  result: string;
  testimonialPlaceholder?: string;
  disclaimer?: string;
  heroImage: string;
  gallery: {
    src: string;
    caption: string;
  }[];
  accentColor?: string;
}

export const projectsData: Project[] = [
  {
    id: '72h-cj-2026',
    slug: '72h-cj-2026',
    title: '72 Heures des étudiants en communication et journalisme 2026',
    category: 'Communication Événementielle & Carrousel',
    tagline: 'Une stratégie visuelle rythmée pour surpasser l’impact des éditions précédentes.',
    clientGoal: 'Faire mieux que l’édition précédente de l’événement en termes de visibilité et d’engouement.',
    designedSolution: 'Conception principale autour d’un carrousel créatif et stratégique surfant sur la Saint-Valentin ; ensemble de visuels complémentaires comprenant l’annonce de stand disponible, les concours et la couverture officielle du rapport d’activité.',
    result: 'Client pleinement satisfait de la dynamique créée et de la cohérence globale sur tous les canaux.',
    testimonialPlaceholder: '« Scott a su capter l’esprit de notre événement et concevoir des supports qui ont immédiatement suscité des réactions et des inscriptions. » — Comité d’organisation 72h CJ',
    heroImage: '/assets/projets/72h-cj-2026/Carrousel 0 72h 2026.png',
    gallery: [
      {
        src: '/assets/projets/72h-cj-2026/Carrousel 0 72h 2026.png',
        caption: 'Accroche principale du carrousel événementiel (Saint-Valentin)'
      },
      {
        src: '/assets/projets/72h-cj-2026/Carrousel 1 72h 2026.png',
        caption: 'Carrousel — Slide 1 : Le déclic'
      },
      {
        src: '/assets/projets/72h-cj-2026/Carrousel 2 72h 2026.png',
        caption: 'Carrousel — Slide 2 : La promesse'
      },
      {
        src: '/assets/projets/72h-cj-2026/Carrousel 3 72h 2026.png',
        caption: 'Carrousel — Slide 3 : L’appel à l’action'
      },
      {
        src: "/assets/projets/72h-cj-2026/Cover Rapport d'Activités 72H 2026.png",
        caption: 'Couverture officielle du rapport d’activités 72h 2026'
      },
      {
        src: '/assets/projets/72h-cj-2026/Stands disponibles 72h 2026.png',
        caption: 'Annonce commerciale — Réservation des stands exposants'
      },
      {
        src: '/assets/projets/72h-cj-2026/Final des Compétitions v1.png',
        caption: 'Visuel officiel — Grande finale des compétitions'
      },
      {
        src: '/assets/projets/72h-cj-2026/Ambassadrice & Ambassadeur 72h 2026 v2.1.png',
        caption: 'Présentation des ambassadeurs et ambassadrices'
      },
      {
        src: '/assets/projets/72h-cj-2026/Appel à compétition v3.0.png',
        caption: 'Visuel d’appel à candidatures et compétitions'
      },
      {
        src: '/assets/projets/72h-cj-2026/Visuel Prix Pazouknam Ouedraogo v2.png',
        caption: 'Visuel de distinction — Prix Pazouknam Ouédraogo'
      },
      {
        src: '/assets/projets/72h-cj-2026/8 mars 72h 2026.png',
        caption: 'Célébration du 8 mars dans le cadre des 72h CJ'
      },
      {
        src: '/assets/projets/72h-cj-2026/Récapitulatif Chronogramme 72heures.png',
        caption: 'Récapitulatif complet du chronogramme des 3 jours'
      },
      {
        src: '/assets/projets/72h-cj-2026/Chronogramme Jour 1 72h ed 26 PAD.png',
        caption: 'Programme détaillé — Jour 1'
      },
      {
        src: '/assets/projets/72h-cj-2026/Chronogramme Jour 2 72h 26 PAD.png',
        caption: 'Programme détaillé — Jour 2'
      },
      {
        src: '/assets/projets/72h-cj-2026/Chronogramme Jour 3 72h 26 PAD.png',
        caption: 'Programme détaillé — Jour 3'
      }
    ]
  },
  {
    id: 'mon-frere-parle',
    slug: 'mon-frere-parle',
    title: 'Mon Frère, Parle',
    category: 'Identité Visuelle & Campagne de Sensibilisation',
    tagline: 'Une identité apaisante pour libérer la parole des hommes sur la santé mentale.',
    clientGoal: 'Faire connaître un nouveau format de thérapie destiné aux hommes, à l’occasion du mois de la santé mentale.',
    designedSolution: 'Une identité visuelle pensée pour apaiser l’esprit et libérer des surcharges mentales : palette chromatique douce, typographie bienveillante et gestion aérée des espaces négatifs, orchestrées au service d’un message profondément humain.',
    result: 'Client satisfait de l’accueil bienveillant et de la justesse du ton véhiculé par chaque support.',
    testimonialPlaceholder: '« L’approche visuelle a immédiatement posé un cadre rassurant pour les participants. Scott a traduit avec pudeur et force ce que nous voulions transmettre. » — Initiateur du projet',
    heroImage: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Visuel_Principal.jpg',
    gallery: [
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Visuel_Principal.jpg',
        caption: 'Affiche principale de sensibilisation'
      },
      {
        src: '/assets/projets/mon-frere-parle/Logotype_v1_mon_frère_parle.png',
        caption: 'Logotype officiel Mon Frère, Parle'
      },
      {
        src: '/assets/projets/mon-frere-parle/MFP_OutdoorPosterMockup004.png',
        caption: 'Affichage urbain grand format en situation'
      },
      {
        src: '/assets/projets/mon-frere-parle/Certification Mockup MFP.png',
        caption: 'Mise en situation du certificat de participation'
      },
      {
        src: '/assets/projets/mon-frere-parle/MFP_HandCardMockup.png',
        caption: 'Cartes d’accompagnement et de soutien en main'
      },
      {
        src: '/assets/projets/mon-frere-parle/MFP_PostCardMockup.png',
        caption: 'Mockup carte postale de sensibilisation'
      },
      {
        src: '/assets/projets/mon-frere-parle/instagram post mockup MFP.png',
        caption: 'Mise en situation post Instagram'
      },
      {
        src: '/assets/projets/mon-frere-parle/Teaser Instagram Post Mockup MFP.png',
        caption: 'Teaser Instagram en situation'
      },
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Coming_soon_0.jpg',
        caption: 'Teaser — Annonce Coming Soon 1'
      },
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Coming_soon_2.jpg',
        caption: 'Teaser — Annonce Coming Soon 2'
      },
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Coming_soon_3.jpg',
        caption: 'Teaser — Annonce Coming Soon 3'
      },
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Décompte.jpg',
        caption: 'Visuel de décompte avant lancement'
      },
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Invitation.jpg',
        caption: 'Visuel d’invitation aux sessions'
      },
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Invité_Spécial.jpg',
        caption: 'Annonce de l’invité spécial'
      },
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Objectif.jpg',
        caption: 'Présentation des objectifs thérapeutiques'
      },
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Témoignage.jpg',
        caption: 'Visuel de valorisation des témoignages'
      },
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Chroogramme_v2.jpg',
        caption: 'Chronogramme des ateliers et rencontres'
      },
      {
        src: '/assets/projets/mon-frere-parle/Mon_Frère_Parle_Thanks_FANKANI.jpg',
        caption: 'Visuel de remerciement aux intervenants'
      }
    ]
  },
  {
    id: 'off-day',
    slug: 'off-day',
    title: 'Off Day : 24H sans écran, 24H pour moi',
    category: 'Communication Événementielle & Campagne Digitale',
    tagline: 'Une conception épurée pour marquer les esprits dès la première édition.',
    clientGoal: 'Captiver et marquer les esprits pour installer la toute première édition de l’événement.',
    designedSolution: 'Une direction artistique axée sur la simplicité radicale et l’espace, pensée pour retenir l’attention du public sans surcharger son esprit — en résonance directe avec le concept de déconnexion numérique.',
    result: 'Client satisfait du niveau d’attention et de la mémorisation forte suscités par la campagne.',
    testimonialPlaceholder: '« Les visuels ont donné vie au concept avant même le jour J. L’impact a été instantané auprès de notre audience. » — Équipe Off Day',
    disclaimer: 'Note d’attribution : Le logo de cet événement a été conçu par un autre graphiste via intelligence artificielle, sans intervention créative de Scott Nana / Class S. L’intervention de Class S a porté exclusivement sur la stratégie visuelle, la conception graphique des supports et la campagne de communication.',
    heroImage: '/assets/projets/off-day/Off_Day_Visual_v2.2 Corrigé.png',
    gallery: [
      {
        src: '/assets/projets/off-day/Off_Day_Visual_v2.2 Corrigé.png',
        caption: 'Visuel officiel de la campagne Off Day'
      },
      {
        src: '/assets/projets/off-day/Off_Day_StayFree_00.png',
        caption: 'Série Stay Free — Concept 00'
      },
      {
        src: '/assets/projets/off-day/Off_Day_StayFree_01.png',
        caption: 'Série Stay Free — Concept 01'
      },
      {
        src: '/assets/projets/off-day/Off_Day_StayFree_02.png',
        caption: 'Série Stay Free — Concept 02'
      },
      {
        src: '/assets/projets/off-day/Off_Day_StayFree_03.png',
        caption: 'Série Stay Free — Concept 03'
      },
      {
        src: '/assets/projets/off-day/Off_Day_StayFree_04.png',
        caption: 'Série Stay Free — Concept 04'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Movie_Night_14th_v2.2.png',
        caption: 'Annonce Movie Night événementielle'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Soirée_Ciné.png',
        caption: 'Visuel Soirée Cinéma & Débat'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Plaidoirie_v3.6.png',
        caption: 'Support de plaidoirie pour la déconnexion'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Plaidorie_Modalités_v2.png',
        caption: 'Modalités de participation au concours de plaidoirie'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Mode_Snooz_v2.png',
        caption: 'Concept visuel — Mode Snooze activé'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Invisibilité_Défi.png',
        caption: 'Défi Invisibilité numérique'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Invisibilité_Teaser.png',
        caption: 'Teaser du défi Invisibilité'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Coming_Soon_v2.png',
        caption: 'Teaser d’annonce — Coming Soon v1'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Coming_Soon_2_v2.png',
        caption: 'Teaser d’annonce — Coming Soon v2'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Coming_Soon_3.2.png',
        caption: 'Teaser d’annonce — Coming Soon v3'
      },
      {
        src: '/assets/projets/off-day/Profis_Quiz_OffDay_Le_Conscient.png',
        caption: 'Profil Quiz — Le Conscient'
      },
      {
        src: '/assets/projets/off-day/Profis_Quiz_OffDay_La_Consciente.png',
        caption: 'Profil Quiz — La Consciente'
      },
      {
        src: '/assets/projets/off-day/Profis_Quiz_OffDay_Le_Fragile.png',
        caption: 'Profil Quiz — Le Fragile'
      },
      {
        src: '/assets/projets/off-day/Profis_Quiz_OffDay_La_Fragile.png',
        caption: 'Profil Quiz — La Fragile'
      },
      {
        src: '/assets/projets/off-day/Profis_Quiz_OffDay_Le_Zombie_connecte.png',
        caption: 'Profil Quiz — Le Zombie connecté'
      },
      {
        src: '/assets/projets/off-day/Profis_Quiz_OffDay_La_Zombie_connectee.png',
        caption: 'Profil Quiz — La Zombie connectée'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Quiz_Teaser.png',
        caption: 'Teaser du grand Quiz d’évaluation'
      },
      {
        src: '/assets/projets/off-day/Réseaux_Sociaux_Conférence_Presse_Off_Day_v2.2.png',
        caption: 'Annonce de la conférence de presse'
      },
      {
        src: '/assets/projets/off-day/Bannière_Facebook_OffDay.png',
        caption: 'Bannière officielle Facebook'
      },
      {
        src: '/assets/projets/off-day/Invitation_Off_Day RECTO.png',
        caption: 'Carte d’invitation VIP (Recto)'
      },
      {
        src: '/assets/projets/off-day/Invitation_Off_Day VERSO.png',
        caption: 'Carte d’invitation VIP (Verso)'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Flyer_Recto.png',
        caption: 'Flyer grand public (Recto)'
      },
      {
        src: '/assets/projets/off-day/Off_Day_Flyer_Verso.png',
        caption: 'Flyer grand public (Verso)'
      }
    ]
  },
  {
    id: 'cafe-inspire',
    slug: 'cafe-inspire',
    title: 'Café Inspire',
    category: 'Branding Social Media & Campagnes Publicitaires',
    tagline: 'Structuration d’une identité visuelle récurrente pour stimuler l’engagement commercial.',
    clientGoal: 'Obtenir des visuels de qualité pour alimenter régulièrement sa page Facebook et lancer des campagnes publicitaires performantes.',
    designedSolution: 'Création en amont d’une mini-charte graphique cohérente (palette, codes typographiques, templates de mise en page) à partir du logo initial, suivie de la production mensuelle de visuels percutants adaptés aux temps forts du café.',
    result: 'Les nouveaux visuels ont nettement capté et attiré davantage l’attention que les publications antérieures du client.',
    testimonialPlaceholder: '« Nos clients nous ont fait des retours immédiats sur le changement d’image de la page. C’est beaucoup plus pro et nos offres ressortent enfin. » — Gérance Café Inspire',
    heroImage: '/assets/projets/cafe-inspire/01_Café Pyramide v3.png',
    gallery: [
      {
        src: '/assets/projets/cafe-inspire/01_Café Pyramide v3.png',
        caption: 'Mise en avant signature — Café Pyramide (Version principale)'
      },
      {
        src: '/assets/projets/cafe-inspire/02_Café Pyramide v2.png',
        caption: 'Déclinaison visuelle — Café Pyramide'
      },
      {
        src: '/assets/projets/cafe-inspire/03_Anniversaire_Café_Inspire_v2.1.png',
        caption: 'Visuel événementiel — Anniversaire Café Inspire'
      },
      {
        src: '/assets/projets/cafe-inspire/04_Livraison_Gratuite_Mercredi_Café Inspire v2.png',
        caption: 'Offre promotionnelle — Livraison gratuite du mercredi'
      },
      {
        src: '/assets/projets/cafe-inspire/05_Bon_Mois_Septembre v2.png',
        caption: 'Visuel relationnel & vœux — Bon mois de septembre'
      },
      {
        src: '/assets/projets/cafe-inspire/06_Tacos_Café_Inspire v2.png',
        caption: 'Mise en avant gourmande — Tacos & restauration'
      },
      {
        src: '/assets/projets/cafe-inspire/07_Hiring_AideChef.png',
        caption: 'Avis de recrutement — Aide Chef cuisinier'
      },
      {
        src: '/assets/projets/cafe-inspire/08_Nouveau_Plat_Café Inspire.png',
        caption: 'Lancement au menu — Nouveau plat Café Inspire'
      }
    ]
  },
  {
    id: 'bang',
    slug: 'bang',
    title: 'Bang',
    category: 'Identité Visuelle de Marque & Stratégie',
    tagline: 'Une identité singulière pour réinventer l’expérience de révision des élèves et étudiants.',
    clientGoal: 'Rendre plus faciles et stimulantes les révisions des étudiants et élèves grâce à une identité visuelle distincte, mémorable et structurée.',
    designedSolution: 'Création d’une identité unique avec une palette chromatique audacieuse rompant avec les codes académiques conventionnels, et conception d’un logotype original garanti sans similitude avec les marques existantes sur les moteurs de recherche.',
    result: 'Client pleinement satisfait du positionnement novateur et de la reconnaissance immédiate de la marque.',
    testimonialPlaceholder: '« L’identité Bang a tout de suite trouvé son public. Elle dégage exactement l’énergie moderne et motivante dont les étudiants ont besoin. » — Fondateur Bang',
    heroImage: '/assets/projets/bang/Présentation_bang_logo.png',
    gallery: [
      {
        src: '/assets/projets/bang/Présentation_bang_logo.png',
        caption: 'Planche de présentation officielle du logotype et de l’identité'
      },
      {
        src: '/assets/projets/bang/SUBWAY LED BILLBOARD bang.png',
        caption: 'Affichage numérique dynamique grand format en station'
      },
      {
        src: '/assets/projets/bang/sky billboard bang.png',
        caption: 'Panneau d’affichage urbain Sky Billboard'
      },
      {
        src: '/assets/projets/bang/Polo Shirt on Mannequin bang koko donda sans col.png',
        caption: 'Application textile & merchandising sur polo Koko Donda'
      },
      {
        src: '/assets/projets/bang/App Icon bang.png',
        caption: 'Icône officielle de l’application mobile'
      },
      {
        src: '/assets/projets/bang/Horizontal_bang.png',
        caption: 'Déclinaison horizontale du logotype'
      },
      {
        src: '/assets/projets/bang/symbol_bang.png',
        caption: 'Symbole graphique isolé de la marque Bang'
      },
      {
        src: '/assets/projets/bang/Lanyard_ID_badge_bang_1.png',
        caption: 'Badges d’identification et cordons tour de cou'
      },
      {
        src: '/assets/projets/bang/Orangebang_logo.png',
        caption: 'Variante chromatique Orange Signature'
      },
      {
        src: '/assets/projets/bang/Vertbang_logo.png',
        caption: 'Variante chromatique Vert Dynamique'
      },
      {
        src: '/assets/projets/bang/bang Motifs_bang.png',
        caption: 'Motifs et patterns identitaires de la marque'
      },
      {
        src: '/assets/projets/bang/explain_bang.png',
        caption: 'Schéma d’explication du concept de la marque'
      },
      {
        src: '/assets/projets/bang/Plan de travail 1 copie 3_bang.png',
        caption: 'Planche de déclinaison graphique complémentaire'
      }
    ]
  }
];
