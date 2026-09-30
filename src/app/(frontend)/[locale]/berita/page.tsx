import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Where } from 'payload'
import { Container, Section } from '@/components/ui/container'
import { MediaImage } from '@/components/media-image'
import { PageHero } from '@/components/page-hero'
import { Pagination } from '@/components/pagination'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findAll, findPublished } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { nowIso } from '@/lib/time'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Post, PostCategory } from '@/payload-types'

export const revalidate = 300

const PER_PAGE = 9

type Params = {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({
    locale,
    path: 'berita',
    title: locale === 'id' ? 'Berita & Artikel' : 'News & Articles',
  })
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

const NewsPage = async ({ params, searchParams }: Params) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const query = await searchParams
  const dict = getDictionary(locale)
  const categorySlug = first(query.kategori)
  const page = Math.max(1, Number(first(query.page) ?? 1) || 1)

  const categories = await findAll<PostCategory>('post-categories', { locale, depth: 0 })
  const category = categories.find((item) => item.slug === categorySlug)

  const filters: Where[] = []
  if (category) filters.push({ category: { equals: category.id } })
  // Artikel terjadwal belum boleh tampil sebelum waktunya.
  filters.push({ publishedAt: { less_than_equal: nowIso() } })

  const posts = await findPublished<Post>('posts', {
    locale,
    limit: PER_PAGE,
    page,
    sort: '-publishedAt',
    where: { and: filters },
  })

  return (
    <>
      <PageHero
        eyebrow={dict.nav.news}
        title={locale === 'id' ? 'Berita & Artikel' : 'News & Articles'}
        description={
          locale === 'id'
            ? 'Kegiatan perusahaan, perkembangan proyek, dan informasi yang kami bagikan.'
            : 'Company activities, project updates, and information we share.'
        }
        breadcrumb={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.news }]}
      />

      <Section spacing="lg">
        <Container>
          {categories.length > 0 && (
            <nav aria-label={dict.common.filter} className="flex flex-wrap gap-2">
              <Link
                href={`/${locale}/berita`}
                className={cn(
                  'border px-4 py-2 text-xs font-medium transition-colors',
                  !category ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink',
                )}
              >
                {dict.common.viewAll}
              </Link>
              {categories.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/berita?kategori=${item.slug}`}
                  className={cn(
                    'border px-4 py-2 text-xs font-medium transition-colors',
                    category?.id === item.id
                      ? 'border-ink bg-ink text-paper'
                      : 'border-line hover:border-ink',
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {posts.docs.length === 0 ? (
            <p className="mt-10 border border-line bg-paper-alt p-10 text-center text-sm text-stone">
              {dict.common.noResults}
            </p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.docs.map((post) => (
                <article key={post.id}>
                  <Link href={`/${locale}/berita/${post.slug}`} className="group block">
                    <div className="relative aspect-16/9 overflow-hidden bg-paper-alt">
                      <MediaImage
                        media={post.coverImage}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {post.publishedAt && (
                      <time
                        dateTime={post.publishedAt}
                        className="mt-5 block text-xs uppercase tracking-wider text-stone"
                      >
                        {formatDate(post.publishedAt, locale)}
                      </time>
                    )}
                    <h2 className="mt-2 font-heading text-base font-bold leading-snug group-hover:text-accent">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-stone">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          )}

          <Pagination
            page={posts.page}
            totalPages={posts.totalPages}
            basePath={`/${locale}/berita`}
            searchParams={{ kategori: categorySlug }}
          />
        </Container>
      </Section>
    </>
  )
}

export default NewsPage
