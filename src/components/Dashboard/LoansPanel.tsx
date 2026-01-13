import DashboardPanel from './DashboardPanel'
import LoanList from './LoanList'
import useLoanData from '../../hooks/useLoanData'

type LoansPanelProps = {
  isAdmin: boolean
}

export default function LoansPanel({ isAdmin }: LoansPanelProps) {
  const {
    loans,
    isLoading,
    error,
    actionError,
    actionSuccess,
    successLoanId,
    isUpdating,
    updatingLoanId,
    isCancelling,
    cancellingLoanId,
    reload,
    prolongReturnDate,
    cancelLoanById,
  } = useLoanData()

  const loansTitle = isAdmin ? 'All loans' : 'My loans'
  const loansDescription = isAdmin
    ? 'Review overdue items and manage all checkouts.'
    : 'Track your current loans and upcoming returns.'

  return (
    <DashboardPanel title={loansTitle} description={loansDescription}>
      {isLoading && (
        <p className="text-sm text-[color:var(--ink-muted)]">Loading loans...</p>
      )}
      {error && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-amber-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={reload}
            className="rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            Retry
          </button>
        </div>
      )}
      {actionError && !error && <p className="text-sm text-amber-700">{actionError}</p>}
      {actionSuccess && successLoanId === null && !error && (
        <p className="text-sm text-emerald-700">{actionSuccess}</p>
      )}
      {!isLoading && !error && loans.length === 0 && (
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-[color:var(--ink-muted)]">
          No loans found.
        </div>
      )}
      {!isLoading && !error && loans.length > 0 && (
        <LoanList
          loans={loans}
          isAdmin={isAdmin}
          isUpdating={isUpdating}
          isCancelling={isCancelling}
          updatingLoanId={updatingLoanId}
          cancellingLoanId={cancellingLoanId}
          actionSuccess={actionSuccess}
          successLoanId={successLoanId}
          onProlong={prolongReturnDate}
          onCancel={cancelLoanById}
        />
      )}
    </DashboardPanel>
  )
}
