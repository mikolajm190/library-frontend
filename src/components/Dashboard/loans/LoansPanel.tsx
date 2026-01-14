import useLoansPanel from '../../../hooks/useLoansPanel'
import DashboardPanel from '../shared/DashboardPanel'
import LoanList from './LoanList'
import PanelListContainer from '../shared/PanelListContainer'
import PanelStatus from '../shared/PanelStatus'

type LoansPanelProps = {
  isAdmin: boolean
}

export default function LoansPanel({ isAdmin }: LoansPanelProps) {
  const {
    loans,
    isLoading,
    loadError,
    refetch,
    actionError,
    actionSuccess,
    successLoanId,
    isUpdating,
    updatingLoanId,
    isCancelling,
    cancellingLoanId,
    prolongLoan,
    cancelLoan,
  } = useLoansPanel()

  const loansTitle = isAdmin ? 'All loans' : 'My loans'
  const loansDescription = isAdmin
    ? 'Review overdue items and manage all checkouts.'
    : 'Track your current loans and upcoming returns.'

  return (
    <DashboardPanel
      title={loansTitle}
      description={loansDescription}
      className="flex flex-col lg:h-[clamp(34rem,70vh,44rem)]"
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      {isLoading && <PanelStatus variant="loading" message="Loading loans..." />}
      {loadError && <PanelStatus variant="error" message={loadError} onRetry={() => void refetch()} />}
      {actionError && !loadError && <PanelStatus variant="error" message={actionError} />}
      {actionSuccess && successLoanId === null && !loadError && (
        <PanelStatus variant="success" message={actionSuccess} />
      )}
      <PanelListContainer>
        {!isLoading && !loadError && loans.length === 0 && (
          <PanelStatus variant="empty" message="No loans found." />
        )}
        {!isLoading && !loadError && loans.length > 0 && (
          <LoanList
            loans={loans}
            isAdmin={isAdmin}
            isUpdating={isUpdating}
            isCancelling={isCancelling}
            updatingLoanId={updatingLoanId}
            cancellingLoanId={cancellingLoanId}
            actionSuccess={actionSuccess}
            successLoanId={successLoanId}
            onProlong={(loanId) => void prolongLoan(loanId)}
            onCancel={(loanId) => void cancelLoan(loanId)}
          />
        )}
      </PanelListContainer>
    </DashboardPanel>
  )
}
