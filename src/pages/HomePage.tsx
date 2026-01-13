import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import BookGrid from '../components/Home/BookGrid'
import HomeHero from '../components/Home/HomeHero'
import useBorrowBook from '../hooks/useBorrowBook'
import useBooks from '../hooks/useBooks'

export default function HomePage() {
  const { books, isLoading, error, reload } = useBooks({ size: 20 })
  const { borrowBook, error: borrowError, isBorrowing, borrowingBookId } = useBorrowBook()

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <Header />
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
      <Footer />
    </main>
  )
}
