import Link from 'next/link'
import { ButtonLink } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import type { Post } from '@/payload-types'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

export const LatestPosts = ({
  posts,
  locale,
  dict,
}: {
  posts: Post[]
  locale: Locale
  dict: Dictionary
}) => {
  if (posts.length === 0) return null

  return (
    <Section spacing="lg">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{dict.nav.news}</Eyebrow>
            <Heading as="h2" size="lg">
              {locale === 'id' ? 'Kabar Terbaru' : 'Latest Updates'}
            </Heading>
          </div>
          <ButtonLink href={`/${locale}/berita`} variant="secondary" size="sm">
            {dict.common.viewAll}
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/berita/${post.slug}`}
              className="group flex flex-col border border-line bg-paper transition-colors hover:border-ink"
            >
              <div className="relative aspect-16/9 overflow-hidden bg-paper-alt">
                <MediaImage
                  media={post.coverImage}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                {post.publishedAt && (
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs uppercase tracking-wider text-stone"
                  >
                    {formatDate(post.publishedAt, locale)}
                  </time>
                )}
                <h3 className="mt-3 font-heading text-base font-bold leading-snug">{post.title}</h3>
                {post.excerpt && (
                  <p className="mt-3 line-clamp-3 flex-1 text-xs leading-relaxed text-stone">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}
