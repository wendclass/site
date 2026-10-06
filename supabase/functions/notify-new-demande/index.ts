// Supabase Edge Function: notify-new-demande
// Système de notification email haute fidélité — Class S / Scott Nana

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface WebhookPayload {
  type?: string;
  table?: string;
  record?: DemandeRecord;
  id?: string;
  full_name?: string;
  company_name?: string;
  whatsapp_number?: string;
  project_type?: string;
  goals?: string[];
  goals_other?: string;
  branch_data?: Record<string, unknown>;
  created_at?: string;
}

interface DemandeRecord {
  id: string;
  full_name: string;
  company_name: string;
  whatsapp_number: string;
  project_type: string;
  goals?: string[];
  goals_other?: string;
  branch_data?: Record<string, unknown>;
  created_at?: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Dictionnaire complet des types de projet
const PROJECT_TYPES: Record<string, string> = {
  logo: "Logo et image pour l’entreprise",
  social: "Visuels pour les réseaux sociaux",
  print: "Supports imprimés",
  event: "Événement à faire connaître",
  website: "Site web vitrine",
  unknown: "Orientation & Conseil personnalisé",
};

// Dictionnaire complet des objectifs (question 2)
const GOAL_LABELS: Record<string, string> = {
  more_clients: "Attirer plus de clients",
  new_offer: "Faire connaître un nouveau produit ou service",
  stand_out: "Me démarquer de mes concurrents",
  credibility: "Être pris au sérieux par mes clients",
  other: "Autre besoin spécifique",
};

// Dictionnaire des options de branches conditionnelles
const BRANCH_LABELS: Record<string, string> = {
  // Branche A : Logo
  zero: "Part de zéro (n’a pas encore de logo)",
  redo: "Dispose déjà d’un logo, mais souhaite une refonte complète plus professionnelle",
  keep: "Dispose d’un logo à conserver et souhaite le compléter avec une identité globale",
  yes_remake: "Dispose déjà d’un logo, mais souhaite une refonte complète",

  // Branche B : Social
  occasional: "Une fois de temps en temps pour un besoin précis",
  weekly: "Chaque semaine (2 à 3 visuels réguliers)",
  multiple_weekly: "Plusieurs fois par semaine (rythme soutenu)",
  daily: "Quotidienne (visuels récurrents)",

  // Branche C : Supports print
  kakemono: "Kakémonos (grandes affiches sur pied)",
  bache: "Bâches ou banderoles",
  affiche: "Affiches ou flyers",
  carte: "Cartes de visite",

  // Branche D : Événement
  less_than_month: "Dans moins d’un mois (Urgent)",
  one_to_three_months: "Dans un à trois mois",
  more_than_three_months: "Dans plus de trois mois",
  no_date: "Pas encore de date fixée",

  // Branche E : Web
  one_page: "Site One-Page (Présentation fluide et directe)",
  onepage: "Site One-Page (Présentation fluide et directe)",
  multi_page: "Site Multi-Pages (Présentation, services, réalisations, contact…)",
  multipage: "Site Multi-Pages (Arborescence complète)",
};

function getProjectTypeLabel(type: string): string {
  return PROJECT_TYPES[type] || type || "Projet sur-mesure";
}

function formatGoal(goalKey: string): string {
  return GOAL_LABELS[goalKey] || goalKey;
}

// Convertit les réponses conditionnelles en phrases claires et lisibles
function formatBranchDetailsHtml(type: string, data: Record<string, unknown> = {}): string {
  switch (type) {
    case "logo": {
      const val = (data.hasLogo as string) || "zero";
      const label = BRANCH_LABELS[val] || val;
      return `<p style="margin:0; color:#F8FAFC; font-size:14px; line-height:1.6;">• Situation actuelle : <strong style="color:#FFFFFF;">${label}</strong></p>`;
    }
    case "social": {
      const val = (data.socialFrequency as string) || "occasional";
      const label = BRANCH_LABELS[val] || val;
      return `<p style="margin:0; color:#F8FAFC; font-size:14px; line-height:1.6;">• Fréquence souhaitée : <strong style="color:#FFFFFF;">${label}</strong></p>`;
    }
    case "print": {
      const rawItems = (data.printItems as string[]) || [];
      const translatedItems = rawItems.map((item) => BRANCH_LABELS[item] || item);
      const details = data.printOtherText as string | undefined;

      let html = `<p style="margin:0 0 6px 0; color:#F8FAFC; font-size:14px; line-height:1.6;">• Supports demandés : <strong style="color:#FFFFFF;">${
        translatedItems.length > 0 ? translatedItems.join(", ") : "Non spécifiés"
      }</strong></p>`;
      if (details) {
        html += `<p style="margin:4px 0 0 0; color:#E2E8F0; font-size:13px; background-color:#14151D; padding:10px; border-radius:8px; border-left:3px solid #7942D6;">Précisions : <em style="color:#FFFFFF;">${details}</em></p>`;
      }
      return html;
    }
    case "event": {
      const timingKey = data.eventTiming as string | undefined;
      const timingLabel = timingKey ? (BRANCH_LABELS[timingKey] || timingKey) : "Non spécifiée";
      const isUnknown = Boolean(data.eventUnknown);
      const printItems = (data.eventPrintItems as string[]) || [];
      const digitalItems = (data.eventDigitalItems as string[]) || [];
      const allItems = [...printItems, ...digitalItems];
      const details = data.eventOtherText as string | undefined;

      let html = `<p style="margin:0 0 6px 0; color:#F8FAFC; font-size:14px; line-height:1.6;">• Échéance : <strong style="color:#FFFFFF;">${timingLabel}</strong></p>`;
      if (isUnknown) {
        html += `<p style="margin:4px 0 0 0; color:#FDE68A; font-size:13px; font-style:italic;">Besoins exacts à cadrer ensemble lors du premier échange sur WhatsApp.</p>`;
      } else if (allItems.length > 0) {
        html += `<p style="margin:4px 0 0 0; color:#F8FAFC; font-size:14px; line-height:1.6;">• Supports identifiés : <strong style="color:#FFFFFF;">${allItems.join(", ")}</strong></p>`;
      }
      if (details) {
        html += `<p style="margin:6px 0 0 0; color:#E2E8F0; font-size:13px; background-color:#14151D; padding:10px; border-radius:8px; border-left:3px solid #7942D6;">Précisions : <em style="color:#FFFFFF;">${details}</em></p>`;
      }
      return html;
    }
    case "website": {
      const val = (data.websiteType as string) || "one_page";
      const label = BRANCH_LABELS[val] || (val === "other" ? "Autre besoin spécifique" : val);
      const details = data.websiteOtherText as string | undefined;

      let html = `<p style="margin:0; color:#F8FAFC; font-size:14px; line-height:1.6;">• Type de site souhaité : <strong style="color:#FFFFFF;">${label}</strong></p>`;
      if (details) {
        html += `<p style="margin:6px 0 0 0; color:#E2E8F0; font-size:13px; background-color:#14151D; padding:10px; border-radius:8px; border-left:3px solid #7942D6;">Précisions : <em style="color:#FFFFFF;">${details}</em></p>`;
      }
      return html;
    }
    default: {
      const freeText = data.freeTextSituation as string | undefined;
      let html = `<p style="margin:0; color:#F8FAFC; font-size:14px; line-height:1.6;">• Demande d'orientation générale. Le prospect souhaite un premier cadrage direct.</p>`;
      if (freeText) {
        html += `<p style="margin:6px 0 0 0; color:#E2E8F0; font-size:13px; background-color:#14151D; padding:10px; border-radius:8px; border-left:3px solid #7942D6;">Message du prospect : <em style="color:#FFFFFF;">« ${freeText} »</em></p>`;
      }
      return html;
    }
  }
}

function formatBranchDetailsText(type: string, data: Record<string, unknown> = {}): string {
  const html = formatBranchDetailsHtml(type, data);
  return html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "").trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const payload: WebhookPayload = await req.json();

