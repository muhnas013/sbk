import type { CollectionSlug, GlobalSlug } from 'payload'

/** Prefix path publik untuk tiap koleksi yang punya halaman sendiri. */
const COLLECTION_PATHS: Partial<Record<CollectionSlug, string>> = {
  projects: 'proyek',
  services: 'layanan',
  divisions: 'divisi',
  posts: 'berita',
  jobs: 'karier',
  pages: '',
}

/** Path publik untuk global yang punya halaman sendiri. */
const GLOBAL_PATHS: Partial<Record<GlobalSlug, string>> = {
  homepage: '',
  about: 'tentang-kami',
}

const previewUrl = (path: string, locale: string) =>
  `/next/preview?path=${encodeURIComponent(path)}&locale=${encodeURIComponent(locale)}`

/** URL Live Preview untuk dokumen koleksi. */
export const collectionPreviewUrl = (
  data: Record<string, unknown>,
  collectionSlug: string,
  locale: string,
): string => {
  const prefix = COLLECTION_PATHS[collectionSlug as CollectionSlug]
  const slug = typeof data?.slug === 'string' ? data.slug : ''
  if (prefix === undefined || !slug) return previewUrl('/', locale)
  return previewUrl(prefix ? `/${prefix}/${slug}` : `/${slug}`, locale)
}

/** URL Live Preview untuk global. */
export const globalPreviewUrl = (globalSlug: string, locale: string): string => {
  const path = GLOBAL_PATHS[globalSlug as GlobalSlug]
  if (path === undefined) return previewUrl('/', locale)
  return previewUrl(path ? `/${path}` : '/', locale)
}

/** Ukuran layar yang tersedia di panel pratinjau. */
export const PREVIEW_BREAKPOINTS = [
  { label: 'Ponsel', name: 'mobile', width: 390, height: 844 },
  { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
  { label: 'Laptop', name: 'laptop', width: 1440, height: 900 },
] as const
