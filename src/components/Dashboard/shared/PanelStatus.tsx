type PanelStatusProps = {
  variant: 'loading' | 'error' | 'success' | 'empty'
  message: string
  onRetry?: () => void
}

export default function PanelStatus({ variant, message, onRetry }: PanelStatusProps) {
  if (variant === 'loading') {
    return <p className="text-sm text-[color:var(--ink-muted)]">{message}</p>
  }

  if (variant === 'error') {
    return (
      <div className="flex flex-wrap items-center gap-3 text-sm text-amber-700">
        <span>{message}</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  if (variant === 'success') {
    return <p className="text-sm text-emerald-700">{message}</p>
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-[color:var(--ink-muted)]">
      {message}
    </div>
  )
}
