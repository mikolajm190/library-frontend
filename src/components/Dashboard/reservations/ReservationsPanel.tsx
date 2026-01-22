import { useState } from 'react'
import { BookmarkCheck } from 'lucide-react'
import useReservationsPanel from '../../../hooks/useReservationsPanel'
import DashboardPanel from '../shared/DashboardPanel'
import PanelFooter from '../shared/PanelFooter'
import PanelListContainer from '../shared/PanelListContainer'
import PanelSearch from '../shared/PanelSearch'
import PanelStatus from '../shared/PanelStatus'
import ReservationCreateForm from './ReservationCreateForm'
import ReservationList from './ReservationList'

type ReservationsPanelProps = {
  isStaff: boolean
}

export default function ReservationsPanel({ isStaff }: ReservationsPanelProps) {
  const {
    reservations,
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
    createReservation,
    isProcessing,
    processReservations,
    isCancelling,
    cancellingReservationId,
    cancelReservation,
    isCreatingLoan,
    creatingLoanReservationId,
    createLoanFromReservation,
  } = useReservationsPanel({ size: 10 })

  const title = isStaff ? 'All reservations' : 'My reservations'
  const description = isStaff
    ? 'Manage the queue and issue loans for ready pickups.'
    : 'Track your queue status and cancel when needed.'
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredReservations = normalizedQuery
    ? reservations.filter((reservation) => {
        const terms = [reservation.book.title, reservation.book.author]
        if (isStaff) {
          terms.push(reservation.user.username)
        }
        return terms.some((term) => term.toLowerCase().includes(normalizedQuery))
      })
    : reservations
  const isFiltering = normalizedQuery.length > 0
  const emptyMessage = isFiltering
    ? `No reservations match "${searchQuery.trim()}".`
    : 'No reservations found.'

  return (
    <DashboardPanel
      title={title}
      description={description}
      icon={<BookmarkCheck className="h-5 w-5 text-[color:var(--ink)]" aria-hidden />}
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      {isStaff && (
        <ReservationCreateForm isSubmitting={isCreating} onCreate={createReservation} />
      )}
      <div className="flex flex-wrap items-end gap-3">
        <PanelSearch
          label="Search reservations"
          placeholder={isStaff ? 'Search by book or requester' : 'Search by book or author'}
          value={searchQuery}
          onChange={setSearchQuery}
          className={`min-w-[220px] flex-1 ${isStaff ? 'mt-4' : ''}`}
        />
        {isStaff && (
          <button
            type="button"
            onClick={() => void processReservations()}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? 'Processing...' : 'Process reservations'}
          </button>
        )}
      </div>

      {isLoading && <PanelStatus variant="loading" message="Loading reservations..." />}
      {loadError && (
        <PanelStatus variant="error" message={loadError} onRetry={() => void refetch()} />
      )}
      {actionError && !loadError && <PanelStatus variant="error" message={actionError} />}
      {actionSuccess && !loadError && <PanelStatus variant="success" message={actionSuccess} />}
      <PanelListContainer>
        {!isLoading && !loadError && filteredReservations.length === 0 && (
          <PanelStatus variant="empty" message={emptyMessage} />
        )}
        {!isLoading && !loadError && filteredReservations.length > 0 && (
          <ReservationList
            reservations={filteredReservations}
            isStaff={isStaff}
            isCancelling={isCancelling}
            cancellingReservationId={cancellingReservationId}
            isCreatingLoan={isCreatingLoan}
            creatingLoanReservationId={creatingLoanReservationId}
            onCancel={(reservationId) => void cancelReservation(reservationId)}
            onCreateLoan={(reservation) => void createLoanFromReservation(reservation)}
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
