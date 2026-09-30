import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography'
import { MediaImage } from '@/components/media-image'
import { PageHero } from '@/components/page-hero'
import { RichText } from '@/components/rich-text'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale } from '@/lib/constants'
import { findAll, getGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { About as AboutGlobal, Team as TeamMember } from '@/payload-types'

export const revalidate = 300

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const about = await getGlobal<AboutGlobal>('about', locale, 0)
  return buildMetadata({
    locale,
    path: 'tentang-kami',
    title: about.heading ?? (locale === 'id' ? 'Tentang Kami' : 'About Us'),
    description: about.intro,
  })
}

const AboutPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const [about, team] = await Promise.all([
    getGlobal<AboutGlobal>('about', locale, 1),
    findAll<TeamMember>('team', { locale, sort: 'order' }),
  ])

  return (
    <>
      <PageHero
        title={about.heading ?? dict.nav.about}
        description={about.intro}
        image={about.heroImage}
        breadcrumb={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.about }]}
      />

      {(about.profile || about.image) && (
        <Section spacing="lg">
          <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <RichText data={about.profile} />
            {about.image && (
              <div className="relative aspect-4/3 w-full">
                <MediaImage media={about.image} sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
            )}
          </Container>
        </Section>
      )}

      {(about.vision || (about.mission && about.mission.length > 0)) && (
        <Section tone="dark" spacing="lg">
          <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {about.vision && (
              <div>
                <Eyebrow>{locale === 'id' ? 'Visi' : 'Vision'}</Eyebrow>
                <p className="font-heading text-lg leading-snug lg:text-xl">{about.vision}</p>
              </div>
            )}
            {about.mission && about.mission.length > 0 && (
              <div>
                <Eyebrow>{locale === 'id' ? 'Misi' : 'Mission'}</Eyebrow>
                <ol className="space-y-4">
                  {about.mission.map((item, index) => (
                    <li key={item.id ?? index} className="flex gap-4 text-sm text-stone-light">
                      <span className="shrink-0 font-heading font-bold text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </Container>
        </Section>
      )}

      {about.values && about.values.length > 0 && (
        <Section spacing="lg">
          <Container>
            <Eyebrow>{locale === 'id' ? 'Nilai Perusahaan' : 'Our Values'}</Eyebrow>
            <Heading as="h2" size="lg" className="max-w-2xl">
              {locale === 'id'
                ? 'Yang kami pegang di setiap proyek'
                : 'What we hold to on every project'}
            </Heading>
            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {about.values.map((value, index) => (
                <li key={value.id ?? index} className="border-t-2 border-accent pt-6">
                  <h3 className="font-heading text-base font-bold">{value.title}</h3>
                  {value.description && (
                    <p className="mt-3 text-xs leading-relaxed text-stone">{value.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {about.milestones && about.milestones.length > 0 && (
        <Section tone="alt" spacing="lg">
          <Container>
            <Eyebrow>{locale === 'id' ? 'Sejarah Singkat' : 'Our History'}</Eyebrow>
            <ol className="mt-10 border-l border-line">
              {about.milestones.map((milestone, index) => (
                <li key={milestone.id ?? index} className="relative pb-10 pl-8 last:pb-0">
                  <span
                    className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <p className="font-heading text-sm font-bold text-accent">{milestone.year}</p>
                  <h3 className="mt-1 font-heading text-base font-bold">{milestone.title}</h3>
                  {milestone.description && (
                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-stone">
                      {milestone.description}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      )}

      {about.orgChart && (
        <Section spacing="lg">
          <Container>
            <Eyebrow>{locale === 'id' ? 'Struktur Organisasi' : 'Organisation Structure'}</Eyebrow>
            <div className="mt-8 overflow-x-auto border border-line bg-paper p-6">
              <MediaImage
                media={about.orgChart}
                fill={false}
                sizes="100vw"
                className="mx-auto h-auto w-full max-w-4xl"
              />
            </div>
          </Container>
        </Section>
      )}

      {team.length > 0 && (
        <Section tone="alt" spacing="lg">
          <Container>
            <Eyebrow>{locale === 'id' ? 'Tim Manajemen' : 'Management Team'}</Eyebrow>
            <Heading as="h2" size="lg">
              {locale === 'id' ? 'Orang di balik pekerjaan' : 'The people behind the work'}
            </Heading>
            <Lead className="mt-4 max-w-2xl">
              {locale === 'id'
                ? 'Tim yang memimpin perencanaan, pelaksanaan, dan pengendalian mutu setiap proyek.'
                : 'The team leading planning, execution, and quality control on every project.'}
            </Lead>

            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <li key={member.id}>
                  <div className="relative aspect-square w-full overflow-hidden bg-paper">
                    <MediaImage
                      media={member.photo}
                      alt={member.name}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <h3 className="mt-5 font-heading text-base font-bold">{member.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-accent">
                    {member.position}
                  </p>
                  {member.bio && (
                    <p className="mt-3 text-xs leading-relaxed text-stone">{member.bio}</p>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  )
}

export default AboutPage
