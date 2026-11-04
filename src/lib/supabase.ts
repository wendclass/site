import { createClient } from '@supabase/supabase-js';
import { projectsData as initialProjectsData, Project } from '../data/projets';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const ADMIN_ALLOWED_EMAIL = import.meta.env.VITE_ADMIN_ALLOWED_EMAIL || 'wendclasss@gmail.com';

// Check if valid Supabase connection exists
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('placeholder') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 20 &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// // TODO: connecter le projet Supabase de Scott (remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// TYPES
// ==============================================================================
export interface Demande {
  id: string;
  created_at: string;
  project_type: string;
  goals: string[];
  goals_other?: string;
  branch_data: Record<string, any>;
  full_name: string;
  company_name: string;
  whatsapp_number: string;
  status: 'nouveau' | 'en_cours' | 'traite' | 'archive';
  internal_notes?: string;
}

export interface DbProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  client_goal: string;
  designed_solution: string;
  result: string;
  disclaimer?: string;
  status: 'publie' | 'brouillon';
  display_order: number;
  created_at: string;
  hero_image?: string;
  accroche?: string;
  gallery?: {
    id?: string;
    src: string;
    caption: string;
    is_hero?: boolean;
    display_order?: number;
  }[];
}

export interface DbTestimonial {
  id: string;
  author_name: string;
  author_role_company: string;
  content: string;
  rating: number;
  projet_id?: string;
  category?: string;
  impact_result?: string;
  status: 'publie' | 'brouillon';
  display_order: number;
  created_at: string;
}

export interface DbArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  cover_image_alt?: string;
  cover_image_og_jpeg?: string;
  cover_image_srcset?: Record<string, string>;
  reading_time?: number;
  word_count?: number;
  content_json?: any;
  rubrique?: string;
  tags: string[];
  status: 'publie' | 'brouillon';
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DbProjectRedirect {
  id: string;
  old_slug: string;
  new_slug: string;
  projet_id?: string;
  created_at: string;
}

export interface DbArticleRedirect {
  id: string;
  old_slug: string;
  new_slug: string;
  article_id?: string;
  created_at: string;
}

// ==============================================================================
// LOCAL STORAGE MOCK STORE FOR FALLBACK & DEMO
// ==============================================================================
const STORAGE_KEYS = {
  DEMANDES: 'class_s_demandes_v1',
  PROJETS: 'class_s_projets_v1',
  TEMOIGNAGES: 'class_s_temoignages_v1',
  ARTICLES: 'class_s_articles_v1',
  ARTICLE_REDIRECTS: 'class_s_article_redirects_v1',
  ADMIN_CONFIG: 'class_s_admin_config_v1',
  ADMIN_SESSION: 'class_s_admin_session_v1',
};

// Initialize default mock data if not existing
const getInitialProjects = (): DbProject[] => {
  return initialProjectsData.map((p, idx) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    tagline: p.tagline,
    accroche: p.accroche || p.tagline,
    client_goal: p.clientGoal,
    designed_solution: p.designedSolution,
    result: p.result,
    disclaimer: p.disclaimer,
    status: 'publie',
    display_order: idx + 1,
    created_at: new Date(Date.now() - idx * 86400000).toISOString(),
    hero_image: p.heroImage,
    gallery: p.gallery.map((g, gIdx) => ({
      src: g.src,
      caption: g.caption,
      is_hero: g.src === p.heroImage,
      display_order: gIdx + 1,
    })),
  }));
};

const getInitialTestimonials = (): DbTestimonial[] => {
  return initialProjectsData
    .filter((p) => p.testimonialPlaceholder)
    .map((p, idx) => ({
      id: `testim-${p.id}`,
      author_name: p.title.includes('72') ? 'Comité 72h CJ' : p.title.includes('Bang') ? 'Fondateur' : 'Client',
      author_role_company: p.title,
      content: p.testimonialPlaceholder || '',
      rating: 5,
      projet_id: p.id,
      category: p.category,
      impact_result: p.result,
      status: 'publie',
      display_order: idx + 1,
      created_at: new Date(Date.now() - idx * 172800000).toISOString(),
    }));
};

