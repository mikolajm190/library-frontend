import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { cancelLoan, getLoans, prolongLoan } from '../../api/loans.api'
import DashboardPanel from './DashboardPanel'
import LoanList from './LoanList'
import type { Loan } from '../../schemas/loan.schema'

type LoansPanelProps = {
  isAdmin: boolean
}

export default function LoansPanel({ isAdmin }: LoansPanelProps) {
  const queryClient = useQueryClient()
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [successLoanId, setSuccessLoanId] = useState<string | null>(null)
  const [updatingLoanId, setUpdatingLoanId] = useState<string | null>(null)
  const [cancellingLoanId, setCancellingLoanId] = useState<string | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['loans'],
    queryFn: ({ signal }) => getLoans(signal),
  })

  const loans = data ?? []
  const loadError = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load loans'
    : null

  const handleAxiosError = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err)) {
      const responseData = err.response?.data as { message?: string } | string | undefined
      if (typeof responseData === 'string') {
        setActionError(responseData)
      } else {
        setActionError(responseData?.message ?? fallback)
      }
      return
    }
    setActionError(err instanceof Error ? err.message : fallback)
  }

  const prolongMutation = useMutation({
    mutationFn: (
      { loanId, daysToProlong }: { loanId: string; daysToProlong: number },
      { signal },
    ) => prolongLoan(loanId, daysToProlong, signal),
    onMutate: async ({ loanId, daysToProlong }) => {
      const queryKey = ['loans']
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Loan[]>(queryKey)
      if (previous) {
        queryClient.setQueryData<Loan[]>(queryKey, (current) =>
          current?.map((loan) => {
            if (loan.id !== loanId) {
              return loan
            }
            const nextReturnDate = new Date(
              loan.returnDate.getTime() + daysToProlong * 24 * 60 * 60 * 1000,
            )
            return { ...loan, returnDate: nextReturnDate }
          }),
        )
      }
      return { previous, queryKey }
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous)
      }
      handleAxiosError(err, 'Failed to prolong loan')
    },
    onSuccess: (_, variables) => {
      setActionSuccess('Return date extended by 30 days.')
      setSuccessLoanId(variables.loanId)
      void queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
    onSettled: () => {
      setUpdatingLoanId(null)
      void queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (loanId: string, { signal }) => cancelLoan(loanId, signal),
    onMutate: async (loanId) => {
      const queryKey = ['loans']
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Loan[]>(queryKey)
      if (previous) {
        queryClient.setQueryData<Loan[]>(queryKey, (current) =>
          current?.filter((loan) => loan.id !== loanId),
        )
      }
      return { previous, queryKey }
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous)
      }
      handleAxiosError(err, 'Failed to cancel loan')
    },
    onSuccess: () => {
      setActionSuccess('Loan canceled successfully.')
      setSuccessLoanId(null)
      void queryClient.invalidateQueries({ queryKey: ['loans'] })
      void queryClient.invalidateQueries({ queryKey: ['books'] })
    },
    onSettled: () => {
      setCancellingLoanId(null)
      void queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
  })

  const reload = () => {
    void refetch()
  }

  const prolongReturnDate = async (loanId: string) => {
    if (prolongMutation.isPending) {
      return
    }
    setUpdatingLoanId(loanId)
    setActionError(null)
    setActionSuccess(null)
    setSuccessLoanId(null)
    await prolongMutation
      .mutateAsync({ loanId, daysToProlong: 30 })
      .catch(() => null)
  }

  const cancelLoanById = async (loanId: string) => {
    if (cancelMutation.isPending) {
      return
    }
    setCancellingLoanId(loanId)
    setActionError(null)
    setActionSuccess(null)
    setSuccessLoanId(null)
    await cancelMutation.mutateAsync(loanId).catch(() => null)
  }

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
      {isLoading && (
        <p className="text-sm text-[color:var(--ink-muted)]">Loading loans...</p>
      )}
      {loadError && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-amber-700">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={reload}
            className="rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            Retry
          </button>
        </div>
      )}
      {actionError && !loadError && <p className="text-sm text-amber-700">{actionError}</p>}
      {actionSuccess && successLoanId === null && !loadError && (
        <p className="text-sm text-emerald-700">{actionSuccess}</p>
      )}
      <div className="mt-4 max-h-[420px] overflow-y-auto pr-2 lg:flex-1 lg:min-h-0 lg:max-h-none">
        {!isLoading && !loadError && loans.length === 0 && (
          <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-[color:var(--ink-muted)]">
            No loans found.
          </div>
        )}
        {!isLoading && !loadError && loans.length > 0 && (
          <LoanList
            loans={loans}
            isAdmin={isAdmin}
            isUpdating={prolongMutation.isPending}
            isCancelling={cancelMutation.isPending}
            updatingLoanId={updatingLoanId}
            cancellingLoanId={cancellingLoanId}
            actionSuccess={actionSuccess}
            successLoanId={successLoanId}
            onProlong={prolongReturnDate}
            onCancel={cancelLoanById}
          />
        )}
      </div>
    </DashboardPanel>
  )
}
