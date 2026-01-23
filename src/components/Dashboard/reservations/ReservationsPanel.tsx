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
import ReservationTable from './ReservationTable'

type ReservationsPanelProps = {
  isStaff: boolean
}

type ReservationSortKey = 'createdAt' | 'expiresAt' | 'status' | 'book.title' | 'user.username'

export default function ReservationsPanel({ isStaff }: ReservationsPanelProps) {
  const [sortBy, setSortBy] = useState<ReservationSortKey>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
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
    isExpiring,
    expireReservations,
    isProcessing,
    processReservations,
    isCancelling,
    cancellingReservationId,
    cancelReservation,
    isCreatingLoan,
    creatingLoanReservationId,
    createLoanFromReservation,
  } = useReservationsPanel({ size: 10, sortBy, sortOrder })

  const title = isStaff ? 'All reservations' : 'My reservations'
  const description = isStaff
    ? 'Manage the queue and issue loans for ready pickups.'
    : 'Track your queue status and cancel when needed.'
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const sortOptions: Array<{ value: ReservationSortKey; label: string }> = [
    { value: 'createdAt', label: 'Created date' },
    { value: 'expiresAt', label: 'Expiry date' },
    { value: 'status', label: 'Status' },
    { value: 'book.title', label: 'Book title' },
    ...(isStaff ? [{ value: 'user.username', label: 'User' }] : []),
  ]
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
        <div className="min-w-[200px]">
          <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
            Sort by
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as ReservationSortKey)}
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
        {isStaff && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void expireReservations()}
              disabled={isExpiring}
              className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExpiring ? 'Marking...' : 'Mark expired reservations'}
            </button>
            <button
              type="button"
              onClick={() => void processReservations()}
              disabled={isProcessing}
              className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing ? 'Removing...' : 'Remove expired reservations'}
            </button>
          </div>
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
          <>
            {isStaff ? (
              <ReservationTable
                reservations={filteredReservations}
                isCancelling={isCancelling}
                cancellingReservationId={cancellingReservationId}
                isCreatingLoan={isCreatingLoan}
                creatingLoanReservationId={creatingLoanReservationId}
                onCancel={(reservationId) => void cancelReservation(reservationId)}
                onCreateLoan={(reservation) => void createLoanFromReservation(reservation)}
              />
            ) : (
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
