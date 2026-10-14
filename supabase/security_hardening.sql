-- ==============================================================================
-- SCRIPT DE SÉCURISATION RLS (ROW LEVEL SECURITY) — SITE CLASS S
-- ==============================================================================
-- À exécuter dans le SQL Editor de Supabase (Dashboard > SQL Editor > New query)
-- Ce script applique le principe de défense en profondeur et du moindre privilège.
--
-- PRINCIPES APPLIQUÉS :
-- 1. Table `demandes` : Écriture publique supprimée. Seul le point d'entrée serveur
--    protégé (/api/contact) avec la clé service_role peut insérer des demandes.
--    L'administrateur authentifié (wendclasss@gmail.com) peut lire, mettre à jour
--    et supprimer les demandes depuis l'espace admin.
-- 2. Tables de contenu (`projets`, `projet_images`, `temoignages`, `articles`) :
--    Les visiteurs publics ne peuvent lire que les contenus avec le statut 'publie'.
--    L'administrateur a un accès complet (brouillons, création, édition, suppression).
-- 3. Table `evenements_visite` :
--    Insertion anonyme autorisée pour la mesure d'audience sans cookies.
--    Lecture et gestion réservées à l'administrateur.
-- 4. Storage Bucket `project-images` :
--    Lecture publique des images, écriture réservée à l'administrateur.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE DES DEMANDES DE CONTACT
-- ------------------------------------------------------------------------------
ALTER TABLE public.demandes ENABLE ROW LEVEL SECURITY;

-- Suppression de toute ancienne politique d'insertion publique
DROP POLICY IF EXISTS "Public can submit contact form" ON public.demandes;
DROP POLICY IF EXISTS "Allow public insert" ON public.demandes;
DROP POLICY IF EXISTS "Admin can view and manage all submissions" ON public.demandes;
DROP POLICY IF EXISTS "Admin full access on demandes" ON public.demandes;

-- L'admin authentifié (wendclasss@gmail.com) a un accès complet (lecture, changement statut, notes, suppression)
CREATE POLICY "Admin full access on demandes"
    ON public.demandes
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- NOTE : Aucun rôle 'anon' n'a de politique sur 'demandes'.
-- Les soumissions du formulaire passent exclusivement par la fonction Vercel
-- `/api/contact` qui utilise la clé secrète SUPABASE_SERVICE_ROLE_KEY.

-- ------------------------------------------------------------------------------
-- 2. TABLE DES PROJETS
-- ------------------------------------------------------------------------------
ALTER TABLE public.projets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published projects" ON public.projets;
DROP POLICY IF EXISTS "Admin can manage all projects" ON public.projets;

-- Public : lecture seule des projets publiés
CREATE POLICY "Public can view published projects"
    ON public.projets
    FOR SELECT
    TO anon, authenticated
    USING (status = 'publie');

-- Admin : gestion complète
CREATE POLICY "Admin can manage all projects"
    ON public.projets
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- ------------------------------------------------------------------------------
-- 3. TABLE DES IMAGES DE PROJETS
-- ------------------------------------------------------------------------------
ALTER TABLE public.projet_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view images of published projects" ON public.projet_images;
DROP POLICY IF EXISTS "Admin can manage all project images" ON public.projet_images;

-- Public : lecture des images liées aux projets publiés
CREATE POLICY "Public can view images of published projects"
    ON public.projet_images
    FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projets
            WHERE public.projets.id = public.projet_images.projet_id
            AND public.projets.status = 'publie'
        )
    );

-- Admin : gestion complète des images
CREATE POLICY "Admin can manage all project images"
    ON public.projet_images
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- ------------------------------------------------------------------------------
-- 4. TABLE DES TÉMOIGNAGES
-- ------------------------------------------------------------------------------
ALTER TABLE public.temoignages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published testimonials" ON public.temoignages;
DROP POLICY IF EXISTS "Admin can manage all testimonials" ON public.temoignages;

-- Public : lecture des témoignages publiés
CREATE POLICY "Public can view published testimonials"
    ON public.temoignages
    FOR SELECT
    TO anon, authenticated
    USING (status = 'publie');

-- Admin : gestion complète
CREATE POLICY "Admin can manage all testimonials"
    ON public.temoignages
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- ------------------------------------------------------------------------------
-- 5. TABLE DES ARTICLES DU BLOG
-- ------------------------------------------------------------------------------
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Admin can manage all articles" ON public.articles;

-- Public : lecture des articles publiés
CREATE POLICY "Public can view published articles"
    ON public.articles
    FOR SELECT
    TO anon, authenticated
    USING (status = 'publie');

-- Admin : gestion complète (brouillons, publication, édition, suppression)
CREATE POLICY "Admin can manage all articles"
    ON public.articles
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- ------------------------------------------------------------------------------
-- 6. TABLE DES ÉVÉNEMENTS DE VISITE (STATISTIQUES DE VISITE)
-- ------------------------------------------------------------------------------
ALTER TABLE public.evenements_visite ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can record visit events" ON public.evenements_visite;
DROP POLICY IF EXISTS "Admin can view all analytics" ON public.evenements_visite;

-- Public : insertion d'événements uniquement
CREATE POLICY "Public can record visit events"
    ON public.evenements_visite
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Admin : lecture et gestion des statistiques
CREATE POLICY "Admin can view all analytics"
    ON public.evenements_visite
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- ------------------------------------------------------------------------------
-- 7. STORAGE BUCKET (project-images)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public Access for project images" ON storage.objects;
DROP POLICY IF EXISTS "Admin full access on project images bucket" ON storage.objects;

-- Lecture publique des fichiers images
CREATE POLICY "Public Access for project images"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'project-images');

-- Écriture, mise à jour et suppression réservées à Scott
CREATE POLICY "Admin full access on project images bucket"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'project-images' AND (auth.jwt() ->> 'email' = 'wendclasss@gmail.com'))
    WITH CHECK (bucket_id = 'project-images' AND (auth.jwt() ->> 'email' = 'wendclasss@gmail.com'));
