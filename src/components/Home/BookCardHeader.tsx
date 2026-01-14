type BookCardHeaderProps = {
  title: string
  author: string
  isAvailable: boolean
  availabilityText: string
}

export default function BookCardHeader({
  title,
  author,
  isAvailable,
  availabilityText,
}: BookCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--ink-muted)]">Book</p>
        <h3 className="mt-2 font-[var(--font-display)] text-2xl leading-tight text-[color:var(--ink)]">
          {title}
        </h3>
        <p className="mt-1 text-sm text-[color:var(--ink-muted)]">by {author}</p>
      </div>
      <span
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
          isAvailable
            ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700'
            : 'border-amber-500/30 bg-amber-50 text-amber-700'
        }`}
      >
        {availabilityText}
      </span>
    </div>
  )
}
