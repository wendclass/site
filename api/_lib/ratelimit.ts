import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Simple in-memory fallback if Upstash Redis credentials are not configured
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
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return (
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  );
}

interface RateLimitConfig {
  maxRequests: number;
  windowDuration: `${number} s` | `${number} m` | `${number} h` | `${number} d`;
  windowMs: number;
  prefix: string;
}

export async function checkRateLimit(
  req: any,
  config: RateLimitConfig
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const ip = getClientIp(req);
  const identifier = `${config.prefix}:${ip}`;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // If Upstash Redis credentials are set, use Redis across all serverless instances
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({
        url: redisUrl,
        token: redisToken,
      });

      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.maxRequests, config.windowDuration),
        analytics: true,
        prefix: config.prefix,
      });

      const result = await ratelimit.limit(ip);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (err) {
      console.warn('Upstash rate limit error, falling back to memory store:', err);
    }
  }

  // Fallback to in-memory store
  return inMemoryRateLimit(identifier, config.maxRequests, config.windowMs);
}
