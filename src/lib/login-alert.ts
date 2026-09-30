import { createHash } from 'crypto'
import type { PayloadRequest } from 'payload'

/**
 * Notifikasi email saat login dari perangkat atau jaringan baru.
 *
 * Yang disimpan hanyalah sidik jari (hash) dari kombinasi IP dan user agent,
 * bukan nilai aslinya — cukup untuk mengenali "perangkat yang sama seperti
 * sebelumnya" tanpa menyimpan jejak lokasi pengguna.
 */
export const fingerprintOf = (ip: string, userAgent: string): string =>
  createHash('sha256').update(`${ip}|${userAgent}`).digest('hex').slice(0, 32)

/** Ringkasan perangkat untuk isi email, tanpa membeberkan user agent penuh. */
const describeDevice = (userAgent: string): string => {
  const os = /Windows/i.test(userAgent)
    ? 'Windows'
    : /Macintosh|Mac OS/i.test(userAgent)
      ? 'macOS'
      : /Android/i.test(userAgent)
        ? 'Android'
        : /iPhone|iPad/i.test(userAgent)
          ? 'iOS'
          : /Linux/i.test(userAgent)
            ? 'Linux'
            : 'tidak dikenali'

  const browser = /Edg\//i.test(userAgent)
    ? 'Edge'
    : /Chrome\//i.test(userAgent)
      ? 'Chrome'
      : /Firefox\//i.test(userAgent)
        ? 'Firefox'
        : /Safari\//i.test(userAgent)
          ? 'Safari'
          : 'peramban lain'

  return `${browser} di ${os}`
}

export const sendNewDeviceAlert = async ({
  req,
  email,
  name,
  ip,
  userAgent,
}: {
  req: PayloadRequest
  email: string
  name: string
  ip: string
  userAgent: string
}): Promise<void> => {
  const when = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Makassar',
  }).format(new Date())

  await req.payload.sendEmail({
    to: email,
    subject: 'Login baru ke panel admin Sabhumi Karya Barito',
    text: [
      `Halo ${name},`,
      '',
      'Akun Anda baru saja dipakai untuk masuk ke panel admin dari perangkat yang belum pernah tercatat sebelumnya.',
      '',
      `Waktu     : ${when} WITA`,
      `Perangkat : ${describeDevice(userAgent)}`,
      `Alamat IP : ${ip}`,
      '',
      'Bila ini memang Anda, abaikan email ini.',
      'Bila bukan, segera ganti kata sandi Anda dan hubungi Super Admin.',
      '',
      `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/account`,
    ].join('\n'),
  })
}
