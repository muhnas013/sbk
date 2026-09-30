import Link from 'next/link'
import { ButtonLink } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import { RichText } from '@/components/rich-text'
import { Stats } from '@/components/sections/stats'
import { getDictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/lib/constants'
import { localizedHref } from '@/lib/links'
import { findPublished } from '@/lib/payload'
import type { Division, Page, Post, Project, Service } from '@/payload-types'

type Block = NonNullable<Page['layout']>[number]

const COLUMN_CLASS: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

/** Menarik konten untuk blok "Daftar Konten Dinamis". */
const fetchDynamicList = async (
  source: string,
  limit: number,
  locale: Locale,
): Promise<{ id: number; title: string; href: string }[]> => {
  switch (source) {
    case 'projects':
    case 'projects-featured': {
      const result = await findPublished<Project>('projects', {
        locale,
        limit,
        sort: source === 'projects-featured' ? 'order' : '-yearCompleted',
        where: source === 'projects-featured' ? { featured: { equals: true } } : undefined,
      })
      return result.docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        href: `/${locale}/proyek/${doc.slug}`,
      }))
    }
    case 'posts': {
      const result = await findPublished<Post>('posts', { locale, limit, sort: '-publishedAt' })
      return result.docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        href: `/${locale}/berita/${doc.slug}`,
      }))
    }
    case 'services': {
      const result = await findPublished<Service>('services', { locale, limit, sort: 'order' })
      return result.docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        href: `/${locale}/layanan/${doc.slug}`,
      }))
    }
    case 'divisions': {
      const result = await findPublished<Division>('divisions', { locale, limit, sort: 'order' })
      return result.docs.map((doc) => ({
        id: doc.id,
        title: doc.name,
        href: `/${locale}/divisi/${doc.slug}`,
      }))
    }
    default:
      return []
  }
}

