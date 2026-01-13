import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { createLoan } from '../api/loans.api'
import { getMe } from '../api/users.api'
import { useAuth } from './useAuth'

type UseBorrowBookResult = {
  borrowBook: (bookId: string, onSuccess?: () => void | Promise<void>) => Promise<void>
  isBorrowing: boolean
  borrowingBookId: string | null
  error: string | null
}

export default function useBorrowBook(): UseBorrowBookResult {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const [isBorrowing, setIsBorrowing] = useState(false)
  const [borrowingBookId, setBorrowingBookId] = useState<string | null>(null)

  const borrowBook = async (bookId: string, onSuccess?: () => void | Promise<void>) => {
    if (isBorrowing) {
      return
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    try {
      setIsBorrowing(true)
      setBorrowingBookId(bookId)
      setError(null)
      const user = await getMe()
      await createLoan({ userId: user.id, bookId })
      if (onSuccess) {
        await onSuccess()
      }
      navigate('/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as { message?: string } | string | undefined
        if (typeof responseData === 'string') {
          setError(responseData)
        } else {
          setError(responseData?.message ?? 'Failed to borrow book.')
        }
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to borrow book.')
    } finally {
      setIsBorrowing(false)
      setBorrowingBookId(null)
    }
  }

  return { borrowBook, isBorrowing, borrowingBookId, error }
}
