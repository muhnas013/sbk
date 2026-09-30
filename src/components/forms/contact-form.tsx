'use client'

import { useActionState, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { submitContactForm, type ContactState } from '@/actions/contact'
import { TurnstileWidget } from '@/components/forms/turnstile-widget'
import { Button } from '@/components/ui/button'
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/field'
import type { Dictionary } from '@/i18n/dictionaries'

const initialState: ContactState = { status: 'idle' }

export const ContactForm = ({
  dict,
  divisions,
  privacyHref,
  privacyLabel,
}: {
  dict: Dictionary
  divisions: { id: number; name: string }[]
  privacyHref: string
  privacyLabel: string
}) => {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [turnstileToken, setTurnstileToken] = useState('')

  if (state.status === 'success') {
    return (
      <div className="border border-success/40 bg-success/5 p-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
        <h2 className="mt-5 font-heading text-lg font-bold">{dict.form.successTitle}</h2>
        <p className="mt-3 text-sm text-stone">{dict.form.successBody}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === 'error' && state.message && (
        <p
          role="alert"
          className="flex items-start gap-3 border border-danger/40 bg-danger/5 p-4 text-xs text-danger"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label={dict.form.name} required error={state.fieldErrors?.name}>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            aria-invalid={Boolean(state.fieldErrors?.name)}
            aria-describedby={state.fieldErrors?.name ? 'name-error' : undefined}
          />
        </Field>

        <Field id="email" label={dict.form.email} required error={state.fieldErrors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
          />
        </Field>

        <Field id="phone" label={dict.form.phone} error={state.fieldErrors?.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </Field>

        <Field id="company" label={dict.form.company} error={state.fieldErrors?.company}>
          <Input id="company" name="company" autoComplete="organization" />
        </Field>
      </div>

      {divisions.length > 0 && (
        <Field id="division" label={dict.form.division}>
          <Select id="division" name="division" defaultValue="">
            <option value="">—</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <Field id="subject" label={dict.form.subject} required error={state.fieldErrors?.subject}>
        <Input
          id="subject"
          name="subject"
          required
          aria-invalid={Boolean(state.fieldErrors?.subject)}
        />
      </Field>

      <Field id="message" label={dict.form.message} required error={state.fieldErrors?.message}>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={Boolean(state.fieldErrors?.message)}
        />
      </Field>

      {/* Honeypot — disembunyikan dari pengguna dan pembaca layar. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <input type="hidden" name="turnstileToken" value={turnstileToken} />
      <TurnstileWidget onToken={setTurnstileToken} />

      <Checkbox
        id="consent"
        name="consent"
        required
        label={
          <>
            {dict.form.consent}{' '}
            <a href={privacyHref} className="underline underline-offset-2 hover:text-ink">
              {privacyLabel}
            </a>
          </>
        }
      />

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? dict.common.sending : dict.common.send}
      </Button>
    </form>
  )
}
