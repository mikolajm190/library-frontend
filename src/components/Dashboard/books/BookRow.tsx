import { useState } from 'react'
import type { Book } from '../../../schemas/book.schema'
import AvailabilityBadge from './AvailabilityBadge'
import BookDetails from './BookDetails'
import BookEditFields from './BookEditFields'
import BookRowActions from './BookRowActions'

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
    <li className="rounded-2xl border border-black/10 bg-white/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {isEditing ? (
            <BookEditFields
              title={title}
              author={author}
              isDisabled={isUpdating || isDeleting}
              onTitleChange={setTitle}
              onAuthorChange={setAuthor}
            />
          ) : (
            <BookDetails title={book.title} author={book.author} />
          )}
        </div>
        <AvailabilityBadge
          availableCopies={book.availableCopies}
          totalCopies={book.totalCopies}
        />
      </div>
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
      />
    </li>
  )
}
