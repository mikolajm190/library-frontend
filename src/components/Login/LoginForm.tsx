import { useState, type ChangeEvent, type FormEvent } from 'react'

export type LoginFormValues = {
  username: string
  password: string
}

type LoginFormProps = {
  onSubmit?: (values: LoginFormValues) => void | Promise<void>
  isSubmitting?: boolean
  error?: string | null
}

export default function LoginForm({ onSubmit, isSubmitting = false, error }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({ username: '', password: '' })

  const handleChange = (field: keyof LoginFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }
    onSubmit?.(values)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm"
    >
      <h2 className="font-[var(--font-display)] text-3xl text-[color:var(--ink)]">Login</h2>
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
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-base text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </label>
      </div>

      {error && <p className="mt-4 text-xs text-amber-700">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-70"
      >
        Login
      </button>
    </form>
  )
}
