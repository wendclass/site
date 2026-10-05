export type ProjectType =
  | 'logo'
  | 'social'
  | 'print'
  | 'event'
  | 'website'
  | 'unknown';

export interface FormOption {
  id: string;
  label: string;
  isCustom?: boolean;
}

export interface FormDataState {
  projectType: ProjectType | null;
  goals: string[];
  goalOtherText?: string;
  
  // Branche A
  hasLogo?: 'zero' | 'redo' | 'keep';
  
  // Branche B
  socialFrequency?: 'occasional' | 'weekly' | 'multiple_weekly' | 'unknown';
  
  // Branche C
  printItems?: string[];
  printOtherText?: string;
  
  // Branche D
  eventTiming?: 'less_than_month' | 'one_to_three_months' | 'more_than_three_months' | 'no_date';
  eventPrintItems?: string[];
  eventDigitalItems?: string[];
  eventOtherText?: string;
  eventUnknown?: boolean;
  
  // Branche E
  websiteType?: 'one_page' | 'multi_page' | 'unknown' | 'other';
  websiteOtherText?: string;
  
  // Branche F
  freeTextSituation?: string;
  
  // Coordonnées
  fullName: string;
  companyName: string;
  whatsappNumber: string;
}

export const initialFormData: FormDataState = {
  projectType: null,
  goals: [],
  goalOtherText: '',
  hasLogo: undefined,
  socialFrequency: undefined,
  printItems: [],
  printOtherText: '',
  eventTiming: undefined,
  eventPrintItems: [],
  eventDigitalItems: [],
  eventOtherText: '',
  eventUnknown: false,
  websiteType: undefined,
  websiteOtherText: '',
  freeTextSituation: '',
  fullName: '',
  companyName: '',
  whatsappNumber: ''
};

export const PROJECT_TYPE_OPTIONS: { id: ProjectType; label: string; desc: string }[] = [
  {
    id: 'logo',
    label: 'Logo et image pour l’entreprise',
    desc: 'Création ou refonte complète de votre identité visuelle'
  },
  {
    id: 'social',
    label: 'Visuels pour les réseaux sociaux',
    desc: 'Abonnement et packs de publications à fort impact'
  },
  {
    id: 'print',
    label: 'Supports imprimés',
    desc: 'Kakémonos, bâches, affiches, cartes de visite'
  },
  {
    id: 'event',
    label: 'Événement à faire connaître',
    desc: 'Dispositif visuel complet et campagne de communication'
  },
  {
    id: 'website',
    label: 'Site web',
    desc: 'Site vitrine rapide et optimisé pour la conversion'
  },
  {
    id: 'unknown',
    label: 'Je ne sais pas encore',
    desc: 'Vous avez une idée ou un besoin et souhaitez être conseillé'
  }
];

export const GOAL_OPTIONS: FormOption[] = [
  { id: 'more_clients', label: 'Attirer plus de clients' },
  { id: 'new_offer', label: 'Faire connaître un nouveau produit ou service' },
  { id: 'stand_out', label: 'Me démarquer de mes concurrents' },
  { id: 'credibility', label: 'Être pris au sérieux par mes clients' },
  { id: 'other', label: 'Autre', isCustom: true }
];

export const BRANCH_A_OPTIONS = [
  { id: 'zero', label: 'Non, je pars de zéro' },
  { id: 'redo', label: 'Oui, mais je veux le refaire' },
  { id: 'keep', label: 'Oui, je veux le garder et le compléter' }
];

export const BRANCH_B_OPTIONS = [
  { id: 'occasional', label: 'Une fois de temps en temps pour un besoin précis' },
  { id: 'weekly', label: 'Chaque semaine' },
  { id: 'multiple_weekly', label: 'Plusieurs fois par semaine' },
  { id: 'unknown', label: 'Je ne sais pas encore' }
];

export const BRANCH_C_OPTIONS = [
  { id: 'kakemono', label: 'Kakémonos (grandes affiches sur pied)' },
  { id: 'bache', label: 'Bâches ou banderoles' },
  { id: 'affiche', label: 'Affiches ou flyers' },
  { id: 'carte', label: 'Cartes de visite' }
];

export const EVENT_TIMING_OPTIONS = [
  { id: 'less_than_month', label: 'Dans moins d’un mois' },
  { id: 'one_to_three_months', label: 'Dans un à trois mois' },
  { id: 'more_than_three_months', label: 'Dans plus de trois mois' },
  { id: 'no_date', label: 'Je n’ai pas encore de date' }
];

export const EVENT_PRINT_ITEMS = [
  'Dossier de présentation (peut aussi être imprimé pour être remis en main propre)',
  'Cartes d’invitation',
  'Badges',
  'Tickets ou billets',
  'Certificats de participation',
  'Panneaux ou roll-up',
  'Décor du lieu'
];

export const EVENT_DIGITAL_ITEMS = [
  'Dossier de présentation (version numérique)',
  'Fond de scène numérique',
  'Visuels de communication (réseaux sociaux, affiches digitales)'
];

export const BRANCH_E_OPTIONS = [
  { id: 'one_page', label: 'Une seule page qui présente mon activité' },
  { id: 'multi_page', label: 'Un site de plusieurs pages (présentation, services, contact…)' },
  { id: 'unknown', label: 'Je ne sais pas encore' },
  { id: 'other', label: 'Autre' }
];
