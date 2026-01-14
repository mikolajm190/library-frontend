import useBooksAdmin from '../../../hooks/useBooksAdmin'
import DashboardPanel from '../shared/DashboardPanel'
import BookCreateForm from './BookCreateForm'
import BookList from './BookList'
import PanelFooter from '../shared/PanelFooter'
import PanelListContainer from '../shared/PanelListContainer'
import PanelStatus from '../shared/PanelStatus'

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

  return (
    <DashboardPanel
      title="Books"
      description="Keep the catalog up to date."
      className="flex flex-col lg:h-[clamp(34rem,70vh,44rem)]"
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <BookCreateForm isSubmitting={isCreating} onCreate={createBook} />

      {isLoading && <PanelStatus variant="loading" message="Loading books..." />}
      {loadError && (
        <PanelStatus variant="error" message={loadError} onRetry={() => void refetch()} />
      )}
      {actionError && !loadError && <PanelStatus variant="error" message={actionError} />}
      {actionSuccess && !loadError && <PanelStatus variant="success" message={actionSuccess} />}
      <PanelListContainer>
        {!isLoading && !loadError && books.length === 0 && (
          <PanelStatus variant="empty" message="No books found." />
        )}
        {!isLoading && !loadError && books.length > 0 && (
          <BookList
            books={books}
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
