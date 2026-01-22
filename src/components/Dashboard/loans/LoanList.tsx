import LoanCard from './LoanCard'
import type { Loan } from '../../../schemas/loan.schema'

type LoanListProps = {
  loans: Loan[]
  isStaff: boolean
  isUpdating: boolean
  isCancelling: boolean
  updatingLoanId: string | null
  cancellingLoanId: string | null
  actionSuccess: string | null
  successLoanId: string | null
  onProlong: (loanId: string) => void
  onCancel: (loanId: string) => void
}

export default function LoanList({
  loans,
  isStaff,
  isUpdating,
  isCancelling,
  updatingLoanId,
  cancellingLoanId,
  actionSuccess,
  successLoanId,
  onProlong,
  onCancel,
}: LoanListProps) {
  return (
    <ul className="space-y-3 text-sm">
      {loans.map((loan) => (
        <LoanCard
          key={loan.id}
          loan={loan}
          isStaff={isStaff}
          onProlong={onProlong}
          onCancel={onCancel}
          isUpdating={isUpdating && updatingLoanId === loan.id}
          isCancelling={isCancelling && cancellingLoanId === loan.id}
          actionSuccess={actionSuccess}
          showSuccess={successLoanId === loan.id}
        />
      ))}
    </ul>
  )
}
