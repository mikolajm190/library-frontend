import { createContext } from 'react'
import type { Loan } from '../schemas/loan.schema'

export type LoanDataContextValue = {
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

export const LoanDataContext = createContext<LoanDataContextValue | undefined>(undefined)
