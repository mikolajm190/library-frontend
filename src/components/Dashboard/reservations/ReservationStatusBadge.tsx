import type { Reservation } from '../../../schemas/reservation.schema'

const STATUS_STYLES: Record<Reservation['status'], { label: string; className: string }> = {
  READY: {
    label: 'Ready',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  QUEUED: {
    label: 'Queued',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  EXPIRED: {
    label: 'Expired',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
  },
}

type ReservationStatusBadgeProps = {
  status: Reservation['status']
}

export default function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  const statusStyle = STATUS_STYLES[status]

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${statusStyle.className}`}
    >
      {statusStyle.label}
    </span>
  )
}
