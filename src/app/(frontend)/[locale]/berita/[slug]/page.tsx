import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import { PageHero } from '@/components/page-hero'
import { RichText } from '@/components/rich-text'
import { ShareButtons } from '@/components/share-buttons'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findPublished, findPublishedBySlug } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { isFuture } from '@/lib/time'
import { formatDate } from '@/lib/utils'
import type { Post, User } from '@/payload-types'

export const revalidate = 300

type Params = { params: Promise<{ locale: string; slug: string }> }

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = await findPublishedBySlug<Post>('posts', slug, locale, 1)
  if (!post) return {}
  const metadata = await buildMetadata({
    locale,
    path: `berita/${slug}`,
    title: post.title,
    description: post.excerpt,
    image: post.coverImage,
  })
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
    },
  }
}

const NewsDetailPage = async ({ params }: Params) => {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const post = await findPublishedBySlug<Post>('posts', slug, locale, 2)
  if (!post) notFound()

  // Artikel terjadwal tidak boleh dapat dibuka sebelum waktunya.
  if (isFuture(post.publishedAt)) notFound()

  const categoryId = typeof post.category === 'object' ? post.category?.id : post.category
  const author = typeof post.author === 'object' ? (post.author as User) : null

  const related = await findPublished<Post>('posts', {
    locale,
    limit: 4,
    sort: '-publishedAt',
    where: categoryId ? { category: { equals: categoryId } } : undefined,
  })

  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/berita/${slug}`

  return (
    <>
      <PageHero
        eyebrow={typeof post.category === 'object' ? post.category?.name : undefined}
        title={post.title}
        description={post.excerpt}
        image={post.coverImage}
        breadcrumb={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.news, href: `/${locale}/berita` },
          { label: post.title },
        ]}
      />

      <Section spacing="lg">
        <Container className="max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6 text-xs text-stone">
            <p>
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
              )}
              {author?.name && <span className="ml-3">· {author.name}</span>}
            </p>
            <ShareButtons url={url} title={post.title} locale={locale} />
          </div>

          <RichText data={post.content} className="mt-10" />

          {post.tags && post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
              {post.tags.map((item, index) => (
                <li
                  key={item.id ?? index}
                  className="border border-line px-3 py-1 text-xs text-stone"
                >
                  {item.tag}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {related.docs.filter((item) => item.id !== post.id).length > 0 && (
        <Section tone="alt" spacing="lg">
          <Container>
            <Eyebrow>{locale === 'id' ? 'Artikel Terkait' : 'Related Articles'}</Eyebrow>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.docs
                .filter((item) => item.id !== post.id)
                .slice(0, 3)
                .map((item) => (
                  <Link key={item.id} href={`/${locale}/berita/${item.slug}`} className="group">
                    <div className="relative aspect-16/9 overflow-hidden bg-paper">
                      <MediaImage
                        media={item.coverImage}
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-4 font-heading text-sm font-bold leading-snug group-hover:text-accent">
                      {item.title}
                    </h3>
                  </Link>
                ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}

export default NewsDetailPage
