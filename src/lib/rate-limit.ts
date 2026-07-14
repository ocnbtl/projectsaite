type RateEntry = { count: number; resetAt: number };

const entries = new Map<string, RateEntry>();

export function checkRateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const current = entries.get(key);

  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  return { allowed: true, remaining: limit - current.count };
}

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  return checkRateLimit(key, limit, windowMs).allowed;
}
