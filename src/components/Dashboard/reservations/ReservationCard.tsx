import LoanHeader from '../loans/LoanHeader'
import ReservationActions from './ReservationActions'
import ReservationDatesCard from './ReservationDatesCard'
import ReservationStatusBadge from './ReservationStatusBadge'
import type { Reservation } from '../../../schemas/reservation.schema'

type ReservationCardProps = {
  reservation: Reservation
  isStaff: boolean
  isCancelling: boolean
  isCreatingLoan: boolean
  onCancel: (reservationId: string) => void
  onCreateLoan: () => void
}

export default function ReservationCard({
  reservation,
  isStaff,
  isCancelling,
  isCreatingLoan,
  onCancel,
  onCreateLoan,
}: ReservationCardProps) {
  return (
    <li className="rounded-2xl border border-black/10 bg-white/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <LoanHeader title={reservation.book.title} author={reservation.book.author} />
          <ReservationStatusBadge status={reservation.status} />
        </div>
        <ReservationDatesCard
          createdAt={reservation.createdAt}
          expiresAt={reservation.expiresAt}
        />
      </div>
      {isStaff && (
        <p className="mt-2 text-xs text-[color:var(--ink-muted)]">
          Reserved for: {reservation.user.username}
        </p>
      )}
      <ReservationActions
        reservationId={reservation.id}
        status={reservation.status}
        isStaff={isStaff}
        isCancelling={isCancelling}
        isCreatingLoan={isCreatingLoan}
        onCancel={onCancel}
        onCreateLoan={onCreateLoan}
      />
    </li>
  )
}
