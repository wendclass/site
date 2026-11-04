-- ==============================================================================
-- MIGRATION : AJOUT DE SLUG & ACCROCHE AUX PROJETS + TABLE DE REDIRECTIONS
-- Auteur : Class S (Scott Nana)
-- Date : 2026-11-04
-- ==============================================================================

-- 1. Ajout des colonnes slug et accroche à la table projets
ALTER TABLE public.projets
ADD COLUMN IF NOT EXISTS slug text;

ALTER TABLE public.projets
ADD COLUMN IF NOT EXISTS accroche text;

-- 2. Index unique sur le slug des projets
CREATE UNIQUE INDEX IF NOT EXISTS idx_projets_slug ON public.projets(slug);

-- 3. Table de redirections 301 pour les slugs de projets modifiés
CREATE TABLE IF NOT EXISTS public.projet_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    old_slug TEXT NOT NULL UNIQUE,
    new_slug TEXT NOT NULL,
    projet_id UUID REFERENCES public.projets(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projet_redirects_old_slug ON public.projet_redirects(old_slug);

-- 4. Attribution des slugs et accroches par défaut pour les 5 projets historiques
UPDATE public.projets
SET slug = '72-heures-cj-2026',
    accroche = COALESCE(accroche, tagline, 'Une stratégie visuelle rythmée pour surpasser l’impact des éditions précédentes.')
WHERE (slug = '72h-cj-2026' OR slug = '72-heures-cj-2026' OR slug IS NULL) AND title ILIKE '%72%';

UPDATE public.projets
SET slug = 'mon-frere-parle',
    accroche = COALESCE(accroche, tagline, 'Une identité apaisante pour libérer la parole des hommes sur la santé mentale.')
WHERE (slug IS NULL OR slug = 'mon-frere-parle') AND title ILIKE '%Frère%';

UPDATE public.projets
SET slug = 'off-day',
    accroche = COALESCE(accroche, tagline, 'Une conception épurée pour marquer les esprits dès la première édition.')
WHERE (slug IS NULL OR slug = 'off-day') AND title ILIKE '%Off Day%';

UPDATE public.projets
SET slug = 'cafe-inspire',
    accroche = COALESCE(accroche, tagline, 'Structuration d’une identité visuelle récurrente pour stimuler l’engagement commercial.')
WHERE (slug IS NULL OR slug = 'cafe-inspire') AND title ILIKE '%Café Inspire%';

UPDATE public.projets
SET slug = 'bang',
    accroche = COALESCE(accroche, tagline, 'Une identité singulière pour réinventer l’expérience de révision des élèves et étudiants.')
WHERE (slug IS NULL OR slug = 'bang') AND title ILIKE '%Bang%';

-- 5. Redirection de l'ancien slug 72h-cj-2026 vers 72-heures-cj-2026
INSERT INTO public.projet_redirects (old_slug, new_slug)
VALUES ('72h-cj-2026', '72-heures-cj-2026')
ON CONFLICT (old_slug) DO UPDATE SET new_slug = EXCLUDED.new_slug;
