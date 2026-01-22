import type { GetBooksParams } from './books.api'
import type { GetLoansParams } from './loans.api'
import type { GetReservationsParams } from './reservations.api'
import type { GetUsersParams } from './users.api'

export const queryKeys = {
  books: (params?: GetBooksParams) => {
    if (!params) {
      return ['books'] as const
    }
    return [
      'books',
      params.page ?? null,
      params.size ?? null,
      params.sortBy ?? null,
      params.sortOrder ?? null,
    ] as const
  },
  loans: (params?: GetLoansParams) => {
    if (!params) {
      return ['loans'] as const
    }
    return [
      'loans',
      params.page ?? null,
      params.size ?? null,
      params.sortBy ?? null,
      params.sortOrder ?? null,
    ] as const
  },
  reservations: (params?: GetReservationsParams) => {
    if (!params) {
      return ['reservations'] as const
    }
    return [
      'reservations',
      params.page ?? null,
      params.size ?? null,
      params.sortBy ?? null,
      params.sortOrder ?? null,
    ] as const
  },
  users: (params?: GetUsersParams) => {
    if (!params) {
      return ['users'] as const
    }
    return [
      'users',
      params.page ?? null,
      params.size ?? null,
      params.sortBy ?? null,
      params.sortOrder ?? null,
    ] as const
  },
} as const
