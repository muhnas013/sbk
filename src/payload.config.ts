import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from '@/collections/Media'
import { Users } from '@/collections/Users'
import { DEFAULT_LOCALE } from '@/lib/constants'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Admin Sabhumi Karya Barito',
      description: 'Panel administrasi website PT Sabhumi Karya Barito',
    },
    dateFormat: 'd MMMM yyyy',
  },

  // Bahasa panel admin (bukan bahasa konten).
  i18n: {
    fallbackLanguage: 'id',
  },

  // Bahasa konten. `en` kosong otomatis jatuh ke `id` supaya situs tidak
  // menampilkan bagian kosong selama penerjemahan belum selesai.
  localization: {
    locales: [
      { label: 'Bahasa Indonesia', code: 'id' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },

  collections: [Users, Media],

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: process.env.NODE_ENV !== 'production',
  }),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    disablePlaygroundInProduction: true,
  },

  sharp,

  upload: {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB — batas per-koleksi diatur lebih ketat di hook
    },
  },

  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],

  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
})
