import { useState, type FormEvent } from 'react'
import type { CreateUserPayload } from '../../../api/users.api'

type UserCreateFormProps = {
  isSubmitting: boolean
  onCreate: (payload: CreateUserPayload) => Promise<boolean>
}

export default function UserCreateForm({ isSubmitting, onCreate }: UserCreateFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    const success = await onCreate({ username: username.trim(), password: password.trim() })
    if (success) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            disabled={isSubmitting}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={isSubmitting}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-xs font-semibold text-[color:var(--paper)] shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Creating...' : 'Add user'}
      </button>
    </form>
  )
}
