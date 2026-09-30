'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'

const schema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter.').max(120),
  email: z.email('Format email tidak valid.').max(200),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(200).optional(),
  division: z.string().trim().optional(),
  subject: z.string().trim().min(3, 'Subjek minimal 3 karakter.').max(200),
  message: z.string().trim().min(10, 'Pesan minimal 10 karakter.').max(5000),
  // Honeypot: field tersembunyi yang hanya terisi oleh bot.
  website: z.string().max(0).optional(),
  turnstileToken: z.string().optional(),
})

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Record<string, string>
}

export const submitContactForm = async (
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> => {
  const raw = Object.fromEntries(formData) as Record<string, string>
  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { status: 'error', message: 'Periksa kembali isian Anda.', fieldErrors }
  }

  const data = parsed.data

  // Honeypot terisi → hentikan diam-diam, jangan beri sinyal ke bot.
  if (data.website) return { status: 'success' }

  const headerList = await headers()
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip') ||
    'unknown'
  const userAgent = headerList.get('user-agent') ?? 'unknown'

  const limit = rateLimit({ key: `contact:${ip}`, limit: 5, windowMs: 15 * 60 * 1000 })
  if (!limit.allowed) {
    return {
      status: 'error',
      message: `Terlalu banyak pengiriman. Coba lagi dalam ${Math.ceil(limit.retryAfterSeconds / 60)} menit.`,
    }
  }

  const turnstile = await verifyTurnstile(data.turnstileToken, ip === 'unknown' ? undefined : ip)
  if (!turnstile.ok) {
    return {
      status: 'error',
      message: 'Verifikasi keamanan gagal. Muat ulang halaman dan coba lagi.',
    }
  }

  try {
    const payload = await getPayloadClient()

    const submission = await payload.create({
      collection: 'contact-submissions',
      overrideAccess: true,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        division: data.division ? Number(data.division) : undefined,
        subject: data.subject,
        message: data.message,
        isRead: false,
        ipAddress: ip,
        userAgent,
      },
    })

    const recipient = process.env.EMAIL_TO_CONTACT
    if (recipient) {
      await payload.sendEmail({
        to: recipient,
        replyTo: data.email,
        subject: `[Website] ${data.subject}`,
        text: [
          `Nama      : ${data.name}`,
          `Email     : ${data.email}`,
          `Telepon   : ${data.phone || '-'}`,
          `Perusahaan: ${data.company || '-'}`,
          '',
          data.message,
          '',
          `Lihat di panel admin: ${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/contact-submissions/${submission.id}`,
        ].join('\n'),
      })
    }

    return { status: 'success' }
  } catch (error) {
    console.error('Gagal menyimpan pesan kontak:', error)
    return {
      status: 'error',
      message: 'Terjadi kendala saat mengirim. Silakan coba lagi atau hubungi kami via WhatsApp.',
    }
  }
}
