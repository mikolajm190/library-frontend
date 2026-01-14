import type { FormEventHandler, ReactNode } from 'react'

type AuthFormShellProps = {
  title: string
  onSubmit: FormEventHandler<HTMLFormElement>
  isSubmitting: boolean
  submitLabel: string
  messages?: string[]
  children: ReactNode
}

export default function AuthFormShell({
  title,
  onSubmit,
  isSubmitting,
  submitLabel,
  messages,
  children,
}: AuthFormShellProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm"
    >
      <h2 className="font-[var(--font-display)] text-3xl text-[color:var(--ink)]">{title}</h2>
      <div className="mt-6 space-y-4">{children}</div>

      {messages && messages.length > 0 && (
        <div className="mt-4 space-y-2">
          {messages.map((message, index) => (
            <p key={`${message}-${index}`} className="text-xs text-amber-700">
              {message}
            </p>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitLabel}
      </button>
    </form>
  )
}
