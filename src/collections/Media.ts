import { APIError, type CollectionConfig } from 'payload'
import { anyone, contentEditor, superAdminOnly } from '@/access'
import { ALLOWED_DOC_MIME, ALLOWED_IMAGE_MIME, IMAGE_SIZES, UPLOAD_LIMITS } from '@/lib/constants'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: {
    group: 'Sistem',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize'],
    description: 'Pustaka gambar dan dokumen yang dipakai di seluruh situs.',
  },
  access: {
    read: anyone,
    create: contentEditor,
    update: contentEditor,
    delete: superAdminOnly,
  },
  upload: {
    staticDir: process.env.PAYLOAD_MEDIA_DIR || 'media',
    mimeTypes: [...ALLOWED_IMAGE_MIME, ...ALLOWED_DOC_MIME],
    focalPoint: true,
    crop: true,
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: IMAGE_SIZES.thumbnail,
        height: undefined,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      {
        name: 'card',
        width: IMAGE_SIZES.card,
        height: undefined,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'hero',
        width: IMAGE_SIZES.hero,
        height: undefined,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Teks Alternatif (alt)',
      localized: true,
      required: true,
      admin: {
        description:
          'Deskripsi singkat isi gambar. Wajib diisi — dibaca pembaca layar dan dipakai mesin pencari.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Keterangan Gambar',
      localized: true,
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Kredit Foto',
      admin: { description: 'Nama fotografer atau sumber gambar, bila perlu dicantumkan.' },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        const size = req.file?.size
        if (typeof size === 'number' && size > UPLOAD_LIMITS.image) {
          const limitMb = Math.round(UPLOAD_LIMITS.image / (1024 * 1024))
          throw new APIError(`Ukuran berkas melebihi batas ${limitMb} MB.`, 400)
        }
        return data
      },
    ],
  },
}
