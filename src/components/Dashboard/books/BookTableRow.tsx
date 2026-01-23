import { useState } from 'react'
import type { Book } from '../../../schemas/book.schema'
import BookRowActions from './BookRowActions'

type BookTableRowProps = {
  book: Book
  onUpdate: (bookId: string, payload: { title: string; author: string }) => Promise<boolean>
  onDelete: (bookId: string) => Promise<boolean>
  isUpdating: boolean
  isDeleting: boolean
}

export default function BookTableRow({
  book,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: BookTableRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)

  const handleSave = async () => {
    if (!window.confirm('Save changes to this book?')) {
      return
    }
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

  const handleEdit = () => {
    setTitle(book.title)
    setAuthor(book.author)
    setIsEditing(true)
  }

  return (
    <tr className="align-top">
      <td className="px-4 py-4">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isUpdating || isDeleting}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        ) : (
          <p className="text-base font-semibold text-[color:var(--ink)]">{book.title}</p>
        )}
      </td>
      <td className="px-4 py-4">
        {isEditing ? (
          <input
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            disabled={isUpdating || isDeleting}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        ) : (
          <p className="text-xs text-[color:var(--ink-muted)]">{book.author}</p>
        )}
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-[color:var(--ink)]">
        {book.availableCopies}
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-[color:var(--ink)]">
        {book.totalCopies}
      </td>
      <td className="px-4 py-4 text-right">
        <BookRowActions
          isEditing={isEditing}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={() => {
            if (!window.confirm('Delete this book?')) {
              return
            }
            void onDelete(book.id)
          }}
          className="mt-0 justify-end"
        />
      </td>
    </tr>
  )
}
