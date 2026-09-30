import { cache } from 'react'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import type { Locale } from '@/lib/constants'

/**
 * Instance Payload dipakai bersama antar-request dalam satu proses.
 * `getPayload` sendiri sudah memoize, `cache` menambah dedup per-request React.
 */
export const getPayloadClient = cache(async () => getPayload({ config }))

type FindArgs = {
  locale: Locale
  limit?: number
  page?: number
  sort?: string
  where?: Where
  depth?: number
}

/** Hanya dokumen terbit yang boleh tampil di situs publik. */
const publishedOnly = (where?: Where): Where => ({
  and: [{ _status: { equals: 'published' } }, ...(where ? [where] : [])],
})

export const findPublished = async <T = unknown>(
  collection: 'projects' | 'services' | 'divisions' | 'posts' | 'jobs' | 'pages',
  { locale, limit = 12, page = 1, sort, where, depth = 1 }: FindArgs,
) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection,
    locale,
    fallbackLocale: 'id',
    limit,
    page,
    sort,
    depth,
    where: publishedOnly(where),
    overrideAccess: false,
  }) as unknown as Promise<{
    docs: T[]
    totalDocs: number
    totalPages: number
    page: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }>
}

export const findPublishedBySlug = async <T = unknown>(
  collection: 'projects' | 'services' | 'divisions' | 'posts' | 'jobs' | 'pages',
  slug: string,
  locale: Locale,
  depth = 2,
): Promise<T | null> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    locale,
    fallbackLocale: 'id',
    limit: 1,
    depth,
    where: publishedOnly({ slug: { equals: slug } }),
    overrideAccess: false,
  })
  return (result.docs[0] as T) ?? null
}

/** Koleksi tanpa fitur draft — seluruh isinya memang publik. */
export const findAll = async <T = unknown>(
  collection:
    | 'team'
    | 'clients'
    | 'testimonials'
    | 'certifications'
    | 'documents'
    | 'project-categories'
    | 'post-categories',
  { locale, limit = 100, sort, where, depth = 1 }: FindArgs,
) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    locale,
    fallbackLocale: 'id',
    limit,
    sort,
    depth,
    where,
    overrideAccess: false,
  })
  return result.docs as T[]
}

export const getGlobal = async <T = unknown>(
  slug: 'site-settings' | 'navigation' | 'homepage' | 'seo-defaults' | 'about',
  locale: Locale,
  depth = 1,
): Promise<T> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug,
    locale,
    fallbackLocale: 'id',
    depth,
  }) as Promise<T>
}
