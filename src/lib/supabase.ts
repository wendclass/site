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

// ==============================================================================
// LOCAL STORAGE MOCK STORE FOR FALLBACK & DEMO
// ==============================================================================
const STORAGE_KEYS = {
  DEMANDES: 'class_s_demandes_v1',
  PROJETS: 'class_s_projets_v1',
  TEMOIGNAGES: 'class_s_temoignages_v1',
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

// --- DEMANDES (CONTACT FORM) ---
export const submitDemande = async (data: Omit<Demande, 'id' | 'created_at' | 'status' | 'internal_notes'>): Promise<{ success: boolean; error?: string; id?: string }> => {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('demandes')
        .insert([
          {
            project_type: data.project_type,
            goals: data.goals,
            goals_other: data.goals_other || null,
            branch_data: data.branch_data,
            full_name: data.full_name,
            company_name: data.company_name,
            whatsapp_number: data.whatsapp_number,
            status: 'nouveau',
            internal_notes: '',
          },
        ]);

      if (error) {
        console.error('Supabase submitDemande error:', error);
        throw error;
      }
      return { success: true };
    } else {
      // Fallback local mock
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
  } catch (err: any) {
    console.error('Submit demande failed:', err);
    return { success: false, error: err?.message || 'Une erreur est survenue lors de l’envoi de votre demande.' };
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
