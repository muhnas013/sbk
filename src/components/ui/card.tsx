import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const Card = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    className={cn(
      'group border border-line bg-paper transition-colors duration-200 hover:border-ink',
      className,
    )}
    {...props}
  />
)

export const CardMedia = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('relative overflow-hidden bg-paper-alt', className)} {...props} />
)

export const CardBody = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('p-6', className)} {...props} />
)

export const CardTitle = ({ className, ...props }: ComponentProps<'h3'>) => (
  <h3 className={cn('font-heading text-base font-bold leading-snug', className)} {...props} />
)

export const CardMeta = ({ className, ...props }: ComponentProps<'p'>) => (
  <p className={cn('text-xs uppercase tracking-wider text-stone', className)} {...props} />
)
