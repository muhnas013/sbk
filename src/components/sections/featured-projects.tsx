import { ButtonLink } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Eyebrow, Heading } from '@/components/ui/typography'
import { ProjectCard } from '@/components/project-card'
import type { Project } from '@/payload-types'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/lib/constants'

export const FeaturedProjects = ({
  projects,
  locale,
  dict,
}: {
  projects: Project[]
  locale: Locale
  dict: Dictionary
}) => {
  if (projects.length === 0) return null

  return (
    <Section spacing="lg">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{dict.nav.projects}</Eyebrow>
            <Heading as="h2" size="lg">
              {locale === 'id' ? 'Proyek Terpilih' : 'Selected Projects'}
            </Heading>
          </div>
          <ButtonLink href={`/${locale}/proyek`} variant="secondary" size="sm">
            {dict.common.viewAll}
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
