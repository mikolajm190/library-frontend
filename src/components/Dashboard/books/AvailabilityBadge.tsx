type AvailabilityBadgeProps = {
  availableCopies: number
  totalCopies: number
}

export default function AvailabilityBadge({ availableCopies, totalCopies }: AvailabilityBadgeProps) {
  const copiesOnLoan = totalCopies - availableCopies
  return (
    <div className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-xs text-[color:var(--ink)] shadow-sm">
      <p className="uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">Availability</p>
      <p className="mt-1 text-sm font-semibold">{availableCopies} available</p>
      <p className="mt-1 text-xs text-[color:var(--ink-muted)]">{copiesOnLoan} on loan</p>
    </div>
  )
}
