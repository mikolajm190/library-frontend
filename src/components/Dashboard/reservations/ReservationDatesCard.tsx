import { formatDate } from '../loans/loanUtils'

type ReservationDatesCardProps = {
  createdAt: Date
  expiresAt: Date
}

export default function ReservationDatesCard({
  createdAt,
  expiresAt,
}: ReservationDatesCardProps) {
  return (
    <div className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-xs text-[color:var(--ink)] shadow-sm">
      <p className="uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">Created</p>
      <p className="mt-1 text-sm font-semibold">{formatDate(createdAt)}</p>
      <p className="mt-3 uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
        Expires
      </p>
      <p className="mt-1 text-sm font-semibold">{formatDate(expiresAt)}</p>
    </div>
  )
}
