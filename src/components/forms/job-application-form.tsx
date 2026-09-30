'use client'

import { useActionState, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { submitJobApplication, type ApplicationState } from '@/actions/job-application'
import { TurnstileWidget } from '@/components/forms/turnstile-widget'
import { Button } from '@/components/ui/button'
import { Checkbox, Field, Input, Textarea } from '@/components/ui/field'
import type { Dictionary } from '@/i18n/dictionaries'

const initialState: ApplicationState = { status: 'idle' }

export const JobApplicationForm = ({
  dict,
  jobId,
  privacyHref,
  privacyLabel,
}: {
  dict: Dictionary
  jobId: number
  privacyHref: string
  privacyLabel: string
}) => {
  const [state, formAction, isPending] = useActionState(submitJobApplication, initialState)
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
      <input type="hidden" name="jobId" value={jobId} />

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
        <Field id="app-name" label={dict.form.name} required error={state.fieldErrors?.name}>
          <Input id="app-name" name="name" required autoComplete="name" />
        </Field>
        <Field id="app-email" label={dict.form.email} required error={state.fieldErrors?.email}>
          <Input id="app-email" name="email" type="email" required autoComplete="email" />
        </Field>
      </div>

      <Field id="app-phone" label={dict.form.phone} required error={state.fieldErrors?.phone}>
        <Input id="app-phone" name="phone" type="tel" required autoComplete="tel" />
      </Field>

      <Field
        id="app-cv"
        label={dict.form.cv}
        required
        error={state.fieldErrors?.cv}
        hint="PDF, DOC, atau DOCX. Maksimal 5 MB."
      >
        <Input
          id="app-cv"
          name="cv"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf"
          className="file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:text-paper"
        />
      </Field>

      <Field id="app-letter" label={dict.form.coverLetter} error={state.fieldErrors?.coverLetter}>
        <Textarea id="app-letter" name="coverLetter" rows={5} />
      </Field>

      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="app-website">Website</label>
        <input id="app-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <input type="hidden" name="turnstileToken" value={turnstileToken} />
      <TurnstileWidget onToken={setTurnstileToken} />

      <Checkbox
        id="app-consent"
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
      {state.fieldErrors?.consent && (
        <p role="alert" className="text-xs text-danger">
          {state.fieldErrors.consent}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? dict.common.sending : dict.common.send}
      </Button>
    </form>
  )
}