const getInitialArticles = (): DbArticle[] => {
  return [
    {
      id: 'art-identite-visuelle-definition-entrepreneur',
      slug: 'identite-visuelle-definition-entrepreneur',
      title: 'Identité visuelle : à quoi sert-elle à un entrepreneur ?',
      meta_title: 'Identité visuelle : à quoi sert-elle à un entrepreneur ?',
      meta_description: 'Identité visuelle : définition, éléments, différence avec la charte graphique et raisons pour lesquelles un entrepreneur en a besoin.',
      excerpt: 'Votre identité visuelle est la première chose que vos clients voient de votre entreprise. Elle ne se résume pas au logo : couleurs, typographies et images en font aussi partie. Entrepreneur au Burkina Faso, découvrez comment elle construit votre image de marque.',
      content: `<p>Imaginez deux boutiques de vêtements sur Facebook. Elles vendent les mêmes articles au même prix. L’une a des couleurs, une police et un logo cohérents, l’autre change d’allure à chaque publication.</p>
<p>Laquelle semble la plus sérieuse ? Laquelle reconnaissez-vous en un coup d’œil ? La réponse vient presque toujours sans effort.</p>
<p>Cette différence porte un nom : l’identité visuelle. Dans cet article, vous découvrez ce qu’elle contient et pourquoi elle compte pour votre entreprise. Vous repartez avec des signes concrets pour savoir si la vôtre est à revoir.</p>
<h2>L’identité visuelle, c’est bien plus qu’un logo</h2>
<p>L’identité visuelle désigne l’ensemble des éléments visuels qui représentent une marque. On y trouve le logo, les couleurs, les typographies, les images et les icônes. Ensemble, ils distinguent l’entreprise de ses concurrents.</p>
<p>Le logo n’en est que la partie la plus visible. Beaucoup d’entrepreneurs s’arrêtent à lui et oublient le reste. Un logo seul ne construit pas une marque reconnaissable.</p>
<p>Pensez à la manière dont vous reconnaissez un ami dans une foule. Vous ne vous fiez pas seulement à son visage, mais aussi à sa silhouette, sa démarche et son parfum. Une marque se reconnaît de la même façon.</p>
<h2>Les éléments qui composent une identité visuelle</h2>
<p>Le logo reste le point d’entrée. Il doit rester lisible en grand comme en petit. Il doit aussi fonctionner en couleur comme en noir et blanc.</p>
<p>La palette de couleurs donne le ton. Deux ou trois couleurs principales suffisent souvent. Une identité visuelle repose en général sur deux ou trois polices au maximum.</p>
<p>Viennent ensuite les images, les icônes, les motifs et la mise en page. Ces éléments donnent un style propre à vos affiches, vos publications et votre site. Ils forment la signature visuelle de votre entreprise.</p>
<h2>Identité visuelle, charte graphique, branding : quelle différence ?</h2>
<p>Ces trois termes se confondent souvent. Pourtant, chacun désigne une chose précise. Les distinguer vous évite des malentendus avec un graphiste.</p>
<p>L’identité visuelle est la personnalité graphique d’une marque, et la charte graphique en est le <a href="https://www.canva.com/fr_fr/decouvrir/identite-visuelle-et-charte-graphique/" target="_blank" rel="noopener noreferrer">mode d’emploi</a>. Cette charte fixe les règles d’usage du logo, des couleurs et des polices. Elle garantit que les graphistes, les imprimeurs et les responsables des réseaux sociaux appliquent l’identité de la même façon.</p>
<p>Le branding est plus large. C’est le processus qui définit le message et l’identité de marque que vous souhaitez transmettre au public. L’identité visuelle en est l’expression graphique.</p>
<h2>Pourquoi un entrepreneur en a besoin</h2>
<p>Une identité visuelle cohérente rend votre entreprise reconnaissable. Vos clients vous repèrent plus vite dans un fil d’actualité chargé. Ils vous associent à une qualité précise.</p>
<p>La cohérence inspire aussi confiance. Une étude de Lucidpress, aujourd’hui Marq, avance qu’une présentation cohérente de la marque peut accroître les revenus jusqu’à 33 %. Ce chiffre vient d’un éditeur de logiciels de marque : lisez-le comme une tendance, pas comme une promesse.</p>
<p>Elle vous fait enfin gagner du temps. Avec des règles claires, chaque affiche ou publication se crée plus vite. Vous évitez de repartir de zéro à chaque fois.</p>
<h2>Vos clients vous voient d’abord sur les réseaux sociaux</h2>
<p>Facebook domine largement parmi les réseaux sociaux mesurés au Burkina Faso. Selon <a href="https://napoleoncat.com/stats/facebook-users-in-burkina-faso/" target="_blank" rel="noopener noreferrer">NapoleonCat</a>, le pays comptait environ 4,8 millions d’utilisateurs en septembre 2026. Cela représente un peu plus de 19 % de la population.</p>
<p>À titre de comparaison, LinkedIn comptait environ 600 000 membres et Instagram environ 231 000 à la même date. Chaque plateforme n’a pas le même public. Votre identité visuelle doit pourtant rester la même partout.</p>
<p>Votre première impression se joue donc souvent sur un écran de téléphone, en quelques instants. Votre photo de profil, votre couverture et vos visuels parlent avant vous. Un ensemble soigné donne une image sérieuse dès le premier regard.</p>
<h2>Les signes qu’il est temps de revoir votre identité</h2>
<p>Votre logo est flou ou illisible en petit format. Vos couleurs changent d’une publication à l’autre. Chaque support semble venir d’une entreprise différente.</p>
<p>Vos clients vous confondent avec un concurrent. Vous hésitez à montrer votre marque à de gros clients. Votre site, vos affiches et vos réseaux n’ont aucun point commun.</p>
<p>Un seul de ces signes mérite déjà votre attention. Plusieurs d’entre eux annoncent le moment de structurer votre identité. Mieux vaut le faire avant d’imprimer ou de publier en masse.</p>
<h2>Par où commencer ?</h2>
<p>Commencez par clarifier ce que votre entreprise représente et pour qui. Choisissez ensuite vos couleurs, vos typographies et votre logo. Rassemblez enfin ces règles dans une charte graphique.</p>
<p>Vous pouvez le faire seul, mais un graphiste vous évite les erreurs de départ. Il traduit vos valeurs en éléments visuels cohérents. Il vous remet aussi un document pour garder le cap.</p>
<p>Chez Class S, je crée des <a href="/offres">identités visuelles</a> pour entrepreneurs et startups. Si vous préparez la vôtre, parlons de votre projet. Le <a href="/contact">formulaire de contact</a> est à votre disposition.</p>`,
      status: 'publie',
      published_at: '2026-11-03T09:00:00Z',
      rubrique: 'identite-visuelle',
      tags: ['Identité visuelle', 'Charte graphique', 'Logo', 'Branding', 'Burkina Faso'],
      reading_time: 4,
      created_at: '2026-10-31T01:46:00.000Z',
      updated_at: '2026-10-31T01:46:00.000Z',
    },
    {
      id: 'art-1-logo-vs-identite',
      slug: 'pourquoi-un-logo-seul-ne-sauvera-pas-votre-entreprise',
      title: 'Pourquoi un logo seul ne sauvera jamais votre entreprise (et ce qu\'il vous faut vraiment)',
      excerpt: 'Beaucoup d\'entrepreneurs pensent qu\'un joli logo suffit à attirer des clients haut de gamme. En réalité, un logo sans système d\'identité visuelle est une coquille vide. Décryptage d\'une erreur coûteuse.',
      content: `
        <p>Combien de fois avez-vous vu un créateur d’entreprise commander un logo express sur une plateforme low-cost, pour ensuite s’étonner que ses prospects négocient férocement le moindre devis ?</p>
        <h2>Le grand malentendu du logo isolé</h2>
        <p>Un logo n’est pas une identité visuelle. Un logo n’est que la <strong>signature</strong> apposée au bas d’un contrat. Si le contrat n’a pas de substance, la signature ne vaut rien.</p>
        <blockquote>« Un logo sans écosystème visuel, c'est comme porter une montre de luxe avec un costume déchiré : le décalage saute immédiatement aux yeux et détruit la confiance. »</blockquote>
        <p>Lorsque vos prospects entrent en contact avec votre marque, ils ne jugent pas uniquement votre pictogramme ou vos initiales stylisées. Ils perçoivent l’atmosphère globale : la typographie de vos titres, l'équilibre des espaces blancs, la hiérarchie de vos documents et l'harmonie chromatique de vos supports.</p>
        <h2>Ce qui construit une véritable valeur perçue</h2>
        <p>Pour qu’une marque s’impose avec autorité et justifie des tarifs élevés sur son marché, elle a besoin d'un ensemble cohérent :</p>
        <ul>
          <li><strong>Une typographie maîtresse</strong> qui impose instantanément le ton (luxe, rigueur institutionnelle, audace contemporaine).</li>
          <li><strong>Une palette chromatique stratégique</strong> pensée pour déclencher une émotion ciblée dès les 3 premières secondes.</li>
          <li><strong>Une grille de composition rigoureuse</strong> qui rend vos publications immédiatement identifiables sans même chercher votre nom.</li>
          <li><strong>Un territoire photographique et iconographique</strong> qui reflète le niveau d'exigence de vos prestations.</li>
        </ul>
        <h2>Le passage à l'action</h2>
        <p>Si vous souhaitez attirer des clients exigeants et prêts à investir dans votre savoir-faire, ne cherchez pas un simple dessin. Bâtissez un univers visuel solide qui inspire le respect et supprime toute hésitation lors de la prise de décision.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      tags: ['Identité Visuelle', 'Stratégie de Marque', 'Branding'],
      rubrique: 'strategie-de-marque',
      status: 'publie',
      meta_description: 'Découvrez pourquoi un logo seul ne suffit pas à asseoir votre crédibilité et comment un véritable système d\'identité visuelle transforme la perception de votre entreprise.',
      published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'art-2-erreurs-reseaux-sociaux',
      slug: '5-erreurs-graphiques-reseaux-sociaux-credibilite',
      title: 'Les 5 erreurs graphiques sur les réseaux sociaux qui détruisent votre crédibilité',
      excerpt: 'Des visuels saturés, des polices illisibles, une incohérence de couleurs d\'un post à l\'autre... Voici les faux pas visuels qui font fuir vos prospects qualifiés et comment les corriger sans tarder.',
      content: `
        <p>Sur LinkedIn, Instagram ou Facebook, vous n'avez que <strong>1,7 seconde</strong> pour capter l'attention d'un décideur avant qu'il ne fasse défiler son écran. Pourtant, la grande majorité des publications d'entreprises commettent les mêmes erreurs critiques.</p>
        <h2>1. Le syndrome du sapin de Noël typographique</h2>
        <p>Utiliser trois ou quatre polices différentes sur une seule affiche ou vignette est la manière la plus rapide de paraître amateur. Limitez-vous à <strong>deux typographies maximum</strong> : une avec du caractère pour le titre, et une police ultra-lisible pour les détails informatifs.</p>
        <h2>2. Le contraste sacrifié au nom de la créativité</h2>
        <p>Un texte gris clair sur fond blanc ou jaune sur violet clair est quasiment invisible sur un smartphone en plein soleil. Si votre client potentiel doit plisser les yeux pour déchiffrer votre message, vous l'avez déjà perdu.</p>
        <h2>3. L'absence d'alignement et de respiration</h2>
        <p>Remplir chaque millimètre carré d'un visuel par peur du vide est une tentation courante. Or, le <strong>vide spatial (espace négatif)</strong> est précisément ce qui donne un sentiment de luxe, de sérieux et de maîtrise. Laissez vos contenus respirer.</p>
        <h2>4. Des formats inadaptés aux écrans mobiles</h2>
        <p>Publier un visuel horizontal (16:9) sur un fil pensé pour le format vertical (4:5 ou 9:16) vous fait perdre plus de 60% de l'espace d'écran disponible pour capter le regard.</p>
        <h2>5. L'incohérence d'une publication à l'autre</h2>
        <p>Si votre marque change de couleurs, de styles et de mises en page chaque semaine, vos abonnés ne vous mémorisent jamais. C’est la répétition d'une grammaire visuelle rigoureuse qui crée la notoriété.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      tags: ['Réseaux Sociaux', 'Design Graphique', 'Visibilité'],
      rubrique: 'reseaux-sociaux',
      status: 'publie',
      meta_description: 'Typographies illisibles, manque de cohérence chromatique, surcharge d\'informations : évitez ces 5 erreurs graphiques qui font fuir vos prospects sur les réseaux sociaux.',
      published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'art-3-conversion-commerciale',
      slug: 'transformer-identite-visuelle-en-levier-de-conversion',
      title: 'Comment transformer une identité visuelle en levier de conversion commerciale',
      excerpt: 'Le design n\'est pas une simple décoration esthétique : c\'est un outil de vente puissant. Découvrez comment structurer votre univers de marque pour inspirer confiance et justifier des tarifs premium.',
      content: `
        <p>Dans l’esprit de nombreux dirigeants, le branding reste perçu comme une dépense accessoire ou purement esthétique. C’est une erreur fondamentale d’analyse commerciale : le design est le premier multiplicateur de conversion d'une entreprise.</p>
        <h2>Le biais de beauté et l'effet de halo</h2>
        <p>Les sciences cognitives ont démontré depuis longtemps l'existence du biais de confirmation et de l'<em>effet de halo</em> : nous attribuons spontanément une plus grande compétence technique et un professionnalisme supérieur aux entreprises dont la présentation visuelle est impeccable.</p>
        <blockquote>« À compétences égales, le prospect choisit toujours l'entreprise qui lui inspire le plus de confiance au premier coup d'œil. »</blockquote>
        <h2>Réduire la friction lors de la négociation du prix</h2>
        <p>Pourquoi les grandes marques d'exception peuvent-elles pratiquer des marges confortables sans contestation ? Parce que chaque point de contact visuel rassure le client sur la qualité de son investissement. Une entreprise de services ou un cabinet qui adopte cette posture visuelle élimine instantanément l'objection du prix.</p>
        <h2>Un investissement pérenne pour les années à venir</h2>
        <p>Une identité visuelle stratégique et intemporelle ne se démode pas au bout d'une saison. Elle pose les fondations durables de votre entreprise pour les années à venir, en augmentant la valeur vie de chaque client conquis.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
      tags: ['Business', 'Conversion', 'Branding Premium'],
      rubrique: 'business-conversion',
      status: 'publie',
      meta_description: 'Le design graphique n\'est pas une simple dépense esthétique : c\'est un investissement stratégique qui réduit les frictions de vente et justifie des tarifs élevés.',
      published_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      created_at: new Date(Date.now() - 16 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
  ];
};

// Helper for local mock storage
const getLocalStore = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Local store error for ${key}:`, err);
    return defaultValue;
  }
};

