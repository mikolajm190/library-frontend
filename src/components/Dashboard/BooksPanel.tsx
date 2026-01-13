import { useState, type FormEvent } from 'react'
import DashboardPanel from './DashboardPanel'
import BookList from './BookList'
import useBookData from '../../hooks/useBookData'

export default function BooksPanel() {
  const {
    books,
    isLoading,
    error,
    actionError,
    actionSuccess,
    isCreating,
    createBook,
    updateBook,
    deleteBook,
    isUpdating,
    updatingBookId,
    isDeleting,
    deletingBookId,
    page,
    size,
    setPage,
    reload,
  } = useBookData()
  const isLastPage = !isLoading && books.length < size
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [availableCopies, setAvailableCopies] = useState(1)

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const success = await createBook({
      title: title.trim(),
      author: author.trim(),
      availableCopies,
    })
    if (success) {
      setTitle('')
      setAuthor('')
      setAvailableCopies(1)
    }
  }

  return (
    <DashboardPanel title="Books" description="Keep the catalog up to date.">
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
              disabled={isCreating}
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
              disabled={isCreating}
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
              disabled={isCreating}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className="mt-4 rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-xs font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating ? 'Creating...' : 'Add book'}
        </button>
      </form>

      {isLoading && (
        <p className="text-sm text-[color:var(--ink-muted)]">Loading books...</p>
      )}
      {error && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-amber-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={reload}
            className="rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            Retry
          </button>
        </div>
      )}
      {actionError && !error && <p className="text-sm text-amber-700">{actionError}</p>}
      {actionSuccess && !error && <p className="text-sm text-emerald-700">{actionSuccess}</p>}
      <div className="mt-4 max-h-[420px] overflow-y-auto pr-2">
        {!isLoading && !error && books.length === 0 && (
          <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-[color:var(--ink-muted)]">
            No books found.
          </div>
        )}
        {!isLoading && !error && books.length > 0 && (
          <BookList
            books={books}
            onUpdate={updateBook}
            onDelete={deleteBook}
            isUpdating={isUpdating}
            updatingBookId={updatingBookId}
            isDeleting={isDeleting}
            deletingBookId={deletingBookId}
          />
        )}
      </div>

      {!error && (
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
