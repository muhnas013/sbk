import type { Field } from 'payload'

/**
 * Daftar poin sederhana (mis. lingkup pekerjaan, kualifikasi, benefit).
 * Dipakai berulang agar bentuk datanya konsisten antar koleksi.
 */
export const bulletListField = ({
  name,
  label,
  itemLabel = 'Poin',
  localized = true,
}: {
  name: string
  label: string
  itemLabel?: string
  localized?: boolean
}): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: itemLabel, plural: label },
  localized,
  fields: [
    {
      name: 'text',
      type: 'text',
      label: itemLabel,
      required: true,
    },
  ],
})

/** Daftar langkah bernomor dengan judul + penjelasan (mis. alur kerja layanan). */
export const stepListField = ({ name, label }: { name: string; label: string }): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: 'Tahap', plural: label },
  localized: true,
  fields: [
    { name: 'title', type: 'text', label: 'Judul Tahap', required: true },
    { name: 'description', type: 'textarea', label: 'Penjelasan' },
  ],
})

/** Daftar tanya-jawab. */
export const faqField: Field = {
  name: 'faq',
  type: 'array',
  label: 'Tanya Jawab',
  labels: { singular: 'Pertanyaan', plural: 'Tanya Jawab' },
  localized: true,
  fields: [
    { name: 'question', type: 'text', label: 'Pertanyaan', required: true },
    { name: 'answer', type: 'textarea', label: 'Jawaban', required: true },
  ],
}
