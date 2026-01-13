import { useContext } from 'react'
import { LoanDataContext } from '../context/LoanDataContext'

export default function useLoanData() {
  const context = useContext(LoanDataContext)
  if (!context) {
    throw new Error('useLoanData must be used within LoanDataProvider')
  }
  return context
}
