import type { GetBooksParams } from './books.api'
import type { GetUsersParams } from './users.api'

export const queryKeys = {
  books: (params?: GetBooksParams) => [
    'books',
    params?.page ?? null,
    params?.size ?? null,
    params?.sortBy ?? null,
    params?.sortOrder ?? null,
  ],
  loans: () => ['loans'],
  users: (params?: GetUsersParams) => [
    'users',
    params?.page ?? null,
    params?.size ?? null,
    params?.sortBy ?? null,
    params?.sortOrder ?? null,
  ],
} as const
