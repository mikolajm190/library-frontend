import { formatDate, getDueStatus } from './loanUtils'

type LoanDatesCardProps = {
  borrowDate: Date
  returnDate: Date
}

export default function LoanDatesCard({ borrowDate, returnDate }: LoanDatesCardProps) {
  const dueStatus = getDueStatus(returnDate)

  return (
    <div className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-xs text-[color:var(--ink)] shadow-sm">
      <p className="uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">Borrowed</p>
      <p className="mt-1 text-sm font-semibold">{formatDate(borrowDate)}</p>
      <p className="mt-3 uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
        Return by
      </p>
      <p className="mt-1 text-sm font-semibold">{formatDate(returnDate)}</p>
      <div
        className={`mt-3 rounded-lg border px-2 py-1 text-xs font-semibold ${dueStatus.badgeClassName}`}
      >
        {dueStatus.label}
      </div>
    </div>
  )
}
