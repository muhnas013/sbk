/**
 * Rate limiter sederhana berbasis memori untuk endpoint form.
 *
 * Cukup untuk satu instance aplikasi seperti deployment saat ini. Bila nanti
 * aplikasi dijalankan lebih dari satu replika, pindahkan ke Redis agar
 * hitungannya konsisten antar-instance.
 */
type Entry = { count: number; resetAt: number }

const buckets = new Map<string, Entry>()

export const rateLimit = ({
  key,
  limit,
  windowMs,
}: {
  key: string
  limit: number
  windowMs: number
}): { allowed: boolean; retryAfterSeconds: number } => {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  entry.count += 1
  if (entry.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) }
  }

  return { allowed: true, retryAfterSeconds: 0 }
}

// Bersihkan entri kedaluwarsa secara berkala agar map tidak tumbuh tanpa batas.
if (typeof setInterval === 'function') {
  const timer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of buckets) {
      if (now > entry.resetAt) buckets.delete(key)
    }
  }, 60_000)
  timer.unref?.()
}
