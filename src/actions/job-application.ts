'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { ALLOWED_CV_MIME, UPLOAD_LIMITS } from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rate-limit'
import { isPast } from '@/lib/time'
import { verifyTurnstile } from '@/lib/turnstile'

const schema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter.').max(120),
  email: z.email('Format email tidak valid.').max(200),
  phone: z.string().trim().min(6, 'Nomor telepon tidak valid.').max(40),
  jobId: z.coerce.number().int().positive(),
  coverLetter: z.string().trim().max(5000).optional(),
  consent: z.literal('on', { message: 'Persetujuan pemrosesan data pribadi wajib dicentang.' }),
  website: z.string().max(0).optional(),
  turnstileToken: z.string().optional(),
})

export type ApplicationState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Record<string, string>
}

export const submitJobApplication = async (
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> => {
  const cv = formData.get('cv')
  const raw = Object.fromEntries([...formData.entries()].filter(([key]) => key !== 'cv')) as Record<
    string,
    string
  >

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
  if (data.website) return { status: 'success' }

  if (!(cv instanceof File) || cv.size === 0) {
    return { status: 'error', fieldErrors: { cv: 'Berkas CV wajib diunggah.' } }
  }
  if (cv.size > UPLOAD_LIMITS.cv) {
    const limitMb = Math.round(UPLOAD_LIMITS.cv / (1024 * 1024))
    return { status: 'error', fieldErrors: { cv: `Ukuran CV melebihi batas ${limitMb} MB.` } }
  }
  if (!ALLOWED_CV_MIME.includes(cv.type)) {
    return { status: 'error', fieldErrors: { cv: 'Format CV harus PDF atau Word (.doc/.docx).' } }
  }

  const headerList = await headers()
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip') ||
    'unknown'

  const limit = rateLimit({ key: `apply:${ip}`, limit: 3, windowMs: 60 * 60 * 1000 })
  if (!limit.allowed) {
    return {
      status: 'error',
      message: `Terlalu banyak lamaran dikirim. Coba lagi dalam ${Math.ceil(limit.retryAfterSeconds / 60)} menit.`,
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

    const job = await payload.findByID({
      collection: 'jobs',
      id: data.jobId,
      depth: 0,
      overrideAccess: false,
    })

    // Lowongan yang sudah ditutup atau lewat tenggat tidak menerima lamaran baru.
    const closed = job.vacancyStatus === 'closed' || isPast(job.closingDate)
    if (closed) {
      return { status: 'error', message: 'Lowongan ini sudah ditutup.' }
    }

    const application = await payload.create({
      collection: 'job-applications',
      overrideAccess: true,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        job: data.jobId,
        coverLetter: data.coverLetter,
        consent: true,
        status: 'new',
      },
      file: {
        data: Buffer.from(await cv.arrayBuffer()),
        mimetype: cv.type,
        name: cv.name,
        size: cv.size,
      },
    })

    const recipient = process.env.EMAIL_TO_HR
    if (recipient) {
      await payload.sendEmail({
        to: recipient,
        replyTo: data.email,
        subject: `[Lamaran] ${job.title} — ${data.name}`,
        text: [
          `Posisi : ${job.title}`,
          `Nama   : ${data.name}`,
          `Email  : ${data.email}`,
          `Telepon: ${data.phone}`,
          '',
          data.coverLetter || '(tanpa surat lamaran)',
          '',
          `Lihat di panel admin: ${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/job-applications/${application.id}`,
        ].join('\n'),
      })
    }

    return { status: 'success' }
  } catch (error) {
    console.error('Gagal menyimpan lamaran:', error)
    return {
      status: 'error',
      message: 'Terjadi kendala saat mengirim lamaran. Silakan coba lagi.',
    }
  }
}
