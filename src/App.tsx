import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import BookCard from './components/Home/BookCard'
import useBooks from './hooks/useBooks'

function App() {
  const { books, isLoading, error, reload } = useBooks({ size: 20 })

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <Header />

      <section className="mx-auto mt-10 w-full max-w-6xl">
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--ink-muted)]">
          Library shelf
        </p>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl text-[color:var(--ink)] sm:text-5xl">
          Discover your next read
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[color:var(--ink-muted)]">
          Check the latest arrivals and see what is ready for checkout.
        </p>
      </section>

      <section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading && (
          <p className="col-span-full text-sm text-[color:var(--ink-muted)]">Loading books...</p>
        )}
        {error && (
          <div className="col-span-full flex flex-wrap items-center gap-3 text-sm text-amber-700">
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
        {!isLoading &&
          !error &&
          books.map((book) => (
            <BookCard key={book.id} book={book} onBorrow={(selected) => console.log(selected)} />
          ))}
      </section>
      <Footer />
    </main>
  )
}

export default App
