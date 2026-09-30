import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-paper hover:bg-accent',
        secondary: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper',
        accent: 'bg-accent text-white hover:bg-accent-dark',
        ghost: 'bg-transparent text-ink hover:bg-paper-alt',
        link: 'bg-transparent text-ink underline underline-offset-4 hover:text-accent p-0 h-auto',
      },
      size: {
        sm: 'h-10 px-4 text-xs',
        md: 'h-12 px-6 text-xs',
        lg: 'h-14 px-8 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonBaseProps = VariantProps<typeof buttonVariants>

type ButtonProps = ComponentProps<'button'> & ButtonBaseProps

export const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
)

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonBaseProps

export const ButtonLink = ({ className, variant, size, ...props }: ButtonLinkProps) => (
  <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />
)

export { buttonVariants }
