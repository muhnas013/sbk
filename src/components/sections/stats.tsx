'use client'

import { useEffect, useRef, useState } from 'react'
import { Container, Section } from '@/components/ui/container'
import type { Homepage } from '@/payload-types'

type Stat = NonNullable<Homepage['stats']>[number]

/**
 * Counter yang menghitung naik saat masuk viewport.
 * Menghormati `prefers-reduced-motion`: bila aktif, angka langsung final.
 */
const Counter = ({ value, suffix }: { value: number; suffix?: string | null }) => {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || hasRun.current) return
        hasRun.current = true

        // Pengguna yang meminta pengurangan animasi langsung melihat angka final.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setDisplay(value)
          return
        }

        const duration = 1200
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          // Ease-out agar angka melambat mendekati nilai akhir.
          setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className="font-heading text-3xl font-extrabold lg:text-4xl">
      {display.toLocaleString('id-ID')}
      {suffix}
    </span>
  )
}

export const Stats = ({ stats }: { stats?: Stat[] | null }) => {
  if (!stats || stats.length === 0) return null

  return (
    <Section tone="dark" spacing="md">
      <Container>
        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.id ?? index} className="border-l-2 border-accent pl-5">
              <dd>
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-2 text-xs uppercase tracking-[0.15em] text-stone-light">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
