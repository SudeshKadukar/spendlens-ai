const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(
  key: string,
  maxRequests = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.timestamp >= windowMs) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false };
  }

  record.count++;
  return { allowed: true };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
