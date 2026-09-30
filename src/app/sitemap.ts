import type { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/constants'
import { findPublished } from '@/lib/payload'
import type { Division, Job, Page, Post, Project, Service } from '@/payload-types'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** Rute tetap yang selalu ada, ditulis tanpa prefix bahasa. */
const STATIC_PATHS = [
  { path: '', priority: 1 },
  { path: 'tentang-kami', priority: 0.8 },
  { path: 'layanan', priority: 0.8 },
  { path: 'proyek', priority: 0.9 },
  { path: 'legalitas', priority: 0.7 },
  { path: 'klien', priority: 0.6 },
  { path: 'berita', priority: 0.7 },
  { path: 'karier', priority: 0.6 },
  { path: 'unduhan', priority: 0.5 },
  { path: 'kontak', priority: 0.8 },
]

const entry = (
  path: string,
  priority: number,
  lastModified?: string,
): MetadataRoute.Sitemap[number][] =>
  LOCALES.map((locale) => ({
    url: `${serverUrl}/${locale}${path ? `/${path}` : ''}`,
    lastModified: lastModified ? new Date(lastModified) : undefined,
    changeFrequency: 'weekly' as const,
    priority,
    // Setiap URL menyertakan padanan bahasanya agar Google memasangkan
    // versi ID dan EN, bukan menganggapnya konten ganda.
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((code) => [code, `${serverUrl}/${code}${path ? `/${path}` : ''}`]),
      ),
    },
  }))

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const locale = 'id' as const
  const [projects, services, divisions, posts, jobs, pages] = await Promise.all([
    findPublished<Project>('projects', { locale, limit: 1000, depth: 0 }),
    findPublished<Service>('services', { locale, limit: 500, depth: 0 }),
    findPublished<Division>('divisions', { locale, limit: 100, depth: 0 }),
    findPublished<Post>('posts', { locale, limit: 1000, depth: 0 }),
    findPublished<Job>('jobs', { locale, limit: 200, depth: 0 }),
    findPublished<Page>('pages', { locale, limit: 200, depth: 0 }),
  ])

  return [
    ...STATIC_PATHS.flatMap((item) => entry(item.path, item.priority)),
    ...projects.docs.flatMap((doc) => entry(`proyek/${doc.slug}`, 0.7, doc.updatedAt)),
    ...services.docs.flatMap((doc) => entry(`layanan/${doc.slug}`, 0.6, doc.updatedAt)),
    ...divisions.docs.flatMap((doc) => entry(`divisi/${doc.slug}`, 0.7, doc.updatedAt)),
    ...posts.docs.flatMap((doc) => entry(`berita/${doc.slug}`, 0.5, doc.updatedAt)),
    ...jobs.docs.flatMap((doc) => entry(`karier/${doc.slug}`, 0.5, doc.updatedAt)),
    ...pages.docs.flatMap((doc) => entry(String(doc.slug), 0.4, doc.updatedAt)),
  ]
}

export default sitemap
