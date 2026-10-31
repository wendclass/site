-- ==============================================================================
-- MIGRATION : ÉDITEUR D'ARTICLES, REDIRECTIONS 301 ET STORAGE SUPABASE
-- ==============================================================================
-- Exécutez ce script dans le SQL Editor de Supabase pour configurer :
-- 1. Les nouvelles colonnes de la table articles
-- 2. La table article_redirects pour les redirections 301
-- 3. Les compartiments de stockage 'article-images' et 'article-og-images' avec RLS
-- ==============================================================================

-- 1. Extension des colonnes de la table 'articles'
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS cover_image_alt TEXT,
ADD COLUMN IF NOT EXISTS cover_image_og_jpeg TEXT,
ADD COLUMN IF NOT EXISTS cover_image_srcset JSONB,
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS content_json JSONB;

-- 2. Table des redirections d'articles (redirections 301 en cas de changement de slug)
CREATE TABLE IF NOT EXISTS public.article_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    old_slug TEXT NOT NULL UNIQUE,
    new_slug TEXT NOT NULL,
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_redirects_old_slug ON public.article_redirects (old_slug);

-- RLS pour article_redirects
ALTER TABLE public.article_redirects ENABLE ROW LEVEL SECURITY;

-- Lecture publique des redirections pour le SSR et le routeur
DROP POLICY IF EXISTS "Public can view redirects" ON public.article_redirects;
CREATE POLICY "Public can view redirects" 
    ON public.article_redirects FOR SELECT 
    TO anon, authenticated 
    USING (true);

-- Admin peut insérer, mettre à jour et supprimer des redirections
DROP POLICY IF EXISTS "Admin can manage redirects" ON public.article_redirects;
CREATE POLICY "Admin can manage redirects" 
    ON public.article_redirects FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- 3. Compartiments Supabase Storage
-- Compartiment 1 : 'article-images' (Strictement WebP, max 5 Mo)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'article-images',
    'article-images',
    true,
    5242880, -- 5 Mo
    ARRAY['image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/webp'];

-- Compartiment 2 : 'article-og-images' (Strictement JPEG pour Open Graph réseaux sociaux, max 2 Mo)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'article-og-images',
    'article-og-images',
    true,
    2097152, -- 2 Mo
    ARRAY['image/jpeg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg'];

-- Politiques de sécurité Storage (RLS sur storage.objects)
-- Lecture publique des images d'articles
DROP POLICY IF EXISTS "Public can view article images" ON storage.objects;
CREATE POLICY "Public can view article images"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id IN ('article-images', 'article-og-images'));

-- Seul Scott Nana (admin authentifié) peut téléverser, modifier ou supprimer des images
DROP POLICY IF EXISTS "Admin can manage article images" ON storage.objects;
CREATE POLICY "Admin can manage article images"
    ON storage.objects FOR ALL
    TO authenticated
    USING (
        bucket_id IN ('article-images', 'article-og-images') 
        AND auth.jwt() ->> 'email' = 'wendclasss@gmail.com'
    )
    WITH CHECK (
        bucket_id IN ('article-images', 'article-og-images') 
        AND auth.jwt() ->> 'email' = 'wendclasss@gmail.com'
    );