const setLocalStore = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Local store write error for ${key}:`, err);
  }
};

// ==============================================================================
// API SERVICE LAYER (SUPABASE WITH AUTOMATIC FALLBACK)
// ==============================================================================

export interface SubmitDemandePayload extends Omit<Demande, 'id' | 'created_at' | 'status' | 'internal_notes'> {
  turnstile_token?: string;
  company_website_hp?: string;
}

export const submitDemande = async (
  data: SubmitDemandePayload
): Promise<{ success: boolean; error?: string; id?: string }> => {
  try {
    // Send to secure serverless endpoint /api/contact
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const resData = await response.json();
      return { success: true, id: resData.id };
    }

    // Capture specific serverless rejection errors (400, 429)
    const errorJson = await response.json().catch(() => null);
    if (errorJson && errorJson.error) {
      return { success: false, error: errorJson.error };
    }

    throw new Error(`Erreur serveur (${response.status})`);
  } catch (err: any) {
    console.warn('API /api/contact call failed, checking fallback:', err);

    // Fallback in local mock development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const newDemande: Demande = {
        ...data,
        id: `demande-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        created_at: new Date().toISOString(),
        status: 'nouveau',
        internal_notes: '',
      };
      const currentList = getLocalStore<Demande[]>(STORAGE_KEYS.DEMANDES, []);
      setLocalStore(STORAGE_KEYS.DEMANDES, [newDemande, ...currentList]);
      return { success: true, id: newDemande.id };
    }

    return {
      success: false,
      error: err?.message || 'Une erreur est survenue lors de l’envoi de votre demande.',
    };
  }
};

