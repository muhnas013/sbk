/** Locale yang didukung situs. `id` adalah default dan fallback. */
export const LOCALES = ['id', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'id'

export const LOCALE_LABELS: Record<Locale, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
}

export const LOCALE_SHORT: Record<Locale, string> = {
  id: 'ID',
  en: 'EN',
}

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value)

/** Ukuran turunan gambar — dipakai Payload (sharp) dan `next/image`. */
export const IMAGE_SIZES = {
  thumbnail: 400,
  card: 768,
  hero: 1920,
} as const

/** Batas unggahan. */
export const UPLOAD_LIMITS = {
  image: 8 * 1024 * 1024, // 8 MB
  document: 10 * 1024 * 1024, // 10 MB
  cv: 5 * 1024 * 1024, // 5 MB
} as const

export const ALLOWED_IMAGE_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
]
export const ALLOWED_DOC_MIME = ['application/pdf']
export const ALLOWED_CV_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
