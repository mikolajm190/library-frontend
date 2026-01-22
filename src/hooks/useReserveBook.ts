import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { createReservation } from '../api/reservations.api'
import { getMe } from '../api/users.api'
import { getApiErrorMessage } from '../api/apiError'
import { queryKeys } from '../api/queryKeys'
import { useAuth } from './useAuth'

type UseReserveBookResult = {
  reserveBook: (bookId: string, onSuccess?: () => void | Promise<void>) => Promise<void>
  isReserving: boolean
  reservingBookId: string | null
  error: string | null
  errorBookId: string | null
}

export default function useReserveBook(): UseReserveBookResult {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [errorBookId, setErrorBookId] = useState<string | null>(null)
  const [isReserving, setIsReserving] = useState(false)
  const [reservingBookId, setReservingBookId] = useState<string | null>(null)

  const reserveBook = async (bookId: string, onSuccess?: () => void | Promise<void>) => {
    if (isReserving) {
      return
    }

    if (!isAuthenticated) {
      setError(null)
      setErrorBookId(null)
      navigate('/login', { state: { from: location } })
      return
    }

    try {
      setIsReserving(true)
      setReservingBookId(bookId)
      setError(null)
      setErrorBookId(null)
      const user = await getMe()
      await createReservation({ userId: user.id, bookId })
      if (onSuccess) {
        await onSuccess()
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
      await queryClient.invalidateQueries({ queryKey: queryKeys.books() })
      navigate('/dashboard')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to reserve book.'))
      setErrorBookId(bookId)
    } finally {
      setIsReserving(false)
      setReservingBookId(null)
    }
  }

  return { reserveBook, isReserving, reservingBookId, error, errorBookId }
}
