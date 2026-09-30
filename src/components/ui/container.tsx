import type { ComponentProps, ElementType } from 'react'
import { cn } from '@/lib/utils'

export const Container = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('container-content', className)} {...props} />
)

type SectionProps = ComponentProps<'section'> & {
  as?: ElementType
  /** Latar section. `alt` dan `dark` dipakai untuk memberi ritme antar bagian. */
  tone?: 'default' | 'alt' | 'dark'
  /** Kepadatan padding vertikal. */
  spacing?: 'sm' | 'md' | 'lg'
}

const toneClass = {
  default: 'bg-paper text-ink',
  alt: 'bg-paper-alt text-ink',
  dark: 'bg-ink text-paper',
} as const

const spacingClass = {
  sm: 'py-12 lg:py-16',
  md: 'py-16 lg:py-24',
  lg: 'py-20 lg:py-32',
} as const

export const Section = ({
  as: Tag = 'section',
  tone = 'default',
  spacing = 'md',
  className,
  ...props
}: SectionProps) => (
  <Tag className={cn(toneClass[tone], spacingClass[spacing], className)} {...props} />
)
