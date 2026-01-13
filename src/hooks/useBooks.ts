import { useEffect, useState } from 'react'
import axios from 'axios'
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
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const loadBooks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getBooks({ page, size, sortBy, sortOrder }, controller.signal)
        setBooks(data)
      } catch (err) {
        if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') {
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to load books')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadBooks()

    return () => controller.abort()
  }, [page, size, sortBy, sortOrder, reloadToken])

  const reload = () => {
    setReloadToken((value) => value + 1)
  }

  return { books, isLoading, error, reload }
}
