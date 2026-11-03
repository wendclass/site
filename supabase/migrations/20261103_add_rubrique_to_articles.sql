-- Migration: Ajout de la colonne 'rubrique' pour structurer le filtrage du blog
-- Auteur: Class S (Scott Nana)
-- Date: 2026-11-03

ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS rubrique text;

-- Index pour optimiser les requêtes filtrées par rubrique
CREATE INDEX IF NOT EXISTS idx_articles_rubrique ON public.articles(rubrique);

-- Rétro-compatibilité : mise à jour des articles existants selon leurs étiquettes
UPDATE public.articles
SET rubrique = 'identite-visuelle'
WHERE slug = 'identite-visuelle-definition-entrepreneur' AND (rubrique IS NULL OR rubrique = '');

UPDATE public.articles
SET rubrique = 'strategie-de-marque'
WHERE slug = 'pourquoi-un-logo-seul-ne-sauvera-pas-votre-entreprise' AND (rubrique IS NULL OR rubrique = '');

UPDATE public.articles
SET rubrique = 'reseaux-sociaux'
WHERE slug = '5-erreurs-graphiques-reseaux-sociaux-credibilite' AND (rubrique IS NULL OR rubrique = '');

UPDATE public.articles
SET rubrique = 'business-conversion'
WHERE slug = 'transformer-identite-visuelle-en-levier-de-conversion' AND (rubrique IS NULL OR rubrique = '');
