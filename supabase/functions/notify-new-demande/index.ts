// Supabase Edge Function: notify-new-demande
// Triggered on INSERT on the public.demandes table
// Sends an immediate email notification to Scott Nana (wendclasss@gmail.com) via Resend

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface WebhookPayload {
  type?: string;
  table?: string;
  record?: DemandeRecord;
  // Support direct object passing as fallback
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

// Format project type into clean human label
function getProjectTypeLabel(type: string): string {
  const map: Record<string, string> = {
    logo: "Logo & Identité Visuelle",
    social: "Social Media & Réseaux Sociaux",
    print: "Supports Imprimés",
    event: "Communication Événementielle",
    website: "Site Web Vitrine",
    unknown: "Orientation Générale",
  };
  return map[type] || type || "Demande personnalisée";
}

// Convert conditional branch responses into clear human-readable sentences
function formatBranchData(type: string, data: Record<string, unknown> = {}): string {
  switch (type) {
    case "logo": {
      const hasLogo = data.hasLogo as string | undefined;
      if (hasLogo === "yes_remake") {
        return "• Dispose déjà d'un logo existant, mais souhaite une <strong>refonte complète plus professionnelle</strong>.";
      }
      return "• <strong>Part de zéro</strong>, ne dispose pas encore de logo.";
    }
    case "social": {
      const freq = data.socialFrequency as string | undefined;
      const freqLabel =
        freq === "daily"
          ? "Quotidienne (visuels récurrents réguliers)"
          : freq === "weekly"
          ? "Hebdomadaire (2 à 3 visuels par semaine)"
          : "Ponctuelle / Lancement de campagne";
      return `• Fréquence de publication souhaitée : <strong>${freqLabel}</strong>`;
    }
    case "print": {
      const items = (data.printItems as string[]) || [];
      const details = data.printOtherText as string | undefined;
      let text = `• Supports demandés : <strong>${items.length > 0 ? items.join(", ") : "Non spécifiés"}</strong>`;
      if (details) {
        text += `<br/>• Précisions : <em>${details}</em>`;
      }
      return text;
    }
    case "event": {
      const timing = (data.eventTiming as string) || "Non spécifiée";
      const printItems = (data.eventPrintItems as string[]) || [];
      const digitalItems = (data.eventDigitalItems as string[]) || [];
      const allItems = [...printItems, ...digitalItems];
      const details = data.eventOtherText as string | undefined;
      const isUnknown = data.eventUnknown as boolean | undefined;

      let text = `• Échéance de l'événement : <strong>${timing}</strong>`;
      if (isUnknown) {
        text += `<br/>• <em>Besoins exacts à cadrer ensemble lors du premier échange.</em>`;
      } else if (allItems.length > 0) {
        text += `<br/>• Besoins identifiés : <strong>${allItems.join(", ")}</strong>`;
      }
      if (details) {
        text += `<br/>• Précisions : <em>${details}</em>`;
      }
      return text;
    }
    case "website": {
      const wType = data.websiteType as string | undefined;
      const typeLabel =
        wType === "onepage"
          ? "Site One-Page (Présentation fluide et directe)"
          : wType === "multipage"
          ? "Site Multi-Pages (Arborescence complète)"
          : "Refonte / Modernisation d'un site existant";
      return `• Type de site souhaité : <strong>${typeLabel}</strong>`;
    }
    default:
      return "• Demande d'orientation générale. Échange direct recommandé sur WhatsApp.";
  }
}

// Format plain-text version of branch data
function formatBranchDataText(type: string, data: Record<string, unknown> = {}): string {
  const html = formatBranchData(type, data);
  return html.replace(/<br\/>/g, "\n").replace(/<[^>]*>/g, "");
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const payload: WebhookPayload = await req.json();

    // Only process INSERT events if triggered from Supabase Database Webhooks
    if (payload.type && payload.type !== "INSERT") {
      console.log(`[notify-new-demande] Ignored event type: ${payload.type}`);
      return new Response(JSON.stringify({ message: "Ignored non-INSERT event" }), {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Extract the demande row
    const record: DemandeRecord | undefined = payload.record || (payload.id ? (payload as DemandeRecord) : undefined);

    if (!record || !record.full_name || !record.whatsapp_number) {
      console.warn("[notify-new-demande] Incomplete payload received:", payload);
      return new Response(JSON.stringify({ error: "Missing record data in payload" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Configurable environment variables
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const RECIPIENT_EMAIL = Deno.env.get("NOTIFICATION_RECIPIENT_EMAIL") || "wendclasss@gmail.com";
    const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") || "Class S Notifications <onboarding@resend.dev>";
    const SITE_URL = Deno.env.get("SITE_URL") || "https://wendclass.vercel.app";

    if (!RESEND_API_KEY) {
      console.error("[notify-new-demande] RESEND_API_KEY is not configured in Supabase secrets.");
      return new Response(
        JSON.stringify({
          error: "RESEND_API_KEY secret is missing. Email notification skipped.",
        }),
        { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // Prepare human-readable variables
    const projectLabel = getProjectTypeLabel(record.project_type);
    const companyDisplay = record.company_name ? record.company_name.trim() : "Non précisée";
    const cleanPhone = record.whatsapp_number.replace(/[^0-9+]/g, "");
    const waUrl = `https://wa.me/${cleanPhone.replace("+", "")}`;
    const adminDirectUrl = `${SITE_URL}/classs?demande_id=${record.id}&tab=demandes`;

    // Goals formatting
    let goalsDisplay = "Aucun but spécifique sélectionné";
    if (record.goals && record.goals.length > 0) {
      goalsDisplay = record.goals.map((g) => `• ${g}`).join("<br/>");
      if (record.goals_other) {
        goalsDisplay += `<br/>• Autre précision : <em>${record.goals_other}</em>`;
      }
    }

    const branchDisplayHtml = formatBranchData(record.project_type, record.branch_data || {});
    const branchDisplayText = formatBranchDataText(record.project_type, record.branch_data || {});

    // Format date in French time
    const dateFormatted = record.created_at
      ? new Date(record.created_at).toLocaleString("fr-FR", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "Africa/Ouagadougou",
        })
      : new Date().toLocaleString("fr-FR", { timeZone: "Africa/Ouagadougou" });

    // Dynamic subject
    const subject = `Nouvelle demande Class S — ${projectLabel} — ${record.company_name || record.full_name}`;

    // HTML Email Template
    const htmlBody = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0E0F12; color: #F5F3FF; margin: 0; padding: 24px 12px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #181920; border-radius: 16px; border: 1px solid #3B1E7A; overflow: hidden; }
    .header { background: linear-gradient(135deg, #3B1E7A 0%, #7942D6 100%); padding: 28px 24px; text-align: left; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 13px; color: #E9D5FF; }
    .content { padding: 24px; }
    .card-section { background-color: #121319; border-radius: 12px; padding: 18px; margin-bottom: 18px; border: 1px solid rgba(255,255,255,0.06); }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #A78BFA; font-weight: 700; margin: 0 0 10px 0; }
    .highlight-name { font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 4px 0; }
    .highlight-company { font-size: 14px; color: #D8B4FE; margin: 0; }
    .data-row { margin-bottom: 8px; font-size: 13.5px; line-height: 1.5; color: #E2E8F0; }
    .data-label { color: #94A3B8; font-weight: 500; }
    .cta-container { display: flex; gap: 12px; margin-top: 24px; }
    .btn-wa { display: inline-block; background-color: #25D366; color: #000000 !important; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 700; font-size: 13px; text-align: center; }
    .btn-admin { display: inline-block; background-color: #3B1E7A; color: #FFFFFF !important; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 13px; text-align: center; border: 1px solid #7942D6; }
    .footer { text-align: center; padding: 18px; font-size: 11px; color: #64748B; border-top: 1px solid rgba(255,255,255,0.06); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Nouvelle Demande de Projet</h1>
      <p>Reçue le ${dateFormatted} via le site web Class S</p>
    </div>
    
    <div class="content">
      <!-- Contact Info -->
      <div class="card-section">
        <div class="section-title">Prospect & Entreprise</div>
        <div class="highlight-name">${record.full_name}</div>
        <div class="highlight-company">🏢 Entreprise : <strong>${companyDisplay}</strong></div>
        <div style="margin-top: 10px; font-size: 14px;">
          💬 WhatsApp : <strong style="color: #4ADE80;">${record.whatsapp_number}</strong>
        </div>
      </div>

      <!-- Project Details -->
      <div class="card-section">
        <div class="section-title">Projet Sélectionné</div>
        <div class="data-row">
          <span class="data-label">Type de projet :</span>
          <strong style="color: #C084FC;">${projectLabel}</strong>
        </div>
        
        <div style="margin-top: 12px;">
          <span class="data-label" style="display: block; margin-bottom: 6px;">Objectif(s) visé(s) :</span>
          <div style="font-size: 13px; line-height: 1.6; color: #F1F5F9; padding-left: 4px;">
            ${goalsDisplay}
          </div>
        </div>
      </div>

      <!-- Conditional Branch Details -->
      <div class="card-section">
        <div class="section-title">Précisions & Détails du besoin</div>
        <div style="font-size: 13px; line-height: 1.6; color: #F1F5F9;">
          ${branchDisplayHtml}
        </div>
      </div>

      <!-- Actions -->
      <div style="margin-top: 24px; text-align: center;">
        <a href="${waUrl}" class="btn-wa" target="_blank" style="margin-right: 8px; margin-bottom: 8px;">
          📲 Contacter sur WhatsApp (${record.whatsapp_number})
        </a>
        <a href="${adminDirectUrl}" class="btn-admin" target="_blank" style="margin-bottom: 8px;">
          🔒 Ouvrir dans l'Admin Class S
        </a>
      </div>
    </div>

    <div class="footer">
      Class S — Brand & Graphic Designer • Système de notification automatique<br/>
      Identifiant demande : <code>${record.id}</code>
    </div>
  </div>
</body>
</html>
    `;

    // Plain text alternative
    const textBody = `
NOUVELLE DEMANDE DE PROJET — CLASS S
====================================
Date : ${dateFormatted}

PROSPECT :
• Nom : ${record.full_name}
• Entreprise : ${companyDisplay}
• WhatsApp : ${record.whatsapp_number}

PROJET :
• Type : ${projectLabel}
• Objectifs : ${record.goals ? record.goals.join(", ") : "Non spécifiés"}
${record.goals_other ? `• Autre précision : ${record.goals_other}\n` : ""}

DÉTAILS DU BESOIN :
${branchDisplayText}

ACTIONS :
• Lien direct WhatsApp : ${waUrl}
• Fiche dans l'admin Class S : ${adminDirectUrl}
    `.trim();

    // Call Resend API
    console.log(`[notify-new-demande] Sending email to ${RECIPIENT_EMAIL} via Resend...`);
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
      console.error("[notify-new-demande] Resend API error:", resendData);
      // Return 200 with error log so Supabase webhook does not retry indefinitely
      return new Response(
        JSON.stringify({
          success: false,
          error: resendData,
          message: "Email dispatch failed at Resend, logged.",
        }),
        { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    console.log(`[notify-new-demande] Email successfully sent! Resend ID:`, resendData.id);

    return new Response(
      JSON.stringify({
        success: true,
        resend_id: resendData.id,
        recipient: RECIPIENT_EMAIL,
      }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[notify-new-demande] Uncaught exception:", errorMsg);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMsg,
      }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
