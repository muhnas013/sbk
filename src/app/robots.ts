import type { MetadataRoute } from 'next'
import { getGlobal } from '@/lib/payload'
import type { SeoDefault } from '@/payload-types'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const robots = async (): Promise<MetadataRoute.Robots> => {
  const defaults = await getGlobal<SeoDefault>('seo-defaults', 'id', 0)

  // Sakelar `noIndex` dipakai untuk menutup lingkungan staging dari mesin pencari.
  if (defaults.noIndex) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/unduh/'],
      },
    ],
    sitemap: `${serverUrl}/sitemap.xml`,
    host: serverUrl,
  }
}

export default robots
