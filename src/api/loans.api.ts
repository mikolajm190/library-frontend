import client from './client'
import type { Loan, LoanListResponse } from '../schemas/loan.schema'

type LoanApi = Omit<Loan, 'borrowDate' | 'returnDate'> & {
  borrowDate: string
  returnDate: string
}

const normalizeLoan = (loan: LoanApi): Loan => ({
  ...loan,
  borrowDate: new Date(loan.borrowDate),
  returnDate: new Date(loan.returnDate),
})

export async function getLoans(signal?: AbortSignal): Promise<LoanListResponse> {
  const response = await client.get<LoanApi[]>('/v1/loans', { signal })
  return response.data.map(normalizeLoan)
}

export async function prolongLoan(
  loanId: string,
  daysToProlong: number,
  signal?: AbortSignal,
): Promise<Loan | null> {
  const response = await client.put<LoanApi | ''>(
    `/v1/loans/${loanId}`,
    { daysToProlong },
    { signal },
  )
  const data = response.data
  if (!data || typeof data !== 'object') {
    return null
  }
  return normalizeLoan(data)
}

export async function cancelLoan(loanId: string, signal?: AbortSignal): Promise<void> {
  await client.delete(`/v1/loans/${loanId}`, { signal })
}

export type CreateLoanPayload = {
  userId: string
  bookId: string
}

export async function createLoan(
  payload: CreateLoanPayload,
  signal?: AbortSignal,
): Promise<Loan | null> {
  const response = await client.post<LoanApi | ''>('/v1/loans', payload, { signal })
  const data = response.data
  if (!data || typeof data !== 'object') {
    return null
  }
  return normalizeLoan(data)
}
