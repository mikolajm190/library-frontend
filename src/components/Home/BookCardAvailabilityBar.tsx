type BookCardAvailabilityBarProps = {
  totalCopies: number
  availabilityRatio: number
}

const formatPercent = (value: number) => `${Math.round(value * 100)}%`

export default function BookCardAvailabilityBar({
  totalCopies,
  availabilityRatio,
}: BookCardAvailabilityBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[color:var(--ink-muted)]">
        <span>Total copies</span>
        <span className="font-semibold text-[color:var(--ink)]">{totalCopies}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-black/10" aria-hidden>
        <div
          className="h-2 rounded-full bg-emerald-500/80 transition-all"
          style={{ width: formatPercent(availabilityRatio) }}
        />
      </div>
      <p className="text-xs text-[color:var(--ink-muted)]">
        {formatPercent(availabilityRatio)} availability
      </p>
    </div>
  )
}
