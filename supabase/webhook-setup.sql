-- ==============================================================================
-- CONFIGURATION DU DATABASE WEBHOOK POUR LES NOTIFICATIONS EMAIL
-- ==============================================================================
-- Vous pouvez configurer ce déclenchement soit via le Dashboard Supabase (recommandé),
-- soit via ce script SQL si l'extension pg_net est activée.

-- OPTION A (RECOMMANDÉE — Via le Dashboard Supabase) :
-- 1. Allez dans Dashboard Supabase > Database > Webhooks
-- 2. Cliquez sur "Create a new webhook" (ou "Enable Webhooks")
-- 3. Nom : "webhook_notify_new_demande"
-- 4. Table : "public.demandes"
-- 5. Events : Cochez UNIQUEMENT "Insert" (décochez Update et Delete)
-- 6. Type of webhook : "Supabase Edge Function"
-- 7. Edge Function : Sélectionnez "notify-new-demande"
-- 8. HTTP Method : POST
-- 9. Cliquez sur Save.

-- ==============================================================================
-- OPTION B (Via SQL avec pg_net / Triggers natifs) :
-- ==============================================================================

-- 1. Activer l'extension pg_net si nécessaire
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- 2. Fonction trigger pour appeler l'Edge Function
CREATE OR REPLACE FUNCTION public.trigger_notify_new_demande()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  edge_function_url TEXT;
  service_role_key TEXT;
  payload JSONB;
BEGIN
  -- URL de l'Edge function Supabase (ajustez si nécessaire)
  edge_function_url := 'https://mtinydrkpxffrlsuwpzh.supabase.co/functions/v1/notify-new-demande';
  
  -- Construction du payload Webhook compatible
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', to_jsonb(NEW)
  );

  -- Appel asynchrone non-bloquant via pg_net
  -- L'échec d'envoi n'annule JAMAIS l'insertion de la demande
  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := payload
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur de réseau, ne bloque jamais l'insertion en base
    RAISE WARNING 'Notification email échouée : %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. Déclencheur UNIQUEMENT sur INSERT
DROP TRIGGER IF EXISTS trg_notify_new_demande ON public.demandes;
CREATE TRIGGER trg_notify_new_demande
  AFTER INSERT ON public.demandes
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_notify_new_demande();

COMMENT ON TRIGGER trg_notify_new_demande ON public.demandes IS 
  'Déclenche la notification email vers Scott Nana (wendclasss@gmail.com) à chaque nouvelle soumission de formulaire.';
