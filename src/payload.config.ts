import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from '@payloadcms/translations/languages/en'
import { id } from '@payloadcms/translations/languages/id'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { adminOnly } from '@/access'
import { ActivityLogs } from '@/collections/ActivityLogs'
import { Certifications } from '@/collections/Certifications'
import { Clients } from '@/collections/Clients'
import { ContactSubmissions } from '@/collections/ContactSubmissions'
import { Divisions } from '@/collections/Divisions'
import { Documents } from '@/collections/Documents'
import { JobApplications } from '@/collections/JobApplications'
import { Jobs } from '@/collections/Jobs'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { PostCategories } from '@/collections/PostCategories'
import { Posts } from '@/collections/Posts'
import { ProjectCategories } from '@/collections/ProjectCategories'
import { Projects } from '@/collections/Projects'
import { Services } from '@/collections/Services'
import { Team } from '@/collections/Team'
import { Testimonials } from '@/collections/Testimonials'
import { Users } from '@/collections/Users'
import { About } from '@/globals/About'
import { Homepage } from '@/globals/Homepage'
import { Navigation } from '@/globals/Navigation'
import { SeoDefaults } from '@/globals/SeoDefaults'
import { SiteSettings } from '@/globals/SiteSettings'
import { withAuditLog } from '@/lib/audit'
import { emailAdapter } from '@/lib/email'
import { DEFAULT_LOCALE } from '@/lib/constants'
import { collectionPreviewUrl, globalPreviewUrl, PREVIEW_BREAKPOINTS } from '@/lib/preview'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** Koleksi yang punya halaman publik sendiri, sehingga perlu field SEO. */
const seoCollections = ['pages', 'posts', 'projects', 'services', 'divisions', 'jobs'] as const

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  admin: {
    user: Users.slug,
    components: {
      beforeDashboard: ['@/components/admin/DashboardStats#DashboardStats'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Admin Sabhumi Karya Barito',
      description: 'Panel administrasi website PT Sabhumi Karya Barito',
    },
    dateFormat: 'd MMMM yyyy',
    livePreview: {
      breakpoints: [...PREVIEW_BREAKPOINTS],
      collections: ['pages', 'posts', 'projects', 'services', 'divisions', 'jobs'],
      globals: ['homepage', 'about'],
      url: ({ data, collectionConfig, globalConfig, locale }) =>
        collectionConfig
          ? collectionPreviewUrl(
              data as Record<string, unknown>,
              collectionConfig.slug,
              locale?.code ?? DEFAULT_LOCALE,
            )
          : globalPreviewUrl(globalConfig?.slug ?? '', locale?.code ?? DEFAULT_LOCALE),
    },
  },

  // Bahasa panel admin (bukan bahasa konten). Bawaan Bahasa Indonesia,
  // Inggris tetap tersedia agar pengguna dapat menggantinya per akun.
  i18n: {
    supportedLanguages: { id, en },
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

  // Setiap koleksi dibungkus pencatat aktivitas, kecuali yang dikecualikan
  // di `withAuditLog` (log itu sendiri, media, dan data masuk dari publik).
  collections: [
    // Profil perusahaan
    Divisions,
    Services,
    Team,
    Clients,
    Testimonials,
    Certifications,
    // Proyek
    Projects,
    ProjectCategories,
    // Berita
    Posts,
    PostCategories,
    // Karier
    Jobs,
    JobApplications,
    // Konten lain
    Pages,
    Documents,
    ContactSubmissions,
    // Sistem
    Media,
    Users,
    ActivityLogs,
  ].map(withAuditLog),

  globals: [Homepage, About, SiteSettings, Navigation, SeoDefaults],

  editor: lexicalEditor(),

  email: emailAdapter,

  plugins: [
    seoPlugin({
      collections: [...seoCollections],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => (doc?.title as string) ?? (doc?.name as string) ?? '',
      generateDescription: ({ doc }) => (doc?.summary as string) ?? (doc?.excerpt as string) ?? '',
    }),
    redirectsPlugin({
      collections: [...seoCollections],
      overrides: {
        admin: {
          group: 'Pengaturan',
          description:
            'Arahkan URL lama ke URL baru (HTTP 301) agar tautan yang sudah tersebar tidak mati.',
        },
        access: { update: adminOnly, create: adminOnly, delete: adminOnly },
      },
    }),
  ],

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