const RenderBlock = async ({
  block,
  locale,
  index,
}: {
  block: Block
  locale: Locale
  index: number
}) => {
  const dict = getDictionary(locale)
  const tone = index % 2 === 0 ? 'default' : 'alt'

  switch (block.blockType) {
    case 'hero':
      return (
        <section className="tone-dark relative isolate flex min-h-[60vh] items-end overflow-hidden bg-ink text-paper">
          {block.backgroundImage && (
            <>
              <MediaImage media={block.backgroundImage} sizes="100vw" priority className="-z-10" />
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30"
                aria-hidden="true"
              />
            </>
          )}
          <Container className="py-16 lg:py-24">
            {block.eyebrow && (
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[color:var(--accent-text)]">
                {block.eyebrow}
              </p>
            )}
            <Heading as="h1" size="xl" className="max-w-3xl">
              {block.heading}
            </Heading>
            {block.subheading && (
              <p className="mt-5 max-w-2xl text-base text-paper/80">{block.subheading}</p>
            )}
            {block.buttons && block.buttons.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4">
                {block.buttons.map((button, buttonIndex) => (
                  <ButtonLink
                    key={button.id ?? buttonIndex}
                    href={localizedHref(button.href ?? '/', locale)}
                    variant={buttonIndex === 0 ? 'accent' : 'secondary'}
                    className={
                      buttonIndex === 0
                        ? ''
                        : 'border-paper text-paper hover:bg-paper hover:text-ink'
                    }
                  >
                    {button.label}
                  </ButtonLink>
                ))}
              </div>
            )}
          </Container>
        </section>
      )

    case 'richText':
      return (
        <Section tone={tone} spacing="md">
          <Container className="max-w-3xl">
            <RichText data={block.content} />
          </Container>
        </Section>
      )

    case 'textImage':
      return (
        <Section tone={tone} spacing="lg">
          <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className={block.imagePosition === 'left' ? 'lg:order-2' : undefined}>
              {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
              {block.heading && (
                <Heading as="h2" size="md">
                  {block.heading}
                </Heading>
              )}
              <RichText data={block.content} className="mt-6" />
              {block.button?.label && block.button.href && (
                <ButtonLink
                  href={localizedHref(block.button.href, locale)}
                  variant="secondary"
                  className="mt-8"
                >
                  {block.button.label}
                </ButtonLink>
              )}
            </div>
            <div
              className={`relative aspect-4/3 w-full ${block.imagePosition === 'left' ? 'lg:order-1' : ''}`}
            >
              <MediaImage media={block.image} sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </Container>
        </Section>
      )

    case 'cardGrid':
      return (
        <Section tone={tone} spacing="lg">
          <Container>
            {block.heading && (
              <Heading as="h2" size="md">
                {block.heading}
              </Heading>
            )}
            <ul className={`mt-10 grid gap-6 ${COLUMN_CLASS[block.columns ?? '3']}`}>
              {block.cards?.map((card, cardIndex) => {
                const content = (
                  <>
                    {card.image && (
                      <div className="relative aspect-4/3 overflow-hidden bg-paper-alt">
                        <MediaImage media={card.image} sizes="(min-width: 640px) 33vw, 100vw" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-heading text-base font-bold leading-snug">
                        {card.title}
                      </h3>
                      {card.description && (
                        <p className="mt-3 text-xs leading-relaxed text-stone">
                          {card.description}
                        </p>
                      )}
                    </div>
                  </>
                )
                return (
                  <li key={card.id ?? cardIndex} className="border border-line bg-paper">
                    {card.href ? (
                      <Link
                        href={localizedHref(card.href, locale)}
                        className="block transition-colors hover:bg-paper-alt"
                      >
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                )
              })}
            </ul>
          </Container>
        </Section>
      )

    case 'stats':
      return <Stats stats={block.items} />

    case 'gallery':
      return (
        <Section tone={tone} spacing="lg">
          <Container>
            {block.heading && (
              <Heading as="h2" size="md">
                {block.heading}
              </Heading>
            )}
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {block.images?.map((item, imageIndex) => (
                <li key={item.id ?? imageIndex} className="relative aspect-4/3 overflow-hidden">
                  <MediaImage media={item.image} sizes="(min-width: 640px) 33vw, 100vw" />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )

    case 'cta':
      return (
        <Section tone="dark" spacing="lg">
          <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <Heading as="h2" size="lg">
                {block.heading}
              </Heading>
              {block.description && (
                <p className="mt-4 text-sm text-stone-light">{block.description}</p>
              )}
            </div>
            {block.button?.label && block.button.href && (
              <ButtonLink
                href={localizedHref(block.button.href, locale)}
                variant="accent"
                size="lg"
                className="shrink-0"
              >
                {block.button.label}
              </ButtonLink>
            )}
          </Container>
        </Section>
      )

    case 'faqBlock':
      return (
        <Section tone={tone} spacing="lg">
          <Container className="max-w-3xl">
            {block.heading && (
              <Heading as="h2" size="md">
                {block.heading}
              </Heading>
            )}
            <div className="mt-8 divide-y divide-line border-y border-line">
              {block.faq?.map((item, faqIndex) => (
                <details key={item.id ?? faqIndex} className="py-5">
                  <summary className="cursor-pointer list-none font-heading text-sm font-bold marker:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-xs leading-relaxed text-stone">{item.answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </Section>
      )

    case 'featureList':
      return (
        <Section tone={tone} spacing="lg">
          <Container>
            {block.heading && (
              <Heading as="h2" size="md">
                {block.heading}
              </Heading>
            )}
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {block.items?.map((item, itemIndex) => (
                <li
                  key={item.id ?? itemIndex}
                  className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-stone"
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )

    case 'contentList': {
      const items = await fetchDynamicList(block.source, block.limit ?? 3, locale)
      if (items.length === 0) return null

      const isProjects = block.source.startsWith('projects')
      return (
        <Section tone={tone} spacing="lg">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              {block.heading && (
                <Heading as="h2" size="md">
                  {block.heading}
                </Heading>
              )}
              {block.viewAllHref && (
                <ButtonLink
                  href={localizedHref(block.viewAllHref, locale)}
                  variant="secondary"
                  size="sm"
                >
                  {dict.common.viewAll}
                </ButtonLink>
              )}
            </div>

            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={`${block.source}-${item.id}`}>
                  <Link
                    href={item.href}
                    className="flex h-full flex-col border border-line bg-paper p-6 transition-colors hover:border-ink"
                  >
                    <h3 className="font-heading text-sm font-bold leading-snug">{item.title}</h3>
                    <span className="mt-4 text-xs text-[color:var(--accent-text)]">
                      {isProjects ? dict.common.viewDetail : dict.common.readMore}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )
    }

    default:
      return null
  }
}

export const RenderBlocks = ({ blocks, locale }: { blocks?: Page['layout']; locale: Locale }) => {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, index) => (
        <RenderBlock key={block.id ?? index} block={block} locale={locale} index={index} />
      ))}
    </>
  )
}
