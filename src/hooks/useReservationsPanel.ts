import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLoan } from '../api/loans.api'
import {
  createReservation,
  deleteExpiredReservations,
  deleteReservation,
  expireReservations,
  getReservations,
} from '../api/reservations.api'
import { getApiErrorMessage } from '../api/apiError'
import { queryKeys } from '../api/queryKeys'
import type { Reservation } from '../schemas/reservation.schema'

type UseReservationsPanelOptions = {
  size?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

type UseReservationsPanelResult = {
  reservations: Reservation[]
  isLoading: boolean
  loadError: string | null
  refetch: () => void
  page: number
  isLastPage: boolean
  goPrev: () => void
  goNext: () => void
  actionError: string | null
  actionSuccess: string | null
  isCreating: boolean
  createReservation: (payload: { userId: string; bookId: string }) => Promise<boolean>
  isExpiring: boolean
  expireReservations: () => Promise<boolean>
  isProcessing: boolean
  processReservations: () => Promise<boolean>
  isCancelling: boolean
  cancellingReservationId: string | null
  cancelReservation: (reservationId: string) => Promise<boolean>
  isCreatingLoan: boolean
  creatingLoanReservationId: string | null
  createLoanFromReservation: (reservation: Reservation) => Promise<boolean>
}

const DEFAULT_SORT_BY = 'createdAt'
const DEFAULT_SORT_ORDER = 'desc'

export default function useReservationsPanel({
  size = 10,
  sortBy = DEFAULT_SORT_BY,
  sortOrder = DEFAULT_SORT_ORDER,
}: UseReservationsPanelOptions = {}): UseReservationsPanelResult {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [cancellingReservationId, setCancellingReservationId] = useState<string | null>(null)
  const [creatingLoanReservationId, setCreatingLoanReservationId] = useState<string | null>(null)

  useEffect(() => {
    setPage(0)
  }, [sortBy, sortOrder])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.reservations({
      page,
      size,
      sortBy,
      sortOrder,
    }),
    queryFn: ({ signal }) =>
      getReservations({ page, size, sortBy, sortOrder }, signal),
  })

  const reservations = data ?? []
  const loadError = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load reservations'
    : null
  const isLastPage = !isLoading && reservations.length < size

  const cancelMutation = useMutation({
    mutationFn: (reservationId: string, { signal }) => deleteReservation(reservationId, signal),
    onMutate: async (reservationId) => {
      const queryKey = queryKeys.reservations({
        page,
        size,
        sortBy,
        sortOrder,
      })
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Reservation[]>(queryKey)
      if (previous) {
        queryClient.setQueryData<Reservation[]>(queryKey, (current) =>
          current?.filter((reservation) => reservation.id !== reservationId),
        )
      }
      return { previous, queryKey }
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous)
      }
      setActionError(getApiErrorMessage(err, 'Failed to cancel reservation'))
    },
    onSuccess: () => {
      setActionSuccess('Reservation canceled.')
      void queryClient.invalidateQueries({ queryKey: queryKeys.books() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
    },
    onSettled: () => {
      setCancellingReservationId(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
    },
  })

  const createLoanMutation = useMutation({
    mutationFn: (
      {
        userId,
        bookId,
      }: { userId: string; bookId: string },
      { signal },
    ) => createLoan({ userId, bookId }, signal),
    onError: (err) => {
      setActionError(getApiErrorMessage(err, 'Failed to create loan from reservation'))
    },
    onSuccess: () => {
      setActionSuccess('Loan created from reservation.')
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.books() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
    },
    onSettled: () => {
      setCreatingLoanReservationId(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
    },
  })

  const createMutation = useMutation({
    mutationFn: (payload: { userId: string; bookId: string }, { signal }) =>
      createReservation(payload, signal),
    onError: (err) => {
      setActionError(getApiErrorMessage(err, 'Failed to create reservation'))
    },
    onSuccess: () => {
      setActionSuccess('Reservation created.')
      setPage(0)
      void queryClient.invalidateQueries({ queryKey: queryKeys.books() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
    },
  })

  const processMutation = useMutation({
    mutationFn: (_: void, { signal }) => deleteExpiredReservations(signal),
    onError: (err) => {
      setActionError(getApiErrorMessage(err, 'Failed to remove expired reservations'))
    },
    onSuccess: () => {
      setActionSuccess('Expired reservations removed.')
      void queryClient.invalidateQueries({ queryKey: queryKeys.books() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
    },
  })

  const expireMutation = useMutation({
    mutationFn: (_: void, { signal }) => expireReservations(signal),
    onError: (err) => {
      setActionError(getApiErrorMessage(err, 'Failed to mark reservations as expired'))
    },
    onSuccess: (updated) => {
      const suffix = updated === 1 ? 'reservation' : 'reservations'
      setActionSuccess(`Marked ${updated} ${suffix} as expired.`)
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
    },
  })

  const cancelReservationEntry = async (reservationId: string): Promise<boolean> => {
    if (cancelMutation.isPending) {
      return false
    }
    setCancellingReservationId(reservationId)
    setActionError(null)
    setActionSuccess(null)
    try {
      await cancelMutation.mutateAsync(reservationId)
      return true
    } catch {
      setCancellingReservationId(null)
      return false
    }
  }

  const createLoanFromReservationEntry = async (reservation: Reservation): Promise<boolean> => {
    if (createLoanMutation.isPending) {
      return false
    }
    setCreatingLoanReservationId(reservation.id)
    setActionError(null)
    setActionSuccess(null)
    try {
      await createLoanMutation.mutateAsync({
        userId: reservation.user.id,
        bookId: reservation.book.id,
      })
      return true
    } catch {
      setCreatingLoanReservationId(null)
      return false
    }
  }

  const createReservationEntry = async (
    payload: { userId: string; bookId: string },
  ): Promise<boolean> => {
    if (createMutation.isPending) {
      return false
    }
    setActionError(null)
    setActionSuccess(null)
    try {
      await createMutation.mutateAsync(payload)
      return true
    } catch {
      return false
    }
  }

  const processReservationsEntry = async (): Promise<boolean> => {
    if (processMutation.isPending) {
      return false
    }
    setActionError(null)
    setActionSuccess(null)
    try {
      await processMutation.mutateAsync()
      return true
    } catch {
      return false
    }
  }

  const expireReservationsEntry = async (): Promise<boolean> => {
    if (expireMutation.isPending) {
      return false
    }
    setActionError(null)
    setActionSuccess(null)
    try {
      await expireMutation.mutateAsync()
      return true
    } catch {
      return false
    }
  }

  const goPrev = () => setPage((current) => Math.max(0, current - 1))
  const goNext = () => setPage((current) => current + 1)

  return {
    reservations,
    isLoading,
    loadError,
    refetch,
    page,
    isLastPage,
    goPrev,
    goNext,
    actionError,
    actionSuccess,
    isCreating: createMutation.isPending,
    createReservation: createReservationEntry,
    isExpiring: expireMutation.isPending,
    expireReservations: expireReservationsEntry,
    isProcessing: processMutation.isPending,
    processReservations: processReservationsEntry,
    isCancelling: cancelMutation.isPending,
    cancellingReservationId,
    cancelReservation: cancelReservationEntry,
    isCreatingLoan: createLoanMutation.isPending,
    creatingLoanReservationId,
    createLoanFromReservation: createLoanFromReservationEntry,
  }
}
