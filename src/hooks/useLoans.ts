import { useEffect, useState } from 'react'
import axios from 'axios'
import { cancelLoan, getLoans, prolongLoan } from '../api/loans.api'
import type { Loan } from '../schemas/loan.schema'

type UseLoansResult = {
  loans: Loan[]
  isLoading: boolean
  error: string | null
  actionError: string | null
  actionSuccess: string | null
  successLoanId: string | null
  isUpdating: boolean
  updatingLoanId: string | null
  isCancelling: boolean
  cancellingLoanId: string | null
  reload: () => void
  prolongReturnDate: (loanId: string) => Promise<void>
  cancelLoanById: (loanId: string) => Promise<void>
}

export default function useLoans(): UseLoansResult {
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [successLoanId, setSuccessLoanId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatingLoanId, setUpdatingLoanId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancellingLoanId, setCancellingLoanId] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const loadLoans = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setActionError(null)
      setActionSuccess(null)
      setSuccessLoanId(null)
      setIsCancelling(false)
      setCancellingLoanId(null)
      const data = await getLoans(controller.signal)
      setLoans(data)
      } catch (err) {
        if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') {
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to load loans')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadLoans()

    return () => controller.abort()
  }, [reloadToken])

  const reload = () => {
    setReloadToken((value) => value + 1)
  }

  const prolongReturnDate = async (loanId: string) => {
    try {
      setIsUpdating(true)
      setUpdatingLoanId(loanId)
      setActionError(null)
      setActionSuccess(null)
      setSuccessLoanId(null)
      setIsCancelling(false)
      setCancellingLoanId(null)
      const updatedLoan = await prolongLoan(loanId, 30)
      if (updatedLoan) {
        setLoans((current) =>
          current.map((loan) => (loan.id === updatedLoan.id ? updatedLoan : loan)),
        )
      } else {
        reload()
      }
      setActionSuccess('Return date extended by 30 days.')
      setSuccessLoanId(loanId)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as { message?: string } | string | undefined
        if (typeof responseData === 'string') {
          setActionError(responseData)
        } else {
          setActionError(responseData?.message ?? 'Failed to prolong loan')
        }
        return
      }
      setActionError(err instanceof Error ? err.message : 'Failed to prolong loan')
    } finally {
      setIsUpdating(false)
      setUpdatingLoanId(null)
    }
  }

  const cancelLoanById = async (loanId: string) => {
    try {
      setIsCancelling(true)
      setCancellingLoanId(loanId)
      setActionError(null)
      setActionSuccess(null)
      setSuccessLoanId(null)
      await cancelLoan(loanId)
      setLoans((current) => current.filter((loan) => loan.id !== loanId))
      setActionSuccess('Loan canceled successfully.')
      setSuccessLoanId(null)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as { message?: string } | string | undefined
        if (typeof responseData === 'string') {
          setActionError(responseData)
        } else {
          setActionError(responseData?.message ?? 'Failed to cancel loan')
        }
        return
      }
      setActionError(err instanceof Error ? err.message : 'Failed to cancel loan')
    } finally {
      setIsCancelling(false)
      setCancellingLoanId(null)
    }
  }

  return {
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
  }
}
