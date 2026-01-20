import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import useLoansPanel from '../../../hooks/useLoansPanel'
import DashboardPanel from '../shared/DashboardPanel'
import LoanList from './LoanList'
import PanelListContainer from '../shared/PanelListContainer'
import PanelStatus from '../shared/PanelStatus'
import PanelSearch from '../shared/PanelSearch'

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
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredLoans = normalizedQuery
    ? loans.filter((loan) => {
        const terms = [loan.book.title, loan.book.author]
        if (isAdmin) {
          terms.push(loan.user.username)
        }
        return terms.some((term) => term.toLowerCase().includes(normalizedQuery))
      })
    : loans
  const isFiltering = normalizedQuery.length > 0
  const emptyMessage = isFiltering
    ? `No loans match "${searchQuery.trim()}".`
    : 'No loans found.'

  return (
    <DashboardPanel
      title={loansTitle}
      description={loansDescription}
      icon={<ClipboardList className="h-5 w-5 text-[color:var(--ink)]" aria-hidden />}
      className="flex flex-col lg:h-[clamp(34rem,70vh,44rem)]"
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <PanelSearch
        label="Search loans"
        placeholder={isAdmin ? 'Search by book or borrower' : 'Search by book or author'}
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {isLoading && <PanelStatus variant="loading" message="Loading loans..." />}
      {loadError && <PanelStatus variant="error" message={loadError} onRetry={() => void refetch()} />}
      {actionError && !loadError && <PanelStatus variant="error" message={actionError} />}
      {actionSuccess && successLoanId === null && !loadError && (
        <PanelStatus variant="success" message={actionSuccess} />
      )}
      <PanelListContainer>
        {!isLoading && !loadError && filteredLoans.length === 0 && (
          <PanelStatus variant="empty" message={emptyMessage} />
        )}
        {!isLoading && !loadError && filteredLoans.length > 0 && (
          <LoanList
            loans={filteredLoans}
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
