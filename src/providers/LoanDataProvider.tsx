import type { ReactNode } from 'react'
import useLoans from '../hooks/useLoans'
import { LoanDataContext } from '../context/LoanDataContext'

type LoanDataProviderProps = {
  children: ReactNode
}

export default function LoanDataProvider({ children }: LoanDataProviderProps) {
  const value = useLoans()

  return <LoanDataContext.Provider value={value}>{children}</LoanDataContext.Provider>
}
