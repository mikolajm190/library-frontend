import { useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBooks } from '../../../api/books.api'
import { getUsers } from '../../../api/users.api'
import { getApiErrorMessage } from '../../../api/apiError'
import { queryKeys } from '../../../api/queryKeys'
import type { Book } from '../../../schemas/book.schema'
import type { User } from '../../../schemas/user.schema'

type LoanCreateFormProps = {
  isSubmitting: boolean
  onCreate: (payload: { userId: string; bookId: string }) => Promise<boolean>
}

const LOOKUP_SIZE = 100

export default function LoanCreateForm({ isSubmitting, onCreate }: LoanCreateFormProps) {
  const [username, setUsername] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const usersQuery = useQuery({
    queryKey: queryKeys.users({
      page: 0,
      size: LOOKUP_SIZE,
      sortBy: 'username',
      sortOrder: 'asc',
    }),
    queryFn: ({ signal }) =>
      getUsers({ page: 0, size: LOOKUP_SIZE, sortBy: 'username', sortOrder: 'asc' }, signal),
  })

  const booksQuery = useQuery({
    queryKey: queryKeys.books({
      page: 0,
      size: LOOKUP_SIZE,
      sortBy: 'title',
      sortOrder: 'asc',
    }),
    queryFn: ({ signal }) =>
      getBooks({ page: 0, size: LOOKUP_SIZE, sortBy: 'title', sortOrder: 'asc' }, signal),
  })

  const users = usersQuery.data ?? []
  const books = booksQuery.data ?? []
  const userLoadError = usersQuery.error
    ? getApiErrorMessage(usersQuery.error, 'Failed to load users.')
    : null
  const bookLoadError = booksQuery.error
    ? getApiErrorMessage(booksQuery.error, 'Failed to load books.')
    : null
  const loadError = userLoadError || bookLoadError
  const isLoading = usersQuery.isLoading || booksQuery.isLoading
  const statusMessage = formError || loadError

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    if (loadError) {
      return
    }

    const normalizedUsername = username.trim().toLowerCase()
    const normalizedTitle = bookTitle.trim().toLowerCase()
    if (!normalizedUsername || !normalizedTitle) {
      setFormError('Username and book title are required.')
      return
    }

    const matchedUser = users.find(
      (user: User) => user.username.toLowerCase() === normalizedUsername,
    )
    if (!matchedUser) {
      setFormError(`User "${username.trim()}" not found.`)
      return
    }

    const matchedBook = books.find(
      (book: Book) => book.title.toLowerCase() === normalizedTitle,
    )
    if (!matchedBook) {
      setFormError(`Book "${bookTitle.trim()}" not found.`)
      return
    }

    const success = await onCreate({ userId: matchedUser.id, bookId: matchedBook.id })
    if (success) {
      setUsername('')
      setBookTitle('')
      setFormError(null)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
              setFormError(null)
            }}
            required
            disabled={isSubmitting}
            list="loan-user-options"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
          Book title
          <input
            type="text"
            value={bookTitle}
            onChange={(event) => {
              setBookTitle(event.target.value)
              setFormError(null)
            }}
            required
            disabled={isSubmitting}
            list="loan-book-options"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </label>
      </div>
      <datalist id="loan-user-options">
        {users.map((user) => (
          <option key={user.id} value={user.username} />
        ))}
      </datalist>
      <datalist id="loan-book-options">
        {books.map((book) => (
          <option key={book.id} value={book.title} />
        ))}
      </datalist>
      {statusMessage && <p className="mt-3 text-xs text-amber-700">{statusMessage}</p>}
      <button
        type="submit"
        disabled={isSubmitting || isLoading || Boolean(loadError)}
        className="mt-4 rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-xs font-semibold text-[color:var(--paper)] shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Creating...' : isLoading ? 'Loading...' : 'Create loan'}
      </button>
    </form>
  )
}
