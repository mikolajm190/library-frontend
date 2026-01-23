import { useState } from 'react'
import { BookCopy } from 'lucide-react'
import useBooksAdmin from '../../../hooks/useBooksAdmin'
import DashboardPanel from '../shared/DashboardPanel'
import BookCreateForm from './BookCreateForm'
import BookList from './BookList'
import BookTable from './BookTable'
import PanelFooter from '../shared/PanelFooter'
import PanelListContainer from '../shared/PanelListContainer'
import PanelStatus from '../shared/PanelStatus'
import PanelSearch from '../shared/PanelSearch'

type BookSortKey = 'title' | 'author' | 'totalCopies'

export default function BooksPanel() {
  const [sortBy, setSortBy] = useState<BookSortKey>('title')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const {
    books,
    isLoading,
    loadError,
    refetch,
    page,
    isLastPage,
    goPrev,
    goNext,
    actionError,
    actionSuccess,
    isCreating,
    createBook,
    isUpdating,
    updatingBookId,
    updateBook,
    isDeleting,
    deletingBookId,
    deleteBook,
  } = useBooksAdmin({ size: 10, sortBy, sortOrder })

  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const sortOptions: Array<{ value: BookSortKey; label: string }> = [
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'totalCopies', label: 'Total copies' },
  ]
  const filteredBooks = normalizedQuery
    ? books.filter((book) => {
        const haystack = `${book.title} ${book.author}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    : books
  const isFiltering = normalizedQuery.length > 0
  const emptyMessage = isFiltering
    ? `No books match "${searchQuery.trim()}".`
    : 'No books found.'

  return (
    <DashboardPanel
      title="Books"
      description="Keep the catalog up to date."
      icon={<BookCopy className="h-5 w-5 text-[color:var(--ink)]" aria-hidden />}
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <BookCreateForm isSubmitting={isCreating} onCreate={createBook} />
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <PanelSearch
          label="Search books"
          placeholder="Search by title or author"
          value={searchQuery}
          onChange={setSearchQuery}
          className="min-w-[220px] flex-1"
        />
        <div className="min-w-[200px]">
          <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
            Sort by
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as BookSortKey)}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="min-w-[140px]">
          <p className="text-xs text-[color:var(--ink-muted)]">Order</p>
          <button
            type="button"
            onClick={() => setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {isLoading && <PanelStatus variant="loading" message="Loading books..." />}
      {loadError && (
        <PanelStatus variant="error" message={loadError} onRetry={() => void refetch()} />
      )}
      {actionError && !loadError && <PanelStatus variant="error" message={actionError} />}
      {actionSuccess && !loadError && <PanelStatus variant="success" message={actionSuccess} />}
      <PanelListContainer>
        {!isLoading && !loadError && filteredBooks.length === 0 && (
          <PanelStatus variant="empty" message={emptyMessage} />
        )}
        {!isLoading && !loadError && filteredBooks.length > 0 && (
          <>
            <div className="md:hidden">
              <BookList
                books={filteredBooks}
                onUpdate={updateBook}
                onDelete={deleteBook}
                isUpdating={isUpdating}
                updatingBookId={updatingBookId}
                isDeleting={isDeleting}
                deletingBookId={deletingBookId}
              />
            </div>
            <div className="hidden md:block">
              <BookTable
                books={filteredBooks}
                onUpdate={updateBook}
                onDelete={deleteBook}
                isUpdating={isUpdating}
                updatingBookId={updatingBookId}
                isDeleting={isDeleting}
                deletingBookId={deletingBookId}
              />
            </div>
          </>
        )}
      </PanelListContainer>

      {!loadError && (
        <PanelFooter
          page={page}
          isLoading={isLoading}
          isLastPage={isLastPage}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </DashboardPanel>
  )
}
