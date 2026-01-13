import { useState, type ChangeEvent, type FormEvent } from 'react'

export type RegisterFormValues = {
  username: string
  password: string
  confirmPassword: string
}

type RegisterFormProps = {
  onSubmit?: (values: RegisterFormValues) => void | Promise<void>
  isSubmitting?: boolean
  error?: string | null
}

export default function RegisterForm({ onSubmit, isSubmitting = false, error }: RegisterFormProps) {
  const [values, setValues] = useState<RegisterFormValues>({
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleChange =
    (field: keyof RegisterFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }))
      if (validationError) {
        setValidationError(null)
      }
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }
    if (values.password !== values.confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }
    onSubmit?.(values)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm"
    >
      <h2 className="font-[var(--font-display)] text-3xl text-[color:var(--ink)]">Register</h2>
      <div className="mt-6 space-y-4">
        <label className="flex flex-col gap-2 text-sm text-[color:var(--ink-muted)]">
          Username
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange('username')}
            autoComplete="username"
            required
            disabled={isSubmitting}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-base text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[color:var(--ink-muted)]">
          Password
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange('password')}
            autoComplete="new-password"
            required
            disabled={isSubmitting}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-base text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[color:var(--ink-muted)]">
          Confirm password
          <input
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
            autoComplete="new-password"
            required
            disabled={isSubmitting}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-base text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </label>
      </div>

      {validationError && <p className="mt-4 text-xs text-amber-700">{validationError}</p>}
      {error && <p className="mt-2 text-xs text-amber-700">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-70"
      >
        Register
      </button>
    </form>
  )
}
