import { useState } from 'react'
import type { Book } from '../../schemas/book.schema'

type BookRowProps = {
  book: Book
  onUpdate: (bookId: string, payload: { title: string; author: string }) => Promise<boolean>
  onDelete: (bookId: string) => Promise<boolean>
  isUpdating: boolean
  isDeleting: boolean
}

export default function BookRow({ book, onUpdate, onDelete, isUpdating, isDeleting }: BookRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)

  const handleSave = async () => {
    const success = await onUpdate(book.id, { title: title.trim(), author: author.trim() })
    if (success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setTitle(book.title)
    setAuthor(book.author)
    setIsEditing(false)
  }

  return (
    <li className="rounded-2xl border border-black/10 bg-white/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={isUpdating || isDeleting}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
              />
              <input
                type="text"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                disabled={isUpdating || isDeleting}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
              />
            </div>
          ) : (
            <>
              <p className="text-base font-semibold text-[color:var(--ink)]">{book.title}</p>
              <p className="text-xs text-[color:var(--ink-muted)]">{book.author}</p>
            </>
          )}
        </div>
        <div className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-xs text-[color:var(--ink)] shadow-sm">
          <p className="uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">Availability</p>
          <p className="mt-1 text-sm font-semibold">{book.availableCopies} available</p>
          <p className="mt-1 text-xs text-[color:var(--ink-muted)]">{book.copiesOnLoan} on loan</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={isUpdating || isDeleting}
              className="rounded-full border border-black/10 bg-[color:var(--ink)] px-3 py-1 text-xs font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdating || isDeleting}
              className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isUpdating || isDeleting}
              className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(book.id)}
              disabled={isUpdating || isDeleting}
              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        )}
      </div>
    </li>
  )
}
