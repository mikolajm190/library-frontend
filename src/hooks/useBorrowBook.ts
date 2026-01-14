import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { createLoan } from '../api/loans.api'
import { getMe } from '../api/users.api'
import { getApiErrorMessage } from '../api/apiError'
import { queryKeys } from '../api/queryKeys'
import { useAuth } from './useAuth'

type UseBorrowBookResult = {
  borrowBook: (bookId: string, onSuccess?: () => void | Promise<void>) => Promise<void>
  isBorrowing: boolean
  borrowingBookId: string | null
  error: string | null
  errorBookId: string | null
}

export default function useBorrowBook(): UseBorrowBookResult {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [errorBookId, setErrorBookId] = useState<string | null>(null)
  const [isBorrowing, setIsBorrowing] = useState(false)
  const [borrowingBookId, setBorrowingBookId] = useState<string | null>(null)

  const borrowBook = async (bookId: string, onSuccess?: () => void | Promise<void>) => {
    if (isBorrowing) {
      return
    }

    if (!isAuthenticated) {
      setError(null)
      setErrorBookId(null)
      navigate('/login', { state: { from: location } })
      return
    }

    try {
      setIsBorrowing(true)
      setBorrowingBookId(bookId)
      setError(null)
      setErrorBookId(null)
      const user = await getMe()
      await createLoan({ userId: user.id, bookId })
      if (onSuccess) {
        await onSuccess()
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.loans() })
      await queryClient.invalidateQueries({ queryKey: queryKeys.books() })
      navigate('/dashboard')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to borrow book.'))
      setErrorBookId(bookId)
    } finally {
      setIsBorrowing(false)
      setBorrowingBookId(null)
    }
  }

  return { borrowBook, isBorrowing, borrowingBookId, error, errorBookId }
}