export const fetchDemandes = async (): Promise<Demande[]> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('demandes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } else {
      return getLocalStore<Demande[]>(STORAGE_KEYS.DEMANDES, []);
    }
  } catch (err) {
    console.warn('fetchDemandes fallback to local:', err);
    return getLocalStore<Demande[]>(STORAGE_KEYS.DEMANDES, []);
  }
};

export const updateDemandeStatus = async (id: string, status: Demande['status']): Promise<boolean> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('demandes')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return true;
    } else {
      const currentList = getLocalStore<Demande[]>(STORAGE_KEYS.DEMANDES, []);
      const updated = currentList.map((d) => (d.id === id ? { ...d, status } : d));
      setLocalStore(STORAGE_KEYS.DEMANDES, updated);
      return true;
    }
  } catch (err) {
    console.error('updateDemandeStatus error:', err);
    return false;
  }
};

export const updateDemandeNotes = async (id: string, internal_notes: string): Promise<boolean> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('demandes')
        .update({ internal_notes })
        .eq('id', id);

      if (error) throw error;
      return true;
    } else {
      const currentList = getLocalStore<Demande[]>(STORAGE_KEYS.DEMANDES, []);
      const updated = currentList.map((d) => (d.id === id ? { ...d, internal_notes } : d));
      setLocalStore(STORAGE_KEYS.DEMANDES, updated);
      return true;
    }
  } catch (err) {
    console.error('updateDemandeNotes error:', err);
    return false;
  }
};

export const deleteDemande = async (id: string): Promise<boolean> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('demandes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } else {
      const currentList = getLocalStore<Demande[]>(STORAGE_KEYS.DEMANDES, []);
      const filtered = currentList.filter((d) => d.id !== id);
      setLocalStore(STORAGE_KEYS.DEMANDES, filtered);
      return true;
    }
  } catch (err) {
    console.error('deleteDemande error:', err);
    return false;
  }
};

// --- ANALYTICS (STATISTIQUES DE VISITE) ---
export type VisitEventType = 'page_vue' | 'etape_formulaire' | 'formulaire_soumis' | 'formulaire_abandonne';

export interface VisitEvent {
  id?: string;
  session_id: string;
  event_type: VisitEventType;
  page_or_step: string;
  duration_seconds?: number;
  created_at?: string;
}

const ANALYTICS_STORAGE_KEY = 'class_s_analytics_events';
const SESSION_STORAGE_KEY = 'class_s_anonymous_session_id';

export const getAnonymousSessionId = (): string => {
  try {
    let sid = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    return sid;
  } catch {
    return `sess_${Date.now()}`;
  }
};

export const trackVisitEvent = async (event: {
  event_type: VisitEventType;
  page_or_step: string;
  duration_seconds?: number;
}): Promise<void> => {
  try {
    const session_id = getAnonymousSessionId();
    const eventPayload = {
      session_id,
      event_type: event.event_type,
      page_or_step: event.page_or_step,
      duration_seconds: Math.max(0, Math.round(event.duration_seconds || 0)),
    };

    if (isSupabaseConfigured() && supabase) {
      // Non-blocking insert into evenements_visite table
      void supabase
        .from('evenements_visite')
        .insert([eventPayload])
        .then(({ error }) => {
          if (error) {
            console.warn('[Analytics] Track error (table might be initializing):', error.message);
          }
        });
    } else {
      // Fallback local storage
      const existing = getLocalStore<VisitEvent[]>(ANALYTICS_STORAGE_KEY, []);
      const newEvt: VisitEvent = {
        ...eventPayload,
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        created_at: new Date().toISOString(),
      };
      setLocalStore(ANALYTICS_STORAGE_KEY, [newEvt, ...existing].slice(0, 1000));
    }
  } catch (err) {
    // Best-effort non-blocking: never throws
    console.warn('[Analytics] Suppressed tracking error:', err);
  }
};

