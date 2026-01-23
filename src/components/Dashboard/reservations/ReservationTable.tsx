import LoanHeader from '../loans/LoanHeader'
import ReservationActions from './ReservationActions'
import ReservationStatusBadge from './ReservationStatusBadge'
import { formatDate } from '../loans/loanUtils'
import type { Reservation } from '../../../schemas/reservation.schema'

type ReservationTableProps = {
  reservations: Reservation[]
  isCancelling: boolean
  cancellingReservationId: string | null
  isCreatingLoan: boolean
  creatingLoanReservationId: string | null
  onCancel: (reservationId: string) => void
  onCreateLoan: (reservation: Reservation) => void
}

export default function ReservationTable({
  reservations,
  isCancelling,
  cancellingReservationId,
  isCreatingLoan,
  creatingLoanReservationId,
  onCancel,
  onCreateLoan,
}: ReservationTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white/60">
      <table className="min-w-[760px] w-full text-sm">
        <thead className="bg-white/70 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
          <tr>
            <th className="px-4 py-3">Book</th>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Expires</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {reservations.map((reservation) => {
            const isExpired = reservation.status === 'EXPIRED'
            const rowClasses = [isExpired ? 'bg-rose-50/70' : 'bg-transparent']
              .filter(Boolean)
              .join(' ')

            return (
              <tr key={reservation.id} className={rowClasses}>
                <td className="px-4 py-4 align-top">
                  <LoanHeader title={reservation.book.title} author={reservation.book.author} />
                </td>
                <td className="px-4 py-4 align-top text-sm text-[color:var(--ink)]">
                  <p className="font-semibold">{reservation.user.username}</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <ReservationStatusBadge status={reservation.status} />
                </td>
                <td className="px-4 py-4 align-top text-sm font-semibold text-[color:var(--ink)]">
                  {formatDate(reservation.createdAt)}
                </td>
                <td className="px-4 py-4 align-top text-sm font-semibold text-[color:var(--ink)]">
                  {formatDate(reservation.expiresAt)}
                </td>
                <td className="px-4 py-4 align-top text-right">
                  <ReservationActions
                    reservationId={reservation.id}
                    status={reservation.status}
                    isStaff
                    isCancelling={isCancelling && cancellingReservationId === reservation.id}
                    isCreatingLoan={isCreatingLoan && creatingLoanReservationId === reservation.id}
                    onCancel={onCancel}
                    onCreateLoan={() => onCreateLoan(reservation)}
                    className="mt-0 w-full justify-end"
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
