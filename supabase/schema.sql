-- ==============================================================================
-- SCHÉMA DE BASE DE DONNÉES SUPABASE — SITE OFFICIEL CLASS S / SCOTT NANA
-- ==============================================================================
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase (SQL Editor)

-- 1. Activation des extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE DES DEMANDES (Soumissions du formulaire de contact)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.demandes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    project_type TEXT NOT NULL,
    goals TEXT[] NOT NULL DEFAULT '{}',
    goals_other TEXT,
    branch_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    full_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'traite', 'archive')),
    internal_notes TEXT DEFAULT ''
);

-- Index pour accélérer le tri et le filtrage des demandes
CREATE INDEX IF NOT EXISTS idx_demandes_created_at ON public.demandes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demandes_status ON public.demandes (status);

-- ==============================================================================
-- 3. TABLE DES PROJETS (Études de cas & Réalisations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    tagline TEXT NOT NULL,
    client_goal TEXT NOT NULL,
    designed_solution TEXT NOT NULL,
    result TEXT NOT NULL,
    disclaimer TEXT,
    status TEXT NOT NULL DEFAULT 'publie' CHECK (status IN ('publie', 'brouillon')),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projets_display_order ON public.projets (display_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projets_status ON public.projets (status);

-- ==============================================================================
-- 4. TABLE DES IMAGES DE PROJETS (Galeries d'œuvres)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projet_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projet_id UUID NOT NULL REFERENCES public.projets(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT NOT NULL,
    is_hero BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projet_images_projet_id ON public.projet_images (projet_id, display_order ASC);

-- ==============================================================================
-- 5. TABLE DES TÉMOIGNAGES (Retours d'expérience)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.temoignages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name TEXT NOT NULL,
    author_role_company TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    projet_id UUID REFERENCES public.projets(id) ON DELETE SET NULL,
    category TEXT,
    impact_result TEXT,
    status TEXT NOT NULL DEFAULT 'publie' CHECK (status IN ('publie', 'brouillon')),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_temoignages_display_order ON public.temoignages (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_temoignages_status ON public.temoignages (status);

-- ==============================================================================
-- 6. TABLE DE CONFIGURATION DU DOUBLE VERROU ADMIN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_config (
    id TEXT PRIMARY KEY DEFAULT 'auth_config',
    app_password_hash TEXT,
    allowed_email TEXT NOT NULL DEFAULT 'wendclasss@gmail.com',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. CONFIGURATION DES ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Activation RLS sur toutes les tables
ALTER TABLE public.demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projet_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temoignages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- 7.1 Politiques pour 'demandes'
-- Public (anonyme) : INSERT uniquement pour envoyer le formulaire
CREATE POLICY "Public can submit contact form" 
    ON public.demandes FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

-- Admin authentifié wendclasss@gmail.com : SELECT, UPDATE, DELETE
CREATE POLICY "Admin can view and manage all submissions" 
    ON public.demandes FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- 7.2 Politiques pour 'projets'
-- Public : SELECT uniquement les projets publiés
CREATE POLICY "Public can view published projects" 
    ON public.projets FOR SELECT 
    TO anon, authenticated 
    USING (status = 'publie');

-- Admin : ALL (lecture brouillons, création, modification, suppression)
CREATE POLICY "Admin can manage all projects" 
    ON public.projets FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- 7.3 Politiques pour 'projet_images'
-- Public : SELECT les images des projets publiés
CREATE POLICY "Public can view images of published projects" 
    ON public.projet_images FOR SELECT 
    TO anon, authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.projets 
            WHERE public.projets.id = public.projet_images.projet_id 
            AND public.projets.status = 'publie'
        )
    );

-- Admin : ALL sur les images
CREATE POLICY "Admin can manage all project images" 
    ON public.projet_images FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- 7.4 Politiques pour 'temoignages'
-- Public : SELECT uniquement les témoignages publiés
CREATE POLICY "Public can view published testimonials" 
    ON public.temoignages FOR SELECT 
    TO anon, authenticated 
    USING (status = 'publie');

-- Admin : ALL
CREATE POLICY "Admin can manage all testimonials" 
    ON public.temoignages FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- 7.5 Politiques pour 'admin_config'
CREATE POLICY "Admin can read and update auth config" 
    ON public.admin_config FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- ==============================================================================
-- 8. STORAGE BUCKET CONFIGURATION (project-images)
-- ==============================================================================
-- Création du bucket si non existant
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Lecture publique de tous les fichiers stockés
CREATE POLICY "Public Access for project images"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'project-images');

-- Upload / modification / suppression réservé à l'administrateur
CREATE POLICY "Admin full access on project images bucket"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'project-images' AND (auth.jwt() ->> 'email' = 'wendclasss@gmail.com'))
    WITH CHECK (bucket_id = 'project-images' AND (auth.jwt() ->> 'email' = 'wendclasss@gmail.com'));

-- ==============================================================================
-- 9. TABLE DES ARTICLES DU BLOG
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'brouillon' CHECK (status IN ('publie', 'brouillon')),
    meta_description TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles (published_at DESC);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published articles" 
    ON public.articles FOR SELECT 
    TO anon, authenticated 
    USING (status = 'publie');

CREATE POLICY "Admin can manage all articles" 
    ON public.articles FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- ==============================================================================
-- 10. TABLE DES ÉVÉNEMENTS DE VISITE (ANALYTICS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.evenements_visite (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('page_vue', 'etape_formulaire', 'formulaire_soumis', 'formulaire_abandonne')),
    page_or_step TEXT NOT NULL,
    duration_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evenements_visite_created_at ON public.evenements_visite (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evenements_visite_session_id ON public.evenements_visite (session_id);
CREATE INDEX IF NOT EXISTS idx_evenements_visite_event_type ON public.evenements_visite (event_type);

ALTER TABLE public.evenements_visite ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can record visit events" 
    ON public.evenements_visite FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

CREATE POLICY "Admin can view all analytics" 
    ON public.evenements_visite FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

