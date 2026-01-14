import { Clock, XCircle } from 'lucide-react'

type LoanActionsProps = {
  loanId: string
  onProlong: (loanId: string) => void
  onCancel: (loanId: string) => void
  isUpdating: boolean
  isCancelling: boolean
  actionSuccess: string | null
  showSuccess: boolean
}

export default function LoanActions({
  loanId,
  onProlong,
  onCancel,
  isUpdating,
  isCancelling,
  actionSuccess,
  showSuccess,
}: LoanActionsProps) {
  const isDisabled = isUpdating || isCancelling

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onProlong(loanId)}
        disabled={isDisabled}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Clock className="h-3.5 w-3.5" aria-hidden />
        {isUpdating ? 'Prolonging...' : 'Prolong 30 days'}
      </button>
      <button
        type="button"
        onClick={() => onCancel(loanId)}
        disabled={isDisabled}
        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
      >
        <XCircle className="h-3.5 w-3.5" aria-hidden />
        {isCancelling ? 'Cancelling...' : 'Cancel loan'}
      </button>
      {showSuccess && actionSuccess && (
        <p className="text-xs text-emerald-700">{actionSuccess}</p>
      )}
    </div>
  )
}
