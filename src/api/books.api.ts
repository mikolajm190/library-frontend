import client from './client'
import type { Book, BookListResponse } from '../schemas/book.schema'

export type GetBooksParams = {
  page?: number
  size?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function getBooks(
  params: GetBooksParams = {},
  signal?: AbortSignal,
): Promise<BookListResponse> {
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

  const response = await client.get<BookListResponse>('/v1/books', {
    params: Object.keys(query).length > 0 ? query : undefined,
    signal,
  })

  return response.data
}

export type CreateBookPayload = {
  title: string
  author: string
  totalCopies: number
}

export type UpdateBookPayload = {
  title: string
  author: string
}

export async function createBook(
  payload: CreateBookPayload,
  signal?: AbortSignal,
): Promise<Book | null> {
  const response = await client.post<Book | ''>('/v1/books', payload, { signal })
  const data = response.data
  if (!data || typeof data !== 'object') {
    return null
  }
  return data
}

export async function updateBook(
  bookId: string,
  payload: UpdateBookPayload,
  signal?: AbortSignal,
): Promise<Book | null> {
  const response = await client.put<Book | ''>(`/v1/books/${bookId}`, payload, { signal })
  const data = response.data
  if (!data || typeof data !== 'object') {
    return null
  }
  return data
}

export async function deleteBook(bookId: string, signal?: AbortSignal): Promise<void> {
  await client.delete(`/v1/books/${bookId}`, { signal })
}
