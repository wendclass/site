-- ==============================================================================
-- TABLE ET POLITIQUES POUR LE BLOG & ARTICLES — SITE CLASS S
-- ==============================================================================
-- Exécutez ce script dans le SQL Editor de Supabase pour créer la table 'articles'
-- et configurer la sécurité RLS.

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

-- Index pour accélérer le tri et la recherche
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles (published_at DESC);

-- Activation de la sécurité au niveau des lignes (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 1. Lecture publique : les visiteurs ne peuvent lire QUE les articles publiés
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles" 
    ON public.articles FOR SELECT 
    TO anon, authenticated 
    USING (status = 'publie');

-- 2. Administrateur (wendclasss@gmail.com) : Accès complet (lecture brouillons, création, modification, suppression)
DROP POLICY IF EXISTS "Admin can manage all articles" ON public.articles;
CREATE POLICY "Admin can manage all articles" 
    ON public.articles FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');
