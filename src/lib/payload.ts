import { cache } from 'react'
import { draftMode } from 'next/headers'
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

/**
 * Apakah permintaan ini berjalan dalam mode pratinjau admin?
 * `draftMode()` melempar bila dipanggil di konteks yang tidak mendukungnya
 * (mis. saat generateStaticParams), jadi kegagalannya diartikan "bukan draft".
 */
const isDraftRequest = async (): Promise<boolean> => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

/** Hanya dokumen terbit yang boleh tampil di situs publik. */
const publishedOnly = (where?: Where): Where => ({
  and: [{ _status: { equals: 'published' } }, ...(where ? [where] : [])],
})

/** Dalam pratinjau, draft ikut ditampilkan; di luar itu hanya yang terbit. */
const statusFilter = async (where?: Where): Promise<Where | undefined> =>
  (await isDraftRequest()) ? where : publishedOnly(where)

export const findPublished = async <T = unknown>(
  collection: 'projects' | 'services' | 'divisions' | 'posts' | 'jobs' | 'pages',
  { locale, limit = 12, page = 1, sort, where, depth = 1 }: FindArgs,
) => {
  const payload = await getPayloadClient()
  const draft = await isDraftRequest()
  return payload.find({
    collection,
    locale,
    fallbackLocale: 'id',
    limit,
    page,
    sort,
    depth,
    draft,
    where: await statusFilter(where),
    overrideAccess: draft,
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
  const draft = await isDraftRequest()
  const result = await payload.find({
    collection,
    locale,
    fallbackLocale: 'id',
    limit: 1,
    depth,
    draft,
    where: await statusFilter({ slug: { equals: slug } }),
    overrideAccess: draft,
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
  const draft = await isDraftRequest()
  return payload.findGlobal({
    slug,
    locale,
    fallbackLocale: 'id',
    depth,
    draft,
  }) as Promise<T>
}