export const fetchVisitEvents = async (): Promise<VisitEvent[]> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('evenements_visite')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2000);

      if (error) {
        console.warn('fetchVisitEvents Supabase error, falling back to local:', error);
        return getLocalStore<VisitEvent[]>(ANALYTICS_STORAGE_KEY, getInitialMockAnalytics());
      }
      return data || [];
    } else {
      return getLocalStore<VisitEvent[]>(ANALYTICS_STORAGE_KEY, getInitialMockAnalytics());
    }
  } catch (err) {
    console.warn('fetchVisitEvents error:', err);
    return getLocalStore<VisitEvent[]>(ANALYTICS_STORAGE_KEY, getInitialMockAnalytics());
  }
};

// Realistic mock analytics data when database is fresh or offline
const getInitialMockAnalytics = (): VisitEvent[] => {
  const events: VisitEvent[] = [];
  const now = Date.now();
  const pages = ['/', '/offres', '/projets', '/a-propos'];

  for (let i = 0; i < 45; i++) {
    const sId = `sess_mock_${i}`;
    const timestamp = new Date(now - Math.random() * 7 * 86400000).toISOString();
    
    // Page views
    const randomPage = pages[Math.floor(Math.random() * pages.length)];
    events.push({
      id: `mock-pv-${i}`,
      session_id: sId,
      event_type: 'page_vue',
      page_or_step: randomPage,
      duration_seconds: Math.floor(Math.random() * 75) + 15,
      created_at: timestamp,
    });

    // Form Funnel simulation
    if (Math.random() > 0.3) {
      events.push({
        id: `mock-step1-${i}`,
        session_id: sId,
        event_type: 'etape_formulaire',
        page_or_step: '1',
        duration_seconds: Math.floor(Math.random() * 20) + 5,
        created_at: timestamp,
      });

      if (Math.random() > 0.25) {
        events.push({
          id: `mock-step2-${i}`,
          session_id: sId,
          event_type: 'etape_formulaire',
          page_or_step: '2',
          duration_seconds: Math.floor(Math.random() * 25) + 8,
          created_at: timestamp,
        });

        if (Math.random() > 0.2) {
          events.push({
            id: `mock-step3-${i}`,
            session_id: sId,
            event_type: 'etape_formulaire',
            page_or_step: '3',
            duration_seconds: Math.floor(Math.random() * 30) + 10,
            created_at: timestamp,
          });

          if (Math.random() > 0.15) {
            events.push({
              id: `mock-step4-${i}`,
              session_id: sId,
              event_type: 'etape_formulaire',
              page_or_step: '4',
              duration_seconds: Math.floor(Math.random() * 35) + 12,
              created_at: timestamp,
            });

            if (Math.random() > 0.1) {
              events.push({
                id: `mock-sub-${i}`,
                session_id: sId,
                event_type: 'formulaire_soumis',
                page_or_step: 'soumis',
                duration_seconds: 0,
                created_at: timestamp,
              });
            } else {
              events.push({
                id: `mock-ab-${i}`,
                session_id: sId,
                event_type: 'formulaire_abandonne',
                page_or_step: '4',
                duration_seconds: 15,
                created_at: timestamp,
              });
            }
          }
        }
      }
    }
  }
  return events;
};

// --- PROJETS (PUBLIC & ADMIN) ---
export const fetchPublicProjects = async (): Promise<Project[]> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data: dbProjects, error } = await supabase
        .from('projets')
        .select('*, projet_images(*)')
        .eq('status', 'publie')
        .order('display_order', { ascending: true });

      if (error) throw error;
      if (dbProjects && dbProjects.length > 0) {
        return dbProjects.map((p: any) => {
          const sortedImages = (p.projet_images || []).sort(
            (a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)
          );
          const hero = sortedImages.find((img: any) => img.is_hero) || sortedImages[0];

          return {
            id: p.id,
            slug: p.slug,
            title: p.title,
            category: p.category,
            tagline: p.tagline,
            accroche: p.accroche || p.tagline,
            clientGoal: p.client_goal,
            designedSolution: p.designed_solution,
            result: p.result,
            disclaimer: p.disclaimer,
            heroImage: hero ? hero.image_url : '/assets/logo/logo-violet.png',
            gallery: sortedImages.map((img: any) => ({
              src: img.image_url,
              caption: img.caption || p.title,
            })),
          };
        });
      }
    }
  } catch (err) {
    console.warn('fetchPublicProjects from Supabase failed, using local fallback:', err);
  }

  // Fallback to local stored projects (only published)
  const localList = getLocalStore<DbProject[]>(STORAGE_KEYS.PROJETS, getInitialProjects());
  return localList
    .filter((p) => p.status === 'publie')
    .sort((a, b) => a.display_order - b.display_order)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: p.category,
      tagline: p.tagline,
      accroche: p.accroche || p.tagline,
      clientGoal: p.client_goal,
      designedSolution: p.designed_solution,
      result: p.result,
      disclaimer: p.disclaimer,
      heroImage: p.hero_image || (p.gallery && p.gallery[0]?.src) || '/assets/logo/logo-violet.png',
      gallery: (p.gallery || []).map((g) => ({
        src: g.src,
        caption: g.caption,
      })),
    }));
};

export const fetchPublicProjectBySlug = async (
  slug: string
): Promise<{ project: Project | null; redirectSlug?: string }> => {
  if (slug === '72h-cj-2026') {
    return { project: null, redirectSlug: '72-heures-cj-2026' };
  }
  // Check redirects
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: redir } = await supabase
        .from('projet_redirects')
        .select('new_slug')
        .eq('old_slug', slug)
        .maybeSingle();
      if (redir?.new_slug && redir.new_slug !== slug) {
        return { project: null, redirectSlug: redir.new_slug };
      }
    } catch {}
  } else {
    const redirects = getLocalStore<Record<string, string>>('cs_projet_redirects', {});
    if (redirects[slug] && redirects[slug] !== slug) {
      return { project: null, redirectSlug: redirects[slug] };
    }
  }

  const all = await fetchPublicProjects();
  const found = all.find((p) => p.slug === slug || p.id === slug);
  return { project: found || null };
};

