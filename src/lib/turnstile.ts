/**
 * Verifikasi token Cloudflare Turnstile.
 *
 * Bila `TURNSTILE_SECRET_KEY` belum diisi, verifikasi dilewati agar
 * pengembangan lokal tetap berjalan. Di produksi kunci ini wajib diisi —
 * tanpa itu form kehilangan proteksi bot.
 */
export const verifyTurnstile = async (token: string | undefined, ip?: string) => {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return { ok: true, skipped: true as const }

  if (!token) return { ok: false, skipped: false as const }

  try {
    const body = new FormData()
    body.append('secret', secret)
    body.append('response', token)
    if (ip) body.append('remoteip', ip)

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const result = (await response.json()) as { success: boolean }
    return { ok: result.success === true, skipped: false as const }
  } catch {
    return { ok: false, skipped: false as const }
  }
}
