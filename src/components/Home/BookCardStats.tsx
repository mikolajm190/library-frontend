type BookCardStatsProps = {
  availableCopies: number
  totalCopies: number
}

export default function BookCardStats({ availableCopies, totalCopies }: BookCardStatsProps) {
  const copiesOnLoan = totalCopies - availableCopies
  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-black/5 bg-white/70 p-3 text-sm">
      <div>
        <p className="text-[color:var(--ink-muted)]">Available</p>
        <p className="mt-1 text-lg font-semibold text-[color:var(--ink)]">{availableCopies}</p>
      </div>
      <div>
        <p className="text-[color:var(--ink-muted)]">On loan</p>
        <p className="mt-1 text-lg font-semibold text-[color:var(--ink)]">{copiesOnLoan}</p>
      </div>
    </div>
  )
}