    // Filtre : uniquement sur INSERT
    if (payload.type && payload.type !== "INSERT") {
      console.log(`[notify-new-demande] Ignored event type: ${payload.type}`);
      return new Response(JSON.stringify({ message: "Ignored non-INSERT event" }), {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const record: DemandeRecord | undefined = payload.record || (payload.id ? (payload as DemandeRecord) : undefined);

    if (!record || !record.full_name || !record.whatsapp_number) {
      return new Response(JSON.stringify({ error: "Missing record data" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RECIPIENT_EMAIL = Deno.env.get("NOTIFICATION_RECIPIENT_EMAIL") || "wendclasss@gmail.com";
    const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") || "Class S Notifications <onboarding@resend.dev>";
    const SITE_URL = Deno.env.get("SITE_URL") || "https://wendclass.vercel.app";

    if (!RESEND_API_KEY) {
      console.error("[notify-new-demande] RESEND_API_KEY secret is missing.");
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY secret is missing." }),
        { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // Données formatées
    const projectLabel = getProjectTypeLabel(record.project_type);
    const companyDisplay = record.company_name ? record.company_name.trim() : "Non précisée";
    const cleanPhone = record.whatsapp_number.replace(/[^0-9+]/g, "");
    const waUrl = `https://wa.me/${cleanPhone.replace("+", "")}`;
    const adminDirectUrl = `${SITE_URL}/classs?demande_id=${record.id}&tab=demandes`;

    // Formatage des objectifs avec labels humains
    let goalsHtml = '<p style="margin:0; color:#94A3B8; font-style:italic;">Aucun objectif sélectionné</p>';
    let goalsText = "Non spécifiés";
    if (record.goals && record.goals.length > 0) {
      const translatedGoals = record.goals.map((g) => formatGoal(g));
      goalsHtml = translatedGoals
        .map(
          (label) =>
            `<div style="margin-bottom:4px; color:#FFFFFF; font-size:14px; line-height:1.5;">• ${label}</div>`
        )
        .join("");
      if (record.goals_other) {
        goalsHtml += `<div style="margin-top:6px; color:#E2E8F0; font-size:13px; background-color:#14151D; padding:8px 10px; border-radius:6px;">Autre précision : <em style="color:#FFFFFF;">${record.goals_other}</em></div>`;
      }
      goalsText = translatedGoals.join(", ");
    }

    const branchHtml = formatBranchDetailsHtml(record.project_type, record.branch_data || {});
    const branchText = formatBranchDetailsText(record.project_type, record.branch_data || {});

    // Formatage de la date en français (Heure de Ouagadougou / GMT)
    const dateFormatted = record.created_at
      ? new Date(record.created_at).toLocaleString("fr-FR", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "Africa/Ouagadougou",
        })
      : new Date().toLocaleString("fr-FR", { timeZone: "Africa/Ouagadougou" });

    const subject = `Nouvelle demande Class S — ${projectLabel} — ${record.company_name || record.full_name}`;

    // Modèle HTML Haute Visibilité — Charte Class S (Onyx #0E0F12 / Violet #3B1E7A / Améthyste #7942D6 / Or #C69254)
    const htmlBody = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0; padding:24px 12px; background-color:#08090C; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;">
  
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px; margin:0 auto; background-color:#13141B; border:1px solid #3B1E7A; border-radius:18px; overflow:hidden; box-shadow:0 12px 40px rgba(0,0,0,0.6);">
    
    <!-- EN-TÊTE DE MARQUE CLASS S -->
    <tr>
      <td style="background: linear-gradient(135deg, #2D1460 0%, #4C239A 50%, #6830C8 100%); padding:28px 26px; border-bottom:1px solid #5B21B6;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <div style="display:inline-block; padding:4px 10px; background-color:rgba(0,0,0,0.35); border:1px solid #C69254; border-radius:20px; color:#FCD34D; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:12px;">
                ✦ CLASS S • NOTIFICATION OFFICIELLE
              </div>
              <h1 style="margin:0 0 6px 0; font-size:22px; font-weight:800; color:#FFFFFF; letter-spacing:-0.5px;">
                🚀 Nouvelle Demande de Projet
              </h1>
              <p style="margin:0; font-size:13px; color:#E9D5FF; font-weight:400;">
                Reçue le ${dateFormatted} via le site web
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CORPS DU MESSAGE -->
    <tr>
      <td style="padding:24px 22px;">

        <!-- 1. CARTE PROSPECT -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#1B1C26; border:1px solid #2D3043; border-radius:12px; margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;">
              <div style="font-size:11px; font-weight:800; color:#A78BFA; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                👤 Prospect & Entreprise
              </div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-bottom:6px;">
                ${record.full_name}
              </div>
              <div style="font-size:14px; color:#E2E8F0; margin-bottom:12px;">
                🏢 Entreprise / Marque : <strong style="color:#F5F3FF;">${companyDisplay}</strong>
              </div>
              <div style="background-color:#0F1016; padding:10px 14px; border-radius:8px; border:1px solid #22C55E33;">
                <span style="color:#CBD5E1; font-size:13px;">WhatsApp direct :</span>
                <a href="${waUrl}" style="color:#4ADE80; font-size:15px; font-weight:800; text-decoration:none; margin-left:6px;">
                  ${record.whatsapp_number} ↗
                </a>
              </div>
            </td>
          </tr>
        </table>

        <!-- 2. CARTE PROJET -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#1B1C26; border:1px solid #2D3043; border-radius:12px; margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;">
              <div style="font-size:11px; font-weight:800; color:#A78BFA; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                🎯 Projet Sélectionné
              </div>
              <div style="margin-bottom:14px;">
                <span style="color:#CBD5E1; font-size:13px;">Type de service :</span><br/>
                <strong style="color:#C084FC; font-size:16px; font-weight:700; display:inline-block; margin-top:2px;">
                  ${projectLabel}
                </strong>
              </div>
              <div>
                <span style="color:#CBD5E1; font-size:13px; display:block; margin-bottom:6px;">Objectif(s) visé(s) :</span>
                <div style="padding-left:4px;">
                  ${goalsHtml}
                </div>
              </div>
            </td>
          </tr>
        </table>

        <!-- 3. CARTE PRÉCISIONS & BRANCHE -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#1B1C26; border:1px solid #2D3043; border-radius:12px; margin-bottom:24px;">
          <tr>
            <td style="padding:18px 20px;">
              <div style="font-size:11px; font-weight:800; color:#A78BFA; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
                📋 Détails du besoin spécifique
              </div>
              <div>
                ${branchHtml}
              </div>
            </td>
          </tr>
        </table>

        <!-- BOUTONS D'ACTION -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding-bottom:10px;">
              
              <!-- Bouton WhatsApp -->
              <a href="${waUrl}" target="_blank" style="display:inline-block; background-color:#22C55E; color:#052E16 !important; font-size:14px; font-weight:800; text-decoration:none; padding:13px 22px; border-radius:10px; margin:4px 6px; box-shadow:0 4px 14px rgba(34,197,94,0.35);">
                📲 Répondre sur WhatsApp
              </a>
              
              <!-- Bouton Admin -->
              <a href="${adminDirectUrl}" target="_blank" style="display:inline-block; background-color:#3B1E7A; color:#FFFFFF !important; font-size:14px; font-weight:700; text-decoration:none; padding:13px 22px; border-radius:10px; border:1px solid #7942D6; margin:4px 6px;">
                🔒 Ouvrir la fiche dans l'Admin
              </a>

            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- PIED DE PAGE -->
    <tr>
      <td style="padding:16px 20px; background-color:#0D0E13; border-top:1px solid #232533; text-align:center;">
        <p style="margin:0 0 4px 0; font-size:12px; color:#94A3B8;">
          Class S • Scott Nana — Ouagadougou, Burkina Faso
        </p>
        <p style="margin:0; font-size:10.5px; color:#64748B; font-family:monospace;">
          ID Demande : ${record.id}
        </p>
      </td>
    </tr>

  </table>

</body>
</html>
    `;

    // Version texte brut
    const textBody = `
NOUVELLE DEMANDE DE PROJET — CLASS S
====================================
Date : ${dateFormatted}

PROSPECT :
• Nom & Prénom : ${record.full_name}
• Entreprise : ${companyDisplay}
• WhatsApp : ${record.whatsapp_number}

PROJET :
• Type : ${projectLabel}
• Objectifs : ${goalsText}
${record.goals_other ? `• Autre précision : ${record.goals_other}\n` : ""}

DÉTAILS DU BESOIN :
${branchText}

ACTIONS DIRECTES :
• WhatsApp direct : ${waUrl}
• Fiche dans l'Admin Class S : ${adminDirectUrl}
    `.trim();

    // Envoi via Resend
    console.log(`[notify-new-demande] Envoi email à ${RECIPIENT_EMAIL} via Resend...`);
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [RECIPIENT_EMAIL],
        subject: subject,
        html: htmlBody,
        text: textBody,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("[notify-new-demande] Resend error:", resendData);
    } else {
      console.log(`[notify-new-demande] Email envoyé avec succès ! Resend ID:`, resendData.id);
    }

    return new Response(
      JSON.stringify({ success: resendResponse.ok, resendData }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[notify-new-demande] Exception:", errorMsg);
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