export const recordProjectRedirect = async (oldSlug: string, newSlug: string, projectId?: string): Promise<void> => {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return;
  try {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('projet_redirects').upsert([
        { old_slug: oldSlug, new_slug: newSlug, ...(projectId ? { projet_id: projectId } : {}), created_at: new Date().toISOString() },
      ]);
    } else {
      const redirects = getLocalStore<Record<string, string>>('cs_projet_redirects', {});
      redirects[oldSlug] = newSlug;
      setLocalStore('cs_projet_redirects', redirects);
    }
  } catch (err) {
    console.warn('recordProjectRedirect error:', err);
  }
};

export const fetchAdminProjects = async (): Promise<DbProject[]> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('projets')
        .select('*, projet_images(*)')
        .order('display_order', { ascending: true });

      if (error) throw error;
      if (data) {
        return data.map((p: any) => {
          const sortedImages = (p.projet_images || []).sort(
            (a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)
          );
          const hero = sortedImages.find((img: any) => img.is_hero) || sortedImages[0];
          return {
            id: p.id,
            slug: p.slug,
            title: p.title,
            category: p.category,
            tagline: p.tagline,
            client_goal: p.client_goal,
            designed_solution: p.designed_solution,
            result: p.result,
            disclaimer: p.disclaimer,
            status: p.status,
            display_order: p.display_order,
            created_at: p.created_at,
            hero_image: hero ? hero.image_url : undefined,
            gallery: sortedImages.map((img: any) => ({
              id: img.id,
              src: img.image_url,
              caption: img.caption,
              is_hero: img.is_hero,
              display_order: img.display_order,
            })),
          };
        });
      }
    }
  } catch (err) {
    console.warn('fetchAdminProjects fallback to local:', err);
  }
  return getLocalStore<DbProject[]>(STORAGE_KEYS.PROJETS, getInitialProjects());
};

export const saveProject = async (project: Partial<DbProject>): Promise<{ success: boolean; error?: string }> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const projectPayload = {
        slug: project.slug,
        title: project.title,
        category: project.category,
        tagline: project.tagline,
        accroche: project.accroche || project.tagline || null,
        client_goal: project.client_goal,
        designed_solution: project.designed_solution,
        result: project.result,
        disclaimer: project.disclaimer || null,
        status: project.status || 'publie',
        display_order: project.display_order || 1,
        updated_at: new Date().toISOString(),
      };

      let projectId = project.id;
      if (projectId && !projectId.startsWith('local-')) {
        const { error } = await supabase.from('projets').update(projectPayload).eq('id', projectId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('projets').insert([projectPayload]).select('id').single();
        if (error) throw error;
        projectId = data.id;
      }

      // Sync gallery images
      if (project.gallery && projectId) {
        await supabase.from('projet_images').delete().eq('projet_id', projectId);
        if (project.gallery.length > 0) {
          const imagesPayload = project.gallery.map((g, idx) => ({
            projet_id: projectId,
            image_url: g.src,
            caption: g.caption || '',
            is_hero: g.is_hero || idx === 0,
            display_order: g.display_order || idx + 1,
          }));
          const { error: imgErr } = await supabase.from('projet_images').insert(imagesPayload);
          if (imgErr) throw imgErr;
        }
      }

      return { success: true };
    } else {
      // Local mock save
      const current = getLocalStore<DbProject[]>(STORAGE_KEYS.PROJETS, getInitialProjects());
      const isNew = !project.id || !current.some((p) => p.id === project.id);
      let updated: DbProject[];
      if (isNew) {
        const newProj: DbProject = {
          id: project.id || `proj-${Date.now()}`,
          slug: project.slug || `projet-${Date.now()}`,
          title: project.title || 'Nouveau Projet',
          category: project.category || 'Branding & Identité',
          tagline: project.tagline || '',
          accroche: project.accroche || project.tagline || '',
          client_goal: project.client_goal || '',
          designed_solution: project.designed_solution || '',
          result: project.result || '',
          disclaimer: project.disclaimer,
          status: project.status || 'publie',
          display_order: project.display_order || current.length + 1,
          created_at: new Date().toISOString(),
          hero_image: project.hero_image,
          gallery: project.gallery || [],
        };
        updated = [...current, newProj];
      } else {
        updated = current.map((p) => (p.id === project.id ? ({ ...p, ...project } as DbProject) : p));
      }
      setLocalStore(STORAGE_KEYS.PROJETS, updated);
      return { success: true };
    }
  } catch (err: any) {
    console.error('saveProject error:', err);
    return { success: false, error: err?.message || 'Erreur lors de la sauvegarde du projet.' };
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('projets').delete().eq('id', id);
      if (error) throw error;
      return true;
    } else {
      const current = getLocalStore<DbProject[]>(STORAGE_KEYS.PROJETS, getInitialProjects());
      setLocalStore(
        STORAGE_KEYS.PROJETS,
        current.filter((p) => p.id !== id)
      );
      return true;
    }
  } catch (err) {
    console.error('deleteProject error:', err);
    return false;
  }
};

// --- TESTIMONIALS (PUBLIC & ADMIN) ---
export const fetchPublicTestimonials = async (): Promise<DbTestimonial[]> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('temoignages')
        .select('*')
        .eq('status', 'publie')
        .order('display_order', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('fetchPublicTestimonials from Supabase failed, using local fallback:', err);
  }
  const localList = getLocalStore<DbTestimonial[]>(STORAGE_KEYS.TEMOIGNAGES, getInitialTestimonials());
  return localList.filter((t) => t.status === 'publie').sort((a, b) => a.display_order - b.display_order);
};

export const fetchAdminTestimonials = async (): Promise<DbTestimonial[]> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('temoignages')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      if (data) return data;
    }
  } catch (err) {
    console.warn('fetchAdminTestimonials fallback to local:', err);
  }
  return getLocalStore<DbTestimonial[]>(STORAGE_KEYS.TEMOIGNAGES, getInitialTestimonials());
};

