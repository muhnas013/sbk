'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'

export type GalleryItem = { url: string; alt: string; caption?: string | null }

/**
 * Galeri dengan lightbox. Fokus dikunci di dalam dialog selama terbuka,
 * navigasi tersedia lewat tombol, panah kiri/kanan, dan Esc untuk menutup.
 */
export const GalleryLightbox = ({
  items,
  closeLabel,
}: {
  items: GalleryItem[]
  closeLabel: string
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => {
    setOpenIndex(null)
    triggerRef.current?.focus()
  }, [])

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current
        return (current + delta + items.length) % items.length
      })
    },
    [items.length],
  )

  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
      if (event.key === 'Tab') {
        // Kunci fokus di dalam dialog.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button')
        if (!focusable || focusable.length === 0) return
        const firstEl = focusable[0]!
        const lastEl = focusable[focusable.length - 1]!
        if (event.shiftKey && document.activeElement === firstEl) {
          event.preventDefault()
          lastEl.focus()
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          event.preventDefault()
          firstEl.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector('button')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [openIndex, close, step])

  const active = openIndex === null ? null : items[openIndex]

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={`${item.url}-${index}`}>
            <button
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget
                setOpenIndex(index)
              }}
              className="group relative block aspect-4/3 w-full overflow-hidden bg-paper-alt"
              aria-label={item.alt || `Foto ${index + 1}`}
            >
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={active.alt || closeLabel}
          className="fixed inset-0 z-50 flex flex-col bg-ink/95 p-4 lg:p-8"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              aria-label={closeLabel}
              className="flex h-11 w-11 items-center justify-center text-paper hover:text-[color:var(--accent-text)]"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex-1">
            <Image
              src={active.url}
              alt={active.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Foto sebelumnya"
              className="flex h-11 w-11 items-center justify-center text-paper hover:text-[color:var(--accent-text)]"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>

            <p className="flex-1 text-center text-xs text-paper/80">
              {active.caption}
              <span className="ml-2 text-paper/50">
                {(openIndex ?? 0) + 1} / {items.length}
              </span>
            </p>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Foto berikutnya"
              className="flex h-11 w-11 items-center justify-center text-paper hover:text-[color:var(--accent-text)]"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
