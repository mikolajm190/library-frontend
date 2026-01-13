import client from './client'
import type { BookListResponse } from '../schemas/book.schema'

export type GetBooksParams = {
  page?: number
  size?: number
}

export async function getBooks(
  params: GetBooksParams = {},
  signal?: AbortSignal,
): Promise<BookListResponse> {
  const query: Record<string, number> = {}
  if (params.page !== undefined) {
    query.page = params.page
  }
  if (params.size !== undefined) {
    query.size = params.size
  }

  const response = await client.get<BookListResponse>('/v1/books', {
    params: Object.keys(query).length > 0 ? query : undefined,
    signal,
  })

  return response.data
}
