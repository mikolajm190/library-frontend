import ReservationCard from './ReservationCard'
import type { Reservation } from '../../../schemas/reservation.schema'

type ReservationListProps = {
  reservations: Reservation[]
  isStaff: boolean
  isCancelling: boolean
  cancellingReservationId: string | null
  isCreatingLoan: boolean
  creatingLoanReservationId: string | null
  onCancel: (reservationId: string) => void
  onCreateLoan: (reservation: Reservation) => void
}

export default function ReservationList({
  reservations,
  isStaff,
  isCancelling,
  cancellingReservationId,
  isCreatingLoan,
  creatingLoanReservationId,
  onCancel,
  onCreateLoan,
}: ReservationListProps) {
  return (
    <ul className="space-y-3 text-sm">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          isStaff={isStaff}
          isCancelling={isCancelling && cancellingReservationId === reservation.id}
          isCreatingLoan={isCreatingLoan && creatingLoanReservationId === reservation.id}
          onCancel={onCancel}
          onCreateLoan={() => onCreateLoan(reservation)}
        />
      ))}
    </ul>
  )
}
