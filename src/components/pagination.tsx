import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Pagination berbasis tautan agar tetap berfungsi tanpa JavaScript dan terindeks. */
export const Pagination = ({
  page,
  totalPages,
  basePath,
  searchParams,
  label = 'Pagination',
}: {
  page: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string | undefined>
  label?: string
}) => {
  if (totalPages <= 1) return null

  const hrefFor = (target: number) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      if (value && key !== 'page') params.set(key, value)
    }
    if (target > 1) params.set('page', String(target))
    const query = params.toString()
    return query ? `${basePath}?${query}` : basePath
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (item) => item === 1 || item === totalPages || Math.abs(item - page) <= 1,
  )

  return (
    <nav aria-label={label} className="mt-12 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          rel="prev"
          className="flex h-10 w-10 items-center justify-center border border-line hover:border-ink"
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}

      {pages.map((item, index) => {
        const previous = pages[index - 1]
        const gap = previous !== undefined && item - previous > 1
        return (
          <span key={item} className="flex items-center gap-2">
            {gap && <span className="px-1 text-stone">…</span>}
            <Link
              href={hrefFor(item)}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'flex h-10 min-w-10 items-center justify-center border px-3 text-xs font-medium',
                item === page ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink',
              )}
            >
              {item}
            </Link>
          </span>
        )
      })}

      {page < totalPages && (
        <Link
          href={hrefFor(page + 1)}
          rel="next"
          className="flex h-10 w-10 items-center justify-center border border-line hover:border-ink"
          aria-label="Berikutnya"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </nav>
  )
}
