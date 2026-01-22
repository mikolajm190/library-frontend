import PageShell from '../components/Layout/PageShell'
import BookGrid from '../components/Home/BookGrid'
import HomeHero from '../components/Home/HomeHero'
import useReserveBook from '../hooks/useReserveBook'
import useBooks from '../hooks/useBooks'

export default function HomePage() {
  const { books, isLoading, error, reload } = useBooks({ size: 20 })
  const {
    reserveBook,
    error: reserveError,
    errorBookId,
    isReserving,
    reservingBookId,
  } = useReserveBook()

  return (
    <PageShell>
      <HomeHero />
      <BookGrid
        books={books}
        isLoading={isLoading}
        error={error}
        reserveError={reserveError}
        reserveErrorBookId={errorBookId}
        onRetry={reload}
        onReserve={(book) => reserveBook(book.id, reload)}
        isReserving={isReserving}
        reservingBookId={reservingBookId}
      />
    </PageShell>
  )
}
