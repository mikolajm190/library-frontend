import type { Book } from '../../../schemas/book.schema'
import BookTableRow from './BookTableRow'

type BookTableProps = {
  books: Book[]
  onUpdate: (bookId: string, payload: { title: string; author: string }) => Promise<boolean>
  onDelete: (bookId: string) => Promise<boolean>
  isUpdating: boolean
  updatingBookId: string | null
  isDeleting: boolean
  deletingBookId: string | null
}

export default function BookTable({
  books,
  onUpdate,
  onDelete,
  isUpdating,
  updatingBookId,
  isDeleting,
  deletingBookId,
}: BookTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white/60">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-white/70 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Available copies</th>
            <th className="px-4 py-3">Total copies</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {books.map((book) => (
            <BookTableRow
              key={book.id}
              book={book}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isUpdating={isUpdating && updatingBookId === book.id}
              isDeleting={isDeleting && deletingBookId === book.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
