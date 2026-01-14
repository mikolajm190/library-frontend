import type { Book } from '../../../schemas/book.schema'
import BookRow from './BookRow'

type BookListProps = {
  books: Book[]
  onUpdate: (bookId: string, payload: { title: string; author: string }) => Promise<boolean>
  onDelete: (bookId: string) => Promise<boolean>
  isUpdating: boolean
  updatingBookId: string | null
  isDeleting: boolean
  deletingBookId: string | null
}

export default function BookList({
  books,
  onUpdate,
  onDelete,
  isUpdating,
  updatingBookId,
  isDeleting,
  deletingBookId,
}: BookListProps) {
  return (
    <ul className="space-y-3 text-sm">
      {books.map((book) => (
        <BookRow
          key={book.id}
          book={book}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={isUpdating && updatingBookId === book.id}
          isDeleting={isDeleting && deletingBookId === book.id}
        />
      ))}
    </ul>
  )
}
