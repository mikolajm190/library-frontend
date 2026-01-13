import { useState, type ReactNode } from 'react'
import axios from 'axios'
import { createBook, deleteBook, updateBook } from '../api/books.api'
import useBooks from '../hooks/useBooks'
import { BookDataContext } from '../context/BookDataContext'

type BookDataProviderProps = {
  children: ReactNode
  onBookChange?: () => void
}

export default function BookDataProvider({ children, onBookChange }: BookDataProviderProps) {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const { books, isLoading, error, reload } = useBooks({ page, size })
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatingBookId, setUpdatingBookId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null)

  const handleAxiosError = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err)) {
      const responseData = err.response?.data as { message?: string } | string | undefined
      if (typeof responseData === 'string') {
        setActionError(responseData)
      } else {
        setActionError(responseData?.message ?? fallback)
      }
      return
    }
    setActionError(err instanceof Error ? err.message : fallback)
  }

  const handleCreate = async (payload: {
    title: string
    author: string
    availableCopies: number
  }): Promise<boolean> => {
    if (isCreating) {
      return false
    }
    try {
      setIsCreating(true)
      setActionError(null)
      setActionSuccess(null)
      await createBook(payload)
      setActionSuccess('Book created.')
      setPage(0)
      reload()
      return true
    } catch (err) {
      handleAxiosError(err, 'Failed to create book.')
      return false
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdate = async (
    bookId: string,
    payload: { title: string; author: string },
  ): Promise<boolean> => {
    if (isUpdating) {
      return false
    }
    try {
      setIsUpdating(true)
      setUpdatingBookId(bookId)
      setActionError(null)
      setActionSuccess(null)
      await updateBook(bookId, payload)
      setActionSuccess('Book updated.')
      reload()
      onBookChange?.()
      return true
    } catch (err) {
      handleAxiosError(err, 'Failed to update book.')
      return false
    } finally {
      setIsUpdating(false)
      setUpdatingBookId(null)
    }
  }

  const handleDelete = async (bookId: string): Promise<boolean> => {
    if (isDeleting) {
      return false
    }
    try {
      setIsDeleting(true)
      setDeletingBookId(bookId)
      setActionError(null)
      setActionSuccess(null)
      await deleteBook(bookId)
      setActionSuccess('Book deleted.')
      reload()
      onBookChange?.()
      return true
    } catch (err) {
      handleAxiosError(err, 'Failed to delete book.')
      return false
    } finally {
      setIsDeleting(false)
      setDeletingBookId(null)
    }
  }

  return (
    <BookDataContext.Provider
      value={{
        books,
        isLoading,
        error,
        actionError,
        actionSuccess,
        isCreating,
        isUpdating,
        updatingBookId,
        isDeleting,
        deletingBookId,
        page,
        size,
        setPage,
        setSize,
        reload,
        createBook: handleCreate,
        updateBook: handleUpdate,
        deleteBook: handleDelete,
      }}
    >
      {children}
    </BookDataContext.Provider>
  )
}
