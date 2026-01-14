import PageShell from '../components/Layout/PageShell'
import BookGrid from '../components/Home/BookGrid'
import HomeHero from '../components/Home/HomeHero'
import useBorrowBook from '../hooks/useBorrowBook'
import useBooks from '../hooks/useBooks'

export default function HomePage() {
  const { books, isLoading, error, reload } = useBooks({ size: 20 })
  const { borrowBook, error: borrowError, isBorrowing, borrowingBookId } = useBorrowBook()

  return (
    <PageShell>
      <HomeHero />
      <BookGrid
        books={books}
        isLoading={isLoading}
        error={error}
        borrowError={borrowError}
        onRetry={reload}
        onBorrow={(book) => borrowBook(book.id, reload)}
        isBorrowing={isBorrowing}
        borrowingBookId={borrowingBookId}
      />
    </PageShell>
  )
}
