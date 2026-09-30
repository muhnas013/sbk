import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.75rem] font-medium uppercase tracking-wider',
  {
    variants: {
      variant: {
        neutral: 'bg-paper-alt text-stone',
        accent: 'bg-accent-soft text-accent-dark',
        dark: 'bg-ink text-paper',
        outline: 'border border-line text-stone',
        success: 'bg-success/10 text-success',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
)
