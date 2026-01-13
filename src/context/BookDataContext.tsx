import { createContext } from 'react'
import type { Book } from '../schemas/book.schema'

export type BookDataContextValue = {
  books: Book[]
  isLoading: boolean
  error: string | null
  actionError: string | null
  actionSuccess: string | null
  isCreating: boolean
  isUpdating: boolean
  updatingBookId: string | null
  isDeleting: boolean
  deletingBookId: string | null
  page: number
  size: number
  setPage: (page: number) => void
  setSize: (size: number) => void
  reload: () => void
  createBook: (payload: { title: string; author: string; availableCopies: number }) => Promise<boolean>
  updateBook: (bookId: string, payload: { title: string; author: string }) => Promise<boolean>
  deleteBook: (bookId: string) => Promise<boolean>
}

export const BookDataContext = createContext<BookDataContextValue | undefined>(undefined)
