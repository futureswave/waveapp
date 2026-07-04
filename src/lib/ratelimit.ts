import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiting is optional: if Upstash env vars are absent (e.g. local dev),
// limiting is disabled rather than erroring.
let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  if (limiter) return limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    prefix: "wave:gen",
  });
  return limiter;
}

/** Returns true if the request is allowed, false if rate-limited. */
export async function checkRateLimit(key: string): Promise<boolean> {
  const rl = getLimiter();
  if (!rl) return true;
  const { success } = await rl.limit(key);
  return success;
}
