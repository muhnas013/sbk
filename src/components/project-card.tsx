import Link from 'next/link'
import { MediaImage } from '@/components/media-image'
import { Badge } from '@/components/ui/badge'
import type { Division, Project } from '@/payload-types'
import type { Locale } from '@/lib/constants'

const divisionName = (division: Project['division']): string | null =>
  division && typeof division === 'object' ? ((division as Division).name ?? null) : null

export const ProjectCard = ({
  project,
  locale,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
}: {
  project: Project
  locale: Locale
  sizes?: string
}) => (
  <Link
    href={`/${locale}/proyek/${project.slug}`}
    className="group flex flex-col border border-line bg-paper transition-colors hover:border-ink"
  >
    <div className="relative aspect-4/3 overflow-hidden bg-paper-alt">
      <MediaImage
        media={project.coverImage}
        sizes={sizes}
        className="transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <div className="flex flex-1 flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        {divisionName(project.division) && (
          <Badge variant="accent">{divisionName(project.division)}</Badge>
        )}
        {project.yearCompleted && <Badge variant="outline">{project.yearCompleted}</Badge>}
      </div>

      <h3 className="mt-4 font-heading text-base font-bold leading-snug">{project.title}</h3>

      {project.location && (
        <p className="mt-2 text-xs uppercase tracking-wider text-stone">{project.location}</p>
      )}

      {project.summary && (
        <p className="mt-3 line-clamp-3 flex-1 text-xs leading-relaxed text-stone">
          {project.summary}
        </p>
      )}
    </div>
  </Link>
)
