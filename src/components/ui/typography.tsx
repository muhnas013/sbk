import type { ComponentProps, ElementType } from 'react'
import { cn } from '@/lib/utils'

type HeadingProps = ComponentProps<'h2'> & {
  as?: ElementType
  /** Ukuran visual, terpisah dari level semantik agar struktur heading tetap benar. */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const headingSize = {
  sm: 'text-lg lg:text-xl',
  md: 'text-xl lg:text-2xl',
  lg: 'text-2xl lg:text-3xl',
  xl: 'text-3xl lg:text-4xl',
} as const

export const Heading = ({ as: Tag = 'h2', size = 'md', className, ...props }: HeadingProps) => (
  <Tag className={cn(headingSize[size], className)} {...props} />
)

/** Label kecil di atas judul section — meniru pola "eyebrow" pada referensi desain. */
export const Eyebrow = ({ className, ...props }: ComponentProps<'p'>) => (
  <p
    className={cn('text-xs font-medium uppercase tracking-[0.2em] text-accent mb-4', className)}
    {...props}
  />
)

export const Lead = ({ className, ...props }: ComponentProps<'p'>) => (
  <p className={cn('text-base text-stone leading-relaxed', className)} {...props} />
)