export const saveTestimonial = async (t: Partial<DbTestimonial>): Promise<{ success: boolean; error?: string }> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const payload = {
        author_name: t.author_name,
        author_role_company: t.author_role_company,
        content: t.content,
        rating: t.rating || 5,
        projet_id: t.projet_id || null,
        category: t.category || null,
        impact_result: t.impact_result || null,
        status: t.status || 'publie',
        display_order: t.display_order || 1,
      };

      if (t.id && !t.id.startsWith('testim-')) {
        const { error } = await supabase.from('temoignages').update(payload).eq('id', t.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('temoignages').insert([payload]);
        if (error) throw error;
      }
      return { success: true };
    } else {
      const current = getLocalStore<DbTestimonial[]>(STORAGE_KEYS.TEMOIGNAGES, getInitialTestimonials());
      const isNew = !t.id || !current.some((item) => item.id === t.id);
      let updated: DbTestimonial[];
      if (isNew) {
        const newTestim: DbTestimonial = {
          id: t.id || `testim-${Date.now()}`,
          author_name: t.author_name || 'Client Class S',
          author_role_company: t.author_role_company || '',
          content: t.content || '',
          rating: t.rating || 5,
          projet_id: t.projet_id,
          category: t.category,
          impact_result: t.impact_result,
          status: t.status || 'publie',
          display_order: t.display_order || current.length + 1,
          created_at: new Date().toISOString(),
        };
        updated = [...current, newTestim];
      } else {
        updated = current.map((item) => (item.id === t.id ? ({ ...item, ...t } as DbTestimonial) : item));
      }
      setLocalStore(STORAGE_KEYS.TEMOIGNAGES, updated);
      return { success: true };
    }
  } catch (err: any) {
    console.error('saveTestimonial error:', err);
    return { success: false, error: err?.message || 'Erreur lors de la sauvegarde du témoignage.' };
  }
};

export const deleteTestimonial = async (id: string): Promise<boolean> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('temoignages').delete().eq('id', id);
      if (error) throw error;
      return true;
    } else {
      const current = getLocalStore<DbTestimonial[]>(STORAGE_KEYS.TEMOIGNAGES, getInitialTestimonials());
      setLocalStore(
        STORAGE_KEYS.TEMOIGNAGES,
        current.filter((item) => item.id !== id)
      );
      return true;
    }
  } catch (err) {
    console.error('deleteTestimonial error:', err);
    return false;
  }
};

// ==============================================================================
// BLOG & ARTICLES (PUBLIC & ADMIN)
// ==============================================================================
export const fetchPublicArticles = async (): Promise<DbArticle[]> => {
  const now = Date.now();
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'publie')
        .order('published_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        return (data as DbArticle[]).filter(
          (a) => a.status === 'publie' && (!a.published_at || new Date(a.published_at).getTime() <= now)
        );
      }
    }
  } catch (err) {
    console.warn('fetchPublicArticles from Supabase failed, using local fallback:', err);
  }

  // Fallback to local stored articles
  const localList = getLocalStore<DbArticle[]>(STORAGE_KEYS.ARTICLES, getInitialArticles());
  return localList
    .filter((a) => a.status === 'publie' && (!a.published_at || new Date(a.published_at).getTime() <= now))
    .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
};

export const fetchPublicArticleBySlug = async (slug: string): Promise<DbArticle | null> => {
  const now = Date.now();
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'publie')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        const art = data as DbArticle;
        if (!art.published_at || new Date(art.published_at).getTime() <= now) {
          return art;
        }
        return null; // Future scheduled date -> 404
      }
    }
  } catch (err) {
    console.warn(`fetchPublicArticleBySlug(${slug}) from Supabase failed, trying local fallback:`, err);
  }

  // Fallback
  const localList = getLocalStore<DbArticle[]>(STORAGE_KEYS.ARTICLES, getInitialArticles());
  const found = localList.find((a) => a.slug === slug && a.status === 'publie' && (!a.published_at || new Date(a.published_at).getTime() <= now));
  return found || null;
};

export const fetchAdminArticles = async (): Promise<DbArticle[]> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) return data as DbArticle[];
    }
  } catch (err) {
    console.warn('fetchAdminArticles from Supabase failed, using local fallback:', err);
  }

  // Fallback
  const localList = getLocalStore<DbArticle[]>(STORAGE_KEYS.ARTICLES, getInitialArticles());
  return [...localList].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const saveArticle = async (
  article: Partial<DbArticle>
): Promise<{ success: boolean; article?: DbArticle; error?: string }> => {
  try {
    const isNew = !article.id;
    const now = new Date().toISOString();
    const publishedAt =
      article.status === 'publie'
        ? article.published_at || now
        : article.published_at || undefined;

    const payload: Partial<DbArticle> = {
      ...article,
      published_at: publishedAt,
      updated_at: now,
    };

    if (isSupabaseConfigured() && supabase) {
      if (isNew) {
        const { data, error } = await supabase
          .from('articles')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        return { success: true, article: data as DbArticle };
      } else {
        const { data, error } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', article.id!)
          .select()
          .single();

        if (error) throw error;
        return { success: true, article: data as DbArticle };
      }
    } else {
      // Local fallback
      const current = getLocalStore<DbArticle[]>(STORAGE_KEYS.ARTICLES, getInitialArticles());
      let saved: DbArticle;

      if (isNew) {
        saved = {
          id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          slug: article.slug || `article-${Date.now()}`,
          title: article.title || 'Sans titre',
          excerpt: article.excerpt || '',
          content: article.content || '',
          cover_image: article.cover_image,
          cover_image_alt: article.cover_image_alt,
          cover_image_og_jpeg: article.cover_image_og_jpeg,
          cover_image_srcset: article.cover_image_srcset,
          reading_time: article.reading_time || 1,
          word_count: article.word_count || 0,
          content_json: article.content_json,
          tags: article.tags || [],
          status: article.status || 'brouillon',
          meta_title: article.meta_title,
          meta_description: article.meta_description,
          rubrique: article.rubrique,
          published_at: publishedAt,
          created_at: now,
          updated_at: now,
        };
        setLocalStore(STORAGE_KEYS.ARTICLES, [saved, ...current]);
      } else {
        saved = {
          ...current.find((a) => a.id === article.id)!,
          ...payload,
        } as DbArticle;
        const updated = current.map((item) => (item.id === article.id ? saved : item));
        setLocalStore(STORAGE_KEYS.ARTICLES, updated);
      }

      return { success: true, article: saved };
    }
  } catch (err: any) {
    console.error('saveArticle error:', err);
    return { success: false, error: err?.message || 'Erreur lors de la sauvegarde de l\'article.' };
  }
};

