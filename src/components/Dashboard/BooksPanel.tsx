import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { createBook, deleteBook, getBooks, updateBook } from '../../api/books.api'
import DashboardPanel from './DashboardPanel'
import BookList from './BookList'

export default function BooksPanel() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const size = 10
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [availableCopies, setAvailableCopies] = useState(1)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [updatingBookId, setUpdatingBookId] = useState<string | null>(null)
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['books', page, size],
    queryFn: ({ signal }) => getBooks({ page, size }, signal),
  })

  const books = data ?? []
  const loadError = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load books'
    : null
  const isLastPage = !isLoading && books.length < size

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

  const createMutation = useMutation({
    mutationFn: (payload: { title: string; author: string; availableCopies: number }, { signal }) =>
      createBook(payload, signal),
    onSuccess: () => {
      setActionSuccess('Book created.')
      setPage(0)
      void queryClient.invalidateQueries({ queryKey: ['books'] })
    },
    onError: (err) => handleAxiosError(err, 'Failed to create book.'),
  })

  const updateMutation = useMutation({
    mutationFn: (
      { bookId, payload }: { bookId: string; payload: { title: string; author: string } },
      { signal },
    ) => updateBook(bookId, payload, signal),
    onMutate: async ({ bookId, payload }) => {
      const queryKey = ['books', page, size]
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
      handleAxiosError(err, 'Failed to update book.')
    },
    onSuccess: () => {
      setActionSuccess('Book updated.')
      void queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
    onSettled: () => {
      setUpdatingBookId(null)
      void queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (bookId: string, { signal }) => deleteBook(bookId, signal),
    onMutate: async (bookId) => {
      const queryKey = ['books', page, size]
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
      handleAxiosError(err, 'Failed to delete book.')
    },
    onSuccess: () => {
      setActionSuccess('Book deleted.')
      void queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
    onSettled: () => {
      setDeletingBookId(null)
      void queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (createMutation.isPending) {
      return
    }
    setActionError(null)
    setActionSuccess(null)
    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        author: author.trim(),
        availableCopies,
      })
      setTitle('')
      setAuthor('')
      setAvailableCopies(1)
    } catch {
      return
    }
  }

  const handleUpdate = async (
    bookId: string,
    payload: { title: string; author: string },
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

  const handleDelete = async (bookId: string): Promise<boolean> => {
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

  return (
    <DashboardPanel
      title="Books"
      description="Keep the catalog up to date."
      className="flex flex-col lg:h-[clamp(34rem,70vh,44rem)]"
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
            Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              disabled={createMutation.isPending}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
            Author
            <input
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              required
              disabled={createMutation.isPending}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
            Available copies
            <input
              type="number"
              min={1}
              value={availableCopies}
              onChange={(event) => setAvailableCopies(Number(event.target.value))}
              required
              disabled={createMutation.isPending}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="mt-4 rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-xs font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createMutation.isPending ? 'Creating...' : 'Add book'}
        </button>
      </form>

      {isLoading && (
        <p className="text-sm text-[color:var(--ink-muted)]">Loading books...</p>
      )}
      {loadError && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-amber-700">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            Retry
          </button>
        </div>
      )}
      {actionError && !loadError && <p className="text-sm text-amber-700">{actionError}</p>}
      {actionSuccess && !loadError && <p className="text-sm text-emerald-700">{actionSuccess}</p>}
      <div className="mt-4 max-h-[420px] overflow-y-auto pr-2 lg:flex-1 lg:min-h-0 lg:max-h-none">
        {!isLoading && !loadError && books.length === 0 && (
          <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-[color:var(--ink-muted)]">
            No books found.
          </div>
        )}
        {!isLoading && !loadError && books.length > 0 && (
          <BookList
            books={books}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isUpdating={updateMutation.isPending}
            updatingBookId={updatingBookId}
            isDeleting={deleteMutation.isPending}
            deletingBookId={deletingBookId}
          />
        )}
      </div>

      {!loadError && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--ink-muted)]">
          <button
            type="button"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={isLoading || page === 0}
            className="rounded-full border border-black/10 bg-white/80 px-3 py-1 font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <span>
            Page <span className="font-semibold text-[color:var(--ink)]">{page + 1}</span>
          </span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={isLoading || isLastPage}
            className="rounded-full border border-black/10 bg-white/80 px-3 py-1 font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      )}
    </DashboardPanel>
  )
}
