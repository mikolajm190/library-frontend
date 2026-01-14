import type { Loan } from '../../../schemas/loan.schema'
import LoanActions from './LoanActions'
import LoanDatesCard from './LoanDatesCard'
import LoanHeader from './LoanHeader'

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
  return (
    <li className="rounded-2xl border border-black/10 bg-white/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <LoanHeader title={loan.book.title} author={loan.book.author} />
        <LoanDatesCard borrowDate={loan.borrowDate} returnDate={loan.returnDate} />
      </div>
      {isAdmin && (
        <p className="mt-2 text-xs text-[color:var(--ink-muted)]">
          Borrower: {loan.user.username}
        </p>
      )}
      <LoanActions
        loanId={loan.id}
        onProlong={onProlong}
        onCancel={onCancel}
        isUpdating={isUpdating}
        isCancelling={isCancelling}
        actionSuccess={actionSuccess}
        showSuccess={showSuccess}
      />
    </li>
  )
}