// Helper to extract storage path from a public Supabase URL
export const extractStoragePath = (url: string, bucket: string): string | null => {
  if (!url) return null;
  const prefix = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(prefix);
  if (idx !== -1) {
    return decodeURIComponent(url.slice(idx + prefix.length).split('?')[0]);
  }
  return null;
};

// Helper to delete associated images from Supabase storage when an article is deleted
export const deleteArticleImagesFromStorage = async (article: DbArticle): Promise<void> => {
  if (!isSupabaseConfigured() || !supabase) return;

  const webpPathsToDelete: string[] = [];
  const ogJpegPathsToDelete: string[] = [];

  // 1. Cover images
  if (article.cover_image) {
    const path = extractStoragePath(article.cover_image, 'article-images');
    if (path) webpPathsToDelete.push(path);
  }
  if (article.cover_image_og_jpeg) {
    const path = extractStoragePath(article.cover_image_og_jpeg, 'article-og-images');
    if (path) ogJpegPathsToDelete.push(path);
  }

  // Cover image srcset variants if stored
  if (article.cover_image_srcset) {
    Object.values(article.cover_image_srcset).forEach((src) => {
      const path = extractStoragePath(src, 'article-images');
      if (path && !webpPathsToDelete.includes(path)) webpPathsToDelete.push(path);
    });
  }

  // 2. Images inside HTML body
  if (article.content) {
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match: RegExpExecArray | null;
    while ((match = imgRegex.exec(article.content)) !== null) {
      const src = match[1];
      const path = extractStoragePath(src, 'article-images');
      if (path && !webpPathsToDelete.includes(path)) webpPathsToDelete.push(path);
    }
  }

  // Execute deletion in buckets
  if (webpPathsToDelete.length > 0) {
    try {
      await supabase.storage.from('article-images').remove(webpPathsToDelete);
    } catch (e) {
      console.warn('Failed to delete webp images from storage:', e);
    }
  }
  if (ogJpegPathsToDelete.length > 0) {
    try {
      await supabase.storage.from('article-og-images').remove(ogJpegPathsToDelete);
    } catch (e) {
      console.warn('Failed to delete og-jpeg images from storage:', e);
    }
  }
};

export const deleteArticle = async (id: string, articleToDelete?: DbArticle): Promise<boolean> => {
  try {
    // If article data is not provided, try to find it first for storage cleanup
    let targetArticle = articleToDelete;
    if (!targetArticle) {
      if (isSupabaseConfigured() && supabase) {
        const { data } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();
        if (data) targetArticle = data as DbArticle;
      } else {
        const current = getLocalStore<DbArticle[]>(STORAGE_KEYS.ARTICLES, getInitialArticles());
        targetArticle = current.find((a) => a.id === id);
      }
    }

    // Clean up images in storage
    if (targetArticle) {
      await deleteArticleImagesFromStorage(targetArticle);
    }

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      return true;
    } else {
      const current = getLocalStore<DbArticle[]>(STORAGE_KEYS.ARTICLES, getInitialArticles());
      setLocalStore(
        STORAGE_KEYS.ARTICLES,
        current.filter((item) => item.id !== id)
      );
      return true;
    }
  } catch (err) {
    console.error('deleteArticle error:', err);
    return false;
  }
};

// ==============================================================================
// ARTICLE REDIRECTS (301)
// ==============================================================================
export const fetchArticleRedirect = async (oldSlug: string): Promise<string | null> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('article_redirects')
        .select('new_slug')
        .eq('old_slug', oldSlug)
        .maybeSingle();
      if (!error && data?.new_slug) {
        return data.new_slug;
      }
    }
  } catch (err) {
    console.warn(`fetchArticleRedirect(${oldSlug}) error:`, err);
  }

  // Fallback to local store
  const localRedirects = getLocalStore<DbArticleRedirect[]>(STORAGE_KEYS.ARTICLE_REDIRECTS, []);
  const found = localRedirects.find((r) => r.old_slug === oldSlug);
  return found?.new_slug || null;
};

export const recordArticleRedirect = async (
  oldSlug: string,
  newSlug: string,
  articleId?: string
): Promise<boolean> => {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return false;
  try {
    const payload = {
      old_slug: oldSlug,
      new_slug: newSlug,
      article_id: articleId,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('article_redirects')
        .upsert(payload, { onConflict: 'old_slug' });
      if (error) throw error;
      return true;
    } else {
      const current = getLocalStore<DbArticleRedirect[]>(STORAGE_KEYS.ARTICLE_REDIRECTS, []);
      const filtered = current.filter((r) => r.old_slug !== oldSlug);
      setLocalStore(STORAGE_KEYS.ARTICLE_REDIRECTS, [
        {
          id: `red-${Date.now()}`,
          ...payload,
        },
        ...filtered,
      ]);
      return true;
    }
  } catch (err) {
    console.warn('recordArticleRedirect error:', err);
    return false;
  }
};

// ==============================================================================
// AUTHENTICATION & DOUBLE-VERROU (GOOGLE + APP PASSWORD)
// ==============================================================================
export interface AdminSession {
  email: string;
  isGoogleVerified: boolean;
  isAppPasswordVerified: boolean;
  authenticatedAt: string;
}

export const getAdminSession = (): AdminSession | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (
      session.isGoogleVerified &&
      session.isAppPasswordVerified &&
      session.email.toLowerCase() === ADMIN_ALLOWED_EMAIL.toLowerCase()
    ) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
};

export const saveAdminSession = (session: AdminSession): void => {
  sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
};

export const clearAdminSession = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  if (supabase) {
    supabase.auth.signOut().catch(() => {});
  }
};

// Simple secure hash helper for app password
export const hashAppPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'class_s_salt_2026_ouaga');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const getStoredAppPasswordHash = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_CONFIG);
};

export const setStoredAppPasswordHash = (hash: string): void => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_CONFIG, hash);
};
