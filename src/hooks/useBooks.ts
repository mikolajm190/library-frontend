import { useQuery } from '@tanstack/react-query'
import { getBooks } from '../api/books.api'
import type { Book } from '../schemas/book.schema'

type UseBooksParams = {
  page?: number
  size?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

type UseBooksResult = {
  books: Book[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export default function useBooks({
  page,
  size = 20,
  sortBy,
  sortOrder,
}: UseBooksParams = {}): UseBooksResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['books', page, size, sortBy ?? null, sortOrder ?? null],
    queryFn: ({ signal }) => getBooks({ page, size, sortBy, sortOrder }, signal),
  })

  const loadError = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load books'
    : null

  const reload = () => {
    void refetch()
  }

  return { books: data ?? [], isLoading, error: loadError, reload }
}
