import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createBook,
  deleteBook,
  getBooks,
  updateBook,
  type CreateBookPayload,
  type UpdateBookPayload,
} from '../api/books.api'
import { getApiErrorMessage } from '../api/apiError'
import { queryKeys } from '../api/queryKeys'
import type { Book } from '../schemas/book.schema'

type UseBooksAdminOptions = {
  size?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

type UseBooksAdminResult = {
  books: Book[]
  isLoading: boolean
  loadError: string | null
  refetch: () => void
  page: number
  isLastPage: boolean
  goPrev: () => void
  goNext: () => void
  resetPage: () => void
  actionError: string | null
  actionSuccess: string | null
  isCreating: boolean
  createBook: (payload: CreateBookPayload) => Promise<boolean>
  isUpdating: boolean
  updatingBookId: string | null
  updateBook: (bookId: string, payload: UpdateBookPayload) => Promise<boolean>
  isDeleting: boolean
  deletingBookId: string | null
  deleteBook: (bookId: string) => Promise<boolean>
}

const DEFAULT_SORT_BY = 'title'
const DEFAULT_SORT_ORDER = 'asc'

export default function useBooksAdmin({
  size = 10,
  sortBy = DEFAULT_SORT_BY,
  sortOrder = DEFAULT_SORT_ORDER,
}: UseBooksAdminOptions = {}): UseBooksAdminResult {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [updatingBookId, setUpdatingBookId] = useState<string | null>(null)
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.books({ page, size, sortBy, sortOrder }),
    queryFn: ({ signal }) => getBooks({ page, size, sortBy, sortOrder }, signal),
  })

  const books = data ?? []
  const loadError = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load books'
    : null
  const isLastPage = !isLoading && books.length < size

  const createMutation = useMutation({
    mutationFn: (payload: CreateBookPayload, { signal }) => createBook(payload, signal),
    onSuccess: () => {
      setActionSuccess('Book created.')
      setPage(0)
      void queryClient.invalidateQueries({ queryKey: queryKeys.books() })
    },
    onError: (err) => setActionError(getApiErrorMessage(err, 'Failed to create book.')),
  })

  const updateMutation = useMutation({
    mutationFn: (
      { bookId, payload }: { bookId: string; payload: UpdateBookPayload },
      { signal },
    ) => updateBook(bookId, payload, signal),
    onMutate: async ({ bookId, payload }) => {
      const queryKey = queryKeys.books({ page, size, sortBy, sortOrder })
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<typeof books>(queryKey)
      queryClient.setQueryData<typeof books>(queryKey, (current) =>
        current?.map((book) => (book.id === bookId ? { ...book, ...payload } : book)),
      )
      return { previous, queryKey }
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous)
      }
      setActionError(getApiErrorMessage(err, 'Failed to update book.'))
    },
    onSuccess: () => {
      setActionSuccess('Book updated.')
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
    },
    onSettled: () => {
      setUpdatingBookId(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.books() })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (bookId: string, { signal }) => deleteBook(bookId, signal),
    onMutate: async (bookId) => {
      const queryKey = queryKeys.books({ page, size, sortBy, sortOrder })
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<typeof books>(queryKey)
      queryClient.setQueryData<typeof books>(queryKey, (current) =>
        current?.filter((book) => book.id !== bookId),
      )
      return { previous, queryKey }
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous)
      }
      setActionError(getApiErrorMessage(err, 'Failed to delete book.'))
    },
    onSuccess: () => {
      setActionSuccess('Book deleted.')
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
    },
    onSettled: () => {
      setDeletingBookId(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.books() })
    },
  })

  const createBookEntry = async (payload: CreateBookPayload): Promise<boolean> => {
    if (createMutation.isPending) {
      return false
    }
    setActionError(null)
    setActionSuccess(null)
    try {
      await createMutation.mutateAsync(payload)
      return true
    } catch {
      return false
    }
  }

  const updateBookEntry = async (
    bookId: string,
    payload: UpdateBookPayload,
  ): Promise<boolean> => {
    if (updateMutation.isPending) {
      return false
    }
    setUpdatingBookId(bookId)
    setActionError(null)
    setActionSuccess(null)
    try {
      await updateMutation.mutateAsync({ bookId, payload })
      return true
    } catch {
      setUpdatingBookId(null)
      return false
    }
  }

  const deleteBookEntry = async (bookId: string): Promise<boolean> => {
    if (deleteMutation.isPending) {
      return false
    }
    setDeletingBookId(bookId)
    setActionError(null)
    setActionSuccess(null)
    try {
      await deleteMutation.mutateAsync(bookId)
      return true
    } catch {
      setDeletingBookId(null)
      return false
    }
  }

  const goPrev = () => setPage((current) => Math.max(0, current - 1))
  const goNext = () => setPage((current) => current + 1)
  const resetPage = () => setPage(0)

  return {
    books,
    isLoading,
    loadError,
    refetch,
    page,
    isLastPage,
    goPrev,
    goNext,
    resetPage,
    actionError,
    actionSuccess,
    isCreating: createMutation.isPending,
    createBook: createBookEntry,
    isUpdating: updateMutation.isPending,
    updatingBookId,
    updateBook: updateBookEntry,
    isDeleting: deleteMutation.isPending,
    deletingBookId,
    deleteBook: deleteBookEntry,
  }
}
