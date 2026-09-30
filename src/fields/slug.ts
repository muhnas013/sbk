import type { Field } from 'payload'
import { formatSlug } from '@/hooks/formatSlug'

type SlugFieldOptions = {
  /** Field yang dipakai sebagai sumber slug otomatis. Default: `title`. */
  from?: string
}

/**
 * Field slug standar. Sengaja TIDAK di-localize: satu URL untuk semua bahasa
 * agar tautan yang sudah tersebar tidak berubah saat bahasa diganti.
 */
export const slugField = ({ from = 'title' }: SlugFieldOptions = {}): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Slug (URL)',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      'Dikosongkan = dibuat otomatis dari judul. Hindari mengubah slug yang sudah terbit.',
  },
  hooks: {
    beforeValidate: [formatSlug(from)],
  },
})
