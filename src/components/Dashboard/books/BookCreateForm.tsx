import { useState, type FormEvent } from 'react'
import type { CreateBookPayload } from '../../../api/books.api'

type BookCreateFormProps = {
  isSubmitting: boolean
  onCreate: (payload: CreateBookPayload) => Promise<boolean>
}

export default function BookCreateForm({ isSubmitting, onCreate }: BookCreateFormProps) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [totalCopies, setTotalCopies] = useState(1)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    const success = await onCreate({
      title: title.trim(),
      author: author.trim(),
      totalCopies,
    })

    if (success) {
      setTitle('')
      setAuthor('')
      setTotalCopies(1)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
          Total copies
          <input
            type="number"
            min={1}
            max={10}
            step={1}
            value={totalCopies}
            onChange={(event) => setTotalCopies(Number(event.target.value))}
            required
            disabled={isSubmitting}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-xs font-semibold text-[color:var(--paper)] shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Creating...' : 'Add book'}
      </button>
    </form>
  )
}
