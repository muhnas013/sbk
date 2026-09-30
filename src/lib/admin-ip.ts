/**
 * Pembatasan akses panel admin berdasarkan alamat IP.
 *
 * Dipakai sebagai lapisan tambahan di atas autentikasi, bukan penggantinya:
 * kredensial yang bocor tetap tidak berguna dari luar jaringan kantor.
 * Bila `ADMIN_IP_ALLOWLIST` kosong, pembatasan tidak aktif.
 */

const parseList = (value: string | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

/** Cocokkan IP dengan satu entri daftar: alamat persis atau CIDR IPv4. */
const matches = (ip: string, entry: string): boolean => {
  if (!entry.includes('/')) return ip === entry

  const [network, bitsRaw] = entry.split('/')
  const bits = Number(bitsRaw)
  if (!network || !Number.isInteger(bits) || bits < 0 || bits > 32) return false

  const toInt = (value: string): number | null => {
    const parts = value.split('.')
    if (parts.length !== 4) return null
    let result = 0
    for (const part of parts) {
      const octet = Number(part)
      if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null
      result = (result << 8) | octet
    }
    return result >>> 0
  }

  const ipInt = toInt(ip)
  const networkInt = toInt(network)
  if (ipInt === null || networkInt === null) return false

  // Mask /0 berarti seluruh ruang alamat; pergeseran 32 bit tidak terdefinisi di JS.
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0
  return (ipInt & mask) === (networkInt & mask)
}

/** Apakah IP ini boleh mengakses panel admin? */
export const isAdminIpAllowed = (ip: string | null): boolean => {
  const allowlist = parseList(process.env.ADMIN_IP_ALLOWLIST)
  if (allowlist.length === 0) return true
  if (!ip) return false

  // Normalkan bentuk IPv4-mapped IPv6 (::ffff:1.2.3.4) agar cocok dengan daftar.
  const normalized = ip.startsWith('::ffff:') ? ip.slice(7) : ip
  return allowlist.some((entry) => matches(normalized, entry))
}

/** Ambil IP klien dari header yang dipasang reverse proxy. */
export const clientIpFrom = (headers: Headers): string | null =>
  headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || null
