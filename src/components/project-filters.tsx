'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/field'
import type { Dictionary } from '@/i18n/dictionaries'

export type FilterOption = { label: string; value: string }

/**
 * Filter daftar proyek. Seluruh state disimpan di query string supaya
 * hasil filter bisa dibagikan lewat tautan dan bisa di-*back* peramban.
 */
export const ProjectFilters = ({
  dict,
  divisions,
  categories,
  years,
}: {
  dict: Dictionary
  divisions: FilterOption[]
  categories: FilterOption[]
  years: FilterOption[]
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const apply = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    // Setiap perubahan filter mengembalikan pembaca ke halaman pertama.
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }))
  }

  const hasFilters = ['divisi', 'kategori', 'tahun', 'status', 'q'].some((key) =>
    searchParams.get(key),
  )

  const selectFields = [
    { name: 'divisi', label: dict.nav.divisions, options: divisions },
    { name: 'kategori', label: dict.common.filter, options: categories },
    { name: 'tahun', label: dict.project.year, options: years },
    {
      name: 'status',
      label: dict.project.status,
      options: [
        { label: dict.project.statusCompleted, value: 'completed' },
        { label: dict.project.statusOngoing, value: 'ongoing' },
        { label: dict.project.statusPlanned, value: 'planned' },
      ],
    },
  ]

  return (
    <div className="border border-line bg-paper p-5" data-pending={isPending || undefined}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          apply({ q: query || null })
        }}
        className="flex flex-col gap-4 lg:flex-row lg:items-end"
      >
        <div className="flex-1">
          <label htmlFor="project-search" className="mb-2 block text-xs font-medium">
            {dict.common.search}
          </label>
          <div className="relative">
            <Input
              id="project-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dict.common.search}
              className="pr-11"
            />
            <button
              type="submit"
              aria-label={dict.common.search}
              className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-stone hover:text-ink"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {selectFields.map((field) => (
          <div key={field.name} className="lg:w-48">
            <label htmlFor={`filter-${field.name}`} className="mb-2 block text-xs font-medium">
              {field.label}
            </label>
            <Select
              id={`filter-${field.name}`}
              value={searchParams.get(field.name) ?? ''}
              onChange={(event) => apply({ [field.name]: event.target.value || null })}
            >
              <option value="">{dict.common.viewAll}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        ))}

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => {
              setQuery('')
              startTransition(() => router.push(pathname, { scroll: false }))
            }}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            {dict.common.reset}
          </Button>
        )}
      </form>
    </div>
  )
}
