import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const controlClass =
  'w-full border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-stone-light transition-colors focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:bg-paper-alt aria-[invalid=true]:border-danger'

/** Pembungkus field: label, pesan bantuan, dan pesan galat yang terhubung ke input. */
export const Field = ({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}) => (
  <div className={cn('flex flex-col gap-2', className)}>
    <label htmlFor={id} className="text-xs font-medium text-ink">
      {label}
      {required && (
        <span className="ml-1 text-danger" aria-hidden="true">
          *
        </span>
      )}
    </label>
    {children}
    {hint && !error && (
      <p id={`${id}-hint`} className="text-xs text-stone">
        {hint}
      </p>
    )}
    {error && (
      <p id={`${id}-error`} role="alert" className="text-xs text-danger">
        {error}
      </p>
    )}
  </div>
)

export const Input = ({ className, ...props }: ComponentProps<'input'>) => (
  <input className={cn(controlClass, className)} {...props} />
)

export const Textarea = ({ className, ...props }: ComponentProps<'textarea'>) => (
  <textarea className={cn(controlClass, 'min-h-32 resize-y', className)} {...props} />
)

export const Select = ({ className, ...props }: ComponentProps<'select'>) => (
  <select className={cn(controlClass, 'appearance-none pr-10', className)} {...props} />
)

export const Checkbox = ({
  id,
  label,
  className,
  ...props
}: ComponentProps<'input'> & { id: string; label: ReactNode }) => (
  <div className={cn('flex items-start gap-3', className)}>
    <input
      id={id}
      type="checkbox"
      className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-ink)]"
      {...props}
    />
    <label htmlFor={id} className="text-xs leading-relaxed text-stone">
      {label}
    </label>
  </div>
)
