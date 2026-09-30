import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Crumb = { label: string; href?: string }

export const Breadcrumb = ({
  items,
  className,
  label = 'Breadcrumb',
}: {
  items: Crumb[]
  className?: string
  label?: string
}) => (
  <nav aria-label={label} className={cn('text-xs text-stone', className)}>
    <ol className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className="text-ink">
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-3 w-3 text-stone-light" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  </nav>
)
