import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cancelLoan, getLoans, prolongLoan } from '../api/loans.api'
import { getApiErrorMessage } from '../api/apiError'
import { queryKeys } from '../api/queryKeys'
import type { Loan } from '../schemas/loan.schema'

type UseLoansPanelResult = {
  loans: Loan[]
  isLoading: boolean
  loadError: string | null
  refetch: () => void
  actionError: string | null
  actionSuccess: string | null
  successLoanId: string | null
  isUpdating: boolean
  updatingLoanId: string | null
  isCancelling: boolean
  cancellingLoanId: string | null
  prolongLoan: (loanId: string, daysToProlong?: number) => Promise<boolean>
  cancelLoan: (loanId: string) => Promise<boolean>
}

export default function useLoansPanel(): UseLoansPanelResult {
  const queryClient = useQueryClient()
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [successLoanId, setSuccessLoanId] = useState<string | null>(null)
  const [updatingLoanId, setUpdatingLoanId] = useState<string | null>(null)
  const [cancellingLoanId, setCancellingLoanId] = useState<string | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.loans(),
    queryFn: ({ signal }) => getLoans(signal),
  })

  const loans = data ?? []
  const loadError = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load loans'
    : null

  const prolongMutation = useMutation({
    mutationFn: (
      { loanId, daysToProlong }: { loanId: string; daysToProlong: number },
      { signal },
    ) => prolongLoan(loanId, daysToProlong, signal),
    onMutate: async ({ loanId, daysToProlong }) => {
      const queryKey = queryKeys.loans()
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
      setActionError(getApiErrorMessage(err, 'Failed to prolong loan'))
    },
    onSuccess: (_, variables) => {
      setActionSuccess('Return date extended by 30 days.')
      setSuccessLoanId(variables.loanId)
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans() })
    },
    onSettled: () => {
      setUpdatingLoanId(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans() })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (loanId: string, { signal }) => cancelLoan(loanId, signal),
    onMutate: async (loanId) => {
      const queryKey = queryKeys.loans()
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
      setActionError(getApiErrorMessage(err, 'Failed to cancel loan'))
    },
    onSuccess: () => {
      setActionSuccess('Loan canceled successfully.')
      setSuccessLoanId(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.books() })
    },
    onSettled: () => {
      setCancellingLoanId(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans() })
    },
  })

  const prolongLoanEntry = async (
    loanId: string,
    daysToProlong = 30,
  ): Promise<boolean> => {
    if (prolongMutation.isPending) {
      return false
    }
    setUpdatingLoanId(loanId)
    setActionError(null)
    setActionSuccess(null)
    setSuccessLoanId(null)
    try {
      await prolongMutation.mutateAsync({ loanId, daysToProlong })
      return true
    } catch {
      setUpdatingLoanId(null)
      return false
    }
  }

  const cancelLoanEntry = async (loanId: string): Promise<boolean> => {
    if (cancelMutation.isPending) {
      return false
    }
    setCancellingLoanId(loanId)
    setActionError(null)
    setActionSuccess(null)
    setSuccessLoanId(null)
    try {
      await cancelMutation.mutateAsync(loanId)
      return true
    } catch {
      setCancellingLoanId(null)
      return false
    }
  }

  return {
    loans,
    isLoading,
    loadError,
    refetch,
    actionError,
    actionSuccess,
    successLoanId,
    isUpdating: prolongMutation.isPending,
    updatingLoanId,
    isCancelling: cancelMutation.isPending,
    cancellingLoanId,
    prolongLoan: prolongLoanEntry,
    cancelLoan: cancelLoanEntry,
  }
}
