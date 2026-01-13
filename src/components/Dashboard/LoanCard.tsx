import type { Loan } from '../../schemas/loan.schema'

type LoanCardProps = {
  loan: Loan
  isAdmin: boolean
  onProlong: (loanId: string) => void
  onCancel: (loanId: string) => void
  isUpdating: boolean
  isCancelling: boolean
  actionSuccess: string | null
  showSuccess: boolean
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const getDaysLeft = (returnDate: Date) => {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dueDate = new Date(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate())
  const diffMs = dueDate.getTime() - startOfToday.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

const getDueStatus = (returnDate: Date) => {
  const daysLeft = getDaysLeft(returnDate)
  if (daysLeft < 0) {
    const overdueDays = Math.abs(daysLeft)
    return {
      label: `Overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}`,
      badgeClassName: 'border-rose-200 bg-rose-50 text-rose-700',
    }
  }
  if (daysLeft === 0) {
    return {
      label: 'Due today',
      badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
    }
  }
  if (daysLeft <= 3) {
    return {
      label: `Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
      badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
    }
  }
  return {
    label: `Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  }
}

export default function LoanCard({
  loan,
  isAdmin,
  onProlong,
  onCancel,
  isUpdating,
  isCancelling,
  actionSuccess,
  showSuccess,
}: LoanCardProps) {
  const dueStatus = getDueStatus(loan.returnDate)

  return (
    <li className="rounded-2xl border border-black/10 bg-white/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-[color:var(--ink)]">{loan.book.title}</p>
          <p className="text-xs text-[color:var(--ink-muted)]">{loan.book.author}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-xs text-[color:var(--ink)] shadow-sm">
          <p className="uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">Borrowed</p>
          <p className="mt-1 text-sm font-semibold">{formatDate(loan.borrowDate)}</p>
          <p className="mt-3 uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Return by
          </p>
          <p className="mt-1 text-sm font-semibold">{formatDate(loan.returnDate)}</p>
          <div
            className={`mt-3 rounded-lg border px-2 py-1 text-xs font-semibold ${dueStatus.badgeClassName}`}
          >
            {dueStatus.label}
          </div>
        </div>
      </div>
      {isAdmin && (
        <p className="mt-2 text-xs text-[color:var(--ink-muted)]">
          Borrower: {loan.user.username}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onProlong(loan.id)}
          disabled={isUpdating || isCancelling}
          className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUpdating ? 'Prolonging...' : 'Prolong 30 days'}
        </button>
        <button
          type="button"
          onClick={() => onCancel(loan.id)}
          disabled={isUpdating || isCancelling}
          className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCancelling ? 'Cancelling...' : 'Cancel loan'}
        </button>
        {showSuccess && actionSuccess && (
          <p className="text-xs text-emerald-700">{actionSuccess}</p>
        )}
      </div>
    </li>
  )
}
