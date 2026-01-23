import type { Reservation } from '../../../schemas/reservation.schema'

type ReservationActionsProps = {
  reservationId: string
  status: Reservation['status']
  isStaff: boolean
  isCancelling: boolean
  isCreatingLoan: boolean
  onCancel: (reservationId: string) => void
  onCreateLoan: () => void
  className?: string
}

export default function ReservationActions({
  reservationId,
  status,
  isStaff,
  isCancelling,
  isCreatingLoan,
  onCancel,
  onCreateLoan,
  className,
}: ReservationActionsProps) {
  const isBusy = isCancelling || isCreatingLoan
  const canCreateLoan = isStaff && status === 'READY'
  const containerClasses = ['mt-4 flex flex-wrap items-center gap-3', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClasses}>
      {canCreateLoan && (
        <button
          type="button"
          onClick={onCreateLoan}
          disabled={isBusy}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreatingLoan ? 'Creating loan...' : 'Create loan'}
        </button>
      )}
      <button
        type="button"
        onClick={() => onCancel(reservationId)}
        disabled={isBusy}
        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm transition enabled:cursor-pointer hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCancelling ? 'Cancelling...' : 'Cancel reservation'}
      </button>
    </div>
  )
}
