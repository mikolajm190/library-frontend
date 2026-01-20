import { useState } from 'react'
import { BookCopy } from 'lucide-react'
import useBooksAdmin from '../../../hooks/useBooksAdmin'
import DashboardPanel from '../shared/DashboardPanel'
import BookCreateForm from './BookCreateForm'
import BookList from './BookList'
import PanelFooter from '../shared/PanelFooter'
import PanelListContainer from '../shared/PanelListContainer'
import PanelStatus from '../shared/PanelStatus'
import PanelSearch from '../shared/PanelSearch'

export default function BooksPanel() {
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
  } = useBooksAdmin({ size: 10 })

  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
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
      className="flex flex-col lg:h-[clamp(34rem,70vh,44rem)]"
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <BookCreateForm isSubmitting={isCreating} onCreate={createBook} />
      <PanelSearch
        className="mt-4"
        label="Search books"
        placeholder="Search by title or author"
        value={searchQuery}
        onChange={setSearchQuery}
      />

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
          <BookList
            books={filteredBooks}
            onUpdate={updateBook}
            onDelete={deleteBook}
            isUpdating={isUpdating}
            updatingBookId={updatingBookId}
            isDeleting={isDeleting}
            deletingBookId={deletingBookId}
          />
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
