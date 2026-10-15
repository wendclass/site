// Allowed project types
const ALLOWED_PROJECT_TYPES = ['logo', 'social', 'print', 'event', 'website', 'unknown'];

// In-memory fallback if Upstash Redis credentials are not configured
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

function inMemoryRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.expiresAt < now) {
    memoryStore.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count += 1;
  return true;
}

function getClientIp(req: any): string {
  const forwarded = req.headers ? req.headers['x-forwarded-for'] : null;
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return (
    (req.headers && req.headers['x-real-ip']) ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  );
}

async function checkContactRateLimit(ip: string): Promise<boolean> {
  const maxRequests = 5;
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const identifier = `rl:contact:${ip}`;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const cleanUrl = redisUrl.replace(/\/+$/, '');
      const res = await fetch(`${cleanUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redisToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', identifier],
          ['EXPIRE', identifier, 600, 'NX'],
        ]),
      });

      if (res.ok) {
        const data = await res.json();
        const currentCount = Number(data[0]?.result) || 1;
        return currentCount <= maxRequests;
      }
    } catch (err) {
      console.warn('[RateLimit] Upstash HTTP failed, fallback to memory:', err);
    }
  }

  return inMemoryRateLimit(identifier, maxRequests, windowMs);
}

export default async function handler(req: any, res: any) {
  // 1. Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const ip = getClientIp(req);

    // 2. Rate limiting (5 submissions per 10 minutes per IP)
    const isAllowed = await checkContactRateLimit(ip);

    if (!isAllowed) {
      return res.status(429).json({
        success: false,
        error: 'Trop de requêtes envoyées depuis cette connexion. Veuillez patienter 10 minutes avant de réessayer.',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // 3. Honeypot check: If the hidden honeypot field is filled, silently ignore
    const honeypot = body.company_website_hp || body.website_hp || body._honey;
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn(`[Security] Honeypot triggered from IP ${ip}. Silent rejection.`);
      // Pretend success so bot doesn't know it was blocked
      return res.status(200).json({ success: true, message: 'Demande envoyée avec succès.' });
    }

    // 4. Cloudflare Turnstile token validation
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const turnstileToken = body.turnstile_token;

    if (turnstileSecret) {
      if (!turnstileToken) {
        return res.status(400).json({
          success: false,
          error: 'Vérification de sécurité anti-robot manquante. Veuillez cocher la vérification.',
        });
      }

      try {
        const formData = new URLSearchParams();
        formData.append('secret', turnstileSecret);
        formData.append('response', turnstileToken);
        formData.append('remoteip', ip);

        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });

        const verifyData: any = await verifyRes.json();
        if (!verifyData.success) {
          console.warn(`[Security] Turnstile verification failed for IP ${ip}:`, verifyData['error-codes']);
          return res.status(400).json({
            success: false,
            error: 'La vérification anti-robot a échoué. Veuillez rafraîchir la page et réessayer.',
          });
        }
      } catch (turnstileErr) {
        console.error('[Security] Turnstile API request error:', turnstileErr);
        // Fail closed if Turnstile API call fails
        return res.status(502).json({
          success: false,
          error: 'Erreur lors de la vérification de sécurité. Veuillez réessayer dans un instant.',
        });
      }
    }

    // 5. Validation and Sanitization of input fields
    const rawFullName = body.full_name;
    const rawCompanyName = body.company_name;
    const rawWhatsapp = body.whatsapp_number;
    const rawProjectType = body.project_type;
    const rawGoals = body.goals;
    const rawGoalsOther = body.goals_other;
    const rawBranchData = body.branch_data;

    // Full name: 2 - 100 characters
    if (typeof rawFullName !== 'string' || rawFullName.trim().length < 2 || rawFullName.trim().length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Le nom est obligatoire et doit comporter entre 2 et 100 caractères.',
      });
    }

    // Company name: 1 - 120 characters
    if (typeof rawCompanyName !== 'string' || rawCompanyName.trim().length < 1 || rawCompanyName.trim().length > 120) {
      return res.status(400).json({
        success: false,
        error: 'Le nom de l\'entreprise est obligatoire et ne doit pas dépasser 120 caractères.',
      });
    }

    // WhatsApp: 6 - 30 characters
    if (typeof rawWhatsapp !== 'string' || rawWhatsapp.trim().length < 6 || rawWhatsapp.trim().length > 30) {
      return res.status(400).json({
        success: false,
        error: 'Le numéro WhatsApp est obligatoire et doit être valide.',
      });
    }

    // Project type: must be within allowed options
    const projectType = ALLOWED_PROJECT_TYPES.includes(rawProjectType) ? rawProjectType : 'unknown';

    // Goals: array of strings, max 15 goals, max 50 chars each
    const goals: string[] = Array.isArray(rawGoals)
      ? rawGoals
          .filter((g: any) => typeof g === 'string')
          .map((g: string) => g.trim().slice(0, 50))
          .slice(0, 15)
      : [];

    const goalsOther =
      typeof rawGoalsOther === 'string' && rawGoalsOther.trim().length > 0
        ? rawGoalsOther.trim().slice(0, 300)
        : null;

    // Branch data: clean object
    const branchData: Record<string, any> = {};
    if (rawBranchData && typeof rawBranchData === 'object' && !Array.isArray(rawBranchData)) {
      for (const [key, value] of Object.entries(rawBranchData)) {
        if (typeof key === 'string' && key.length < 50) {
          if (typeof value === 'string') {
            branchData[key] = value.trim().slice(0, 500);
          } else if (typeof value === 'boolean' || typeof value === 'number') {
            branchData[key] = value;
          } else if (Array.isArray(value)) {
            branchData[key] = value
              .filter((item) => typeof item === 'string')
              .map((item) => item.trim().slice(0, 100))
              .slice(0, 20);
          }
        }
      }
    }

    // 6. Insertion into Supabase
    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      'https://mtinydrkpxffrlsuwpzh.supabase.co';

    // Prefer secret service_role key to bypass RLS; fallback to anon key during transition
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      '';

    if (!supabaseKey) {
      console.error('[Contact] Missing Supabase API key.');
      return res.status(500).json({
        success: false,
        error: 'Erreur interne de configuration serveur.',
      });
    }

    const payload = {
      project_type: projectType,
      goals,
      goals_other: goalsOther,
      branch_data: branchData,
      full_name: rawFullName.trim(),
      company_name: rawCompanyName.trim(),
      whatsapp_number: rawWhatsapp.trim(),
      status: 'nouveau',
      internal_notes: '',
    };

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/demandes`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    if (!insertResponse.ok) {
      const errText = await insertResponse.text();
      console.error('[Contact] Supabase insertion error:', insertResponse.status, errText);
      return res.status(500).json({
        success: false,
        error: 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.',
      });
    }

    const insertedData: any = await insertResponse.json();
    const insertedId = Array.isArray(insertedData) && insertedData[0]?.id ? insertedData[0].id : undefined;

    return res.status(200).json({
      success: true,
      message: 'Demande enregistrée avec succès.',
      id: insertedId,
    });
  } catch (err: any) {
    console.error('[Contact] Handler exception:', err);
    return res.status(500).json({
      success: false,
      error: 'Une erreur imprévue est survenue. Veuillez réessayer plus tard.',
    });
  }
}
