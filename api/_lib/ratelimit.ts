// ==============================================================================
// RATE LIMITING ENGINE (UPSTASH REST HTTP + IN-MEMORY FALLBACK)
// ==============================================================================
// Utilise directement l'API HTTP REST native d'Upstash sans dépendance lourde,
// garantissant une compatibilité 100% native avec Vercel Serverless Functions.

const memoryStore = new Map<string, { count: number; expiresAt: number }>();

function inMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.expiresAt < now) {
    memoryStore.set(key, { count: 1, expiresAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0, reset: entry.expiresAt };
  }

  entry.count += 1;
  return { success: true, limit, remaining: limit - entry.count, reset: entry.expiresAt };
}

export function getClientIp(req: any): string {
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

export interface RateLimitConfig {
  maxRequests: number;
  windowDuration?: string;
  windowMs: number;
  prefix: string;
}

export async function checkRateLimit(
  req: any,
  config: RateLimitConfig
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const ip = getClientIp(req);
  const identifier = `rl:${config.prefix}:${ip}`;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Si les identifiants Upstash sont configurés, utiliser l'API REST HTTP native
  if (redisUrl && redisToken) {
    try {
      const windowSeconds = Math.max(1, Math.ceil(config.windowMs / 1000));
      const cleanUrl = redisUrl.replace(/\/+$/, '');

      // Exécution atomique via le pipeline HTTP Upstash (INCR + EXPIRE si premier accès)
      const res = await fetch(`${cleanUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redisToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', identifier],
          ['EXPIRE', identifier, windowSeconds, 'NX'],
        ]),
      });

      if (res.ok) {
        const data = await res.json();
        // data[0] contient le résultat de INCR
        const currentCount = Number(data[0]?.result) || 1;

        if (currentCount > config.maxRequests) {
          return {
            success: false,
            limit: config.maxRequests,
            remaining: 0,
            reset: Date.now() + config.windowMs,
          };
        }

        return {
          success: true,
          limit: config.maxRequests,
          remaining: Math.max(0, config.maxRequests - currentCount),
          reset: Date.now() + config.windowMs,
        };
      }
    } catch (err) {
      console.warn('[RateLimit] Upstash HTTP request failed, fallback to in-memory:', err);
    }
  }

  // 2. Repli automatique en mémoire vive
  return inMemoryRateLimit(identifier, config.maxRequests, config.windowMs);
}
