import BookCard from './BookCard'
import type { Book } from '../../schemas/book.schema'

type BookGridProps = {
  books: Book[]
  isLoading: boolean
  error: string | null
  borrowError: string | null
  onRetry: () => void
  onBorrow: (book: Book) => void
  isBorrowing: boolean
  borrowingBookId: string | null
}

export default function BookGrid({
  books,
  isLoading,
  error,
  borrowError,
  onRetry,
  onBorrow,
  isBorrowing,
  borrowingBookId,
}: BookGridProps) {
  return (
    <section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {isLoading && (
        <p className="col-span-full text-sm text-[color:var(--ink-muted)]">Loading books...</p>
      )}
      {error && (
        <div className="col-span-full flex flex-wrap items-center gap-3 text-sm text-amber-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            Retry
          </button>
        </div>
      )}
      {borrowError && !error && (
        <p className="col-span-full text-sm text-amber-700">{borrowError}</p>
      )}
      {!isLoading &&
        !error &&
        books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onBorrow={onBorrow}
            isBorrowing={isBorrowing && borrowingBookId === book.id}
          />
        ))}
    </section>
  )
}
