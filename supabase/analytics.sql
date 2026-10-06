-- ==============================================================================
-- TABLE ET POLITIQUES POUR LES STATISTIQUES DE VISITE (ANALYTICS INTERNES)
-- ==============================================================================
-- Exécutez ce script dans le SQL Editor de Supabase pour activer la captation
-- anonyme et les visualisations dans l'admin Class S.

-- 1. Création de la table des événements de visite
CREATE TABLE IF NOT EXISTS public.evenements_visite (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('page_vue', 'etape_formulaire', 'formulaire_soumis', 'formulaire_abandonne')),
    page_or_step TEXT NOT NULL,
    duration_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour accélérer les requêtes de statistiques
CREATE INDEX IF NOT EXISTS idx_evenements_visite_created_at ON public.evenements_visite (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evenements_visite_session_id ON public.evenements_visite (session_id);
CREATE INDEX IF NOT EXISTS idx_evenements_visite_event_type ON public.evenements_visite (event_type);

-- 2. Activation de la sécurité au niveau des lignes (RLS)
ALTER TABLE public.evenements_visite ENABLE ROW LEVEL SECURITY;

-- 3. Politiques d'accès :
-- Public (anonyme) : INSERT uniquement pour enregistrer les événements de navigation
DROP POLICY IF EXISTS "Public can record visit events" ON public.evenements_visite;
CREATE POLICY "Public can record visit events" 
    ON public.evenements_visite FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

-- Admin authentifié wendclasss@gmail.com : SELECT et gestion complète des statistiques
DROP POLICY IF EXISTS "Admin can view all analytics" ON public.evenements_visite;
CREATE POLICY "Admin can view all analytics" 
    ON public.evenements_visite FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');

-- 4. Sécurisation confirmée pour la table 'demandes' (Suppression réservée à l'admin)
DROP POLICY IF EXISTS "Public can submit contact form" ON public.demandes;
CREATE POLICY "Public can submit contact form" 
    ON public.demandes FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can view and manage all submissions" ON public.demandes;
CREATE POLICY "Admin can view and manage all submissions" 
    ON public.demandes FOR ALL 
    TO authenticated 
    USING (auth.jwt() ->> 'email' = 'wendclasss@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'wendclasss@gmail.com');
