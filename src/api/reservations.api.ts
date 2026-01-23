import client from './client'
import type { Reservation, ReservationListResponse } from '../schemas/reservation.schema'

type ReservationApi = Omit<Reservation, 'createdAt' | 'expiresAt'> & {
  createdAt: string
  expiresAt: string
}

const normalizeReservation = (reservation: ReservationApi): Reservation => ({
  ...reservation,
  createdAt: new Date(reservation.createdAt),
  expiresAt: new Date(reservation.expiresAt),
})

export type GetReservationsParams = {
  page?: number
  size?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function getReservations(
  params: GetReservationsParams = {},
  signal?: AbortSignal,
): Promise<ReservationListResponse> {
  const query: Record<string, number | string> = {}
  if (params.page !== undefined) {
    query.page = params.page
  }
  if (params.size !== undefined) {
    query.size = params.size
  }
  if (params.sortBy) {
    query.sortBy = params.sortBy
  }
  if (params.sortOrder) {
    query.sortOrder = params.sortOrder
  }

  const response = await client.get<ReservationApi[]>('/v1/reservations', {
    params: Object.keys(query).length > 0 ? query : undefined,
    signal,
  })

  return response.data.map(normalizeReservation)
}

export async function getReservation(
  reservationId: string,
  signal?: AbortSignal,
): Promise<Reservation> {
  const response = await client.get<ReservationApi>(`/v1/reservations/${reservationId}`, { signal })
  return normalizeReservation(response.data)
}

export type CreateReservationPayload = {
  userId: string
  bookId: string
}

export async function createReservation(
  payload: CreateReservationPayload,
  signal?: AbortSignal,
): Promise<Reservation | null> {
  const response = await client.post<ReservationApi | ''>('/v1/reservations', payload, { signal })
  const data = response.data
  if (!data || typeof data !== 'object') {
    return null
  }
  return normalizeReservation(data)
}

export async function deleteReservation(
  reservationId: string,
  signal?: AbortSignal,
): Promise<void> {
  await client.delete(`/v1/reservations/${reservationId}`, { signal })
}

export async function deleteExpiredReservations(signal?: AbortSignal): Promise<void> {
  await client.delete('/v1/reservations/expired', { signal })
}

type ExpireReservationsResponse = {
  updated: number
}

export async function expireReservations(signal?: AbortSignal): Promise<number> {
  const response = await client.post<ExpireReservationsResponse>('/v1/reservations/expire', null, {
    signal,
  })
  return response.data.updated
}
