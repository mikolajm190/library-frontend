import type { GetBooksParams } from './books.api'
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
  loans: () => ['loans'],
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
