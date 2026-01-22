import LoanHeader from '../loans/LoanHeader'
import ReservationActions from './ReservationActions'
import ReservationDatesCard from './ReservationDatesCard'
import type { Reservation } from '../../../schemas/reservation.schema'

type ReservationCardProps = {
  reservation: Reservation
  isStaff: boolean
  isCancelling: boolean
  isCreatingLoan: boolean
  onCancel: (reservationId: string) => void
  onCreateLoan: () => void
}

const STATUS_STYLES: Record<Reservation['status'], { label: string; className: string }> = {
  READY: {
    label: 'Ready',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  QUEUED: {
    label: 'Queued',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
}

export default function ReservationCard({
  reservation,
  isStaff,
  isCancelling,
  isCreatingLoan,
  onCancel,
  onCreateLoan,
}: ReservationCardProps) {
  const statusStyle = STATUS_STYLES[reservation.status]

  return (
    <li className="rounded-2xl border border-black/10 bg-white/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <LoanHeader title={reservation.book.title} author={reservation.book.author} />
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${statusStyle.className}`}
          >
            {statusStyle.label}
          </span>
        </div>
        <ReservationDatesCard
          createdAt={reservation.createdAt}
          expiresAt={reservation.expiresAt}
        />
      </div>
      {isStaff && (
        <p className="mt-2 text-xs text-[color:var(--ink-muted)]">
          Requester: {reservation.user.username}
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
