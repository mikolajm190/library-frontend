import { useEffect, useState } from 'react'
import Header from './components/Header/Header'
import BookCard from './components/Home/BookCard'
import type { Book } from './schemas/book.schema'

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadBooks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/v1/books?size=20', {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Failed to load books (${response.status})`)
        }
        const data = (await response.json()) as Book[]
        setBooks(data)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to load books')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadBooks()

    return () => controller.abort()
  }, [])

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <Header />

      <section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading && (
          <p className="col-span-full text-sm text-[color:var(--ink-muted)]">Loading books...</p>
        )}
        {error && (
          <p className="col-span-full text-sm text-amber-700">{error}</p>
        )}
        {!isLoading &&
          !error &&
          books.map((book) => (
            <BookCard key={book.id} book={book} onBorrow={(selected) => console.log(selected)} />
          ))}
      </section>
    </main>
  )
}

export default App
