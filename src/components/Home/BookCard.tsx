import type { Book } from '../../schemas/book.schema'
import BookCardAvailabilityBar from './BookCardAvailabilityBar'
import BookCardBorrowButton from './BookCardBorrowButton'
import BookCardHeader from './BookCardHeader'
import BookCardStats from './BookCardStats'

type BookCardProps = {
  book: Book
  onReserve?: (book: Book) => void
  className?: string
  isReserving?: boolean
  reserveError?: string | null
}

const baseCardClasses =
  'group flex h-full flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md'

export default function BookCard({
  book,
  onReserve,
  className,
  isReserving = false,
  reserveError,
}: BookCardProps) {
  const totalCopies = book.totalCopies
  const availabilityRatio = totalCopies === 0 ? 0 : book.availableCopies / totalCopies
  const isAvailable = book.availableCopies > 0
  const availabilityText = isAvailable ? 'Available now' : 'Not available'
  const cardClasses = [baseCardClasses, className].filter(Boolean).join(' ')
  const reserveDisabled = !onReserve || isReserving

  return (
    <article className={cardClasses}>
      <BookCardHeader
        title={book.title}
        author={book.author}
        isAvailable={isAvailable}
        availabilityText={availabilityText}
      />

      <BookCardStats availableCopies={book.availableCopies} totalCopies={totalCopies} />

      <BookCardAvailabilityBar totalCopies={totalCopies} availabilityRatio={availabilityRatio} />

      <BookCardBorrowButton
        isDisabled={reserveDisabled}
        isLoading={isReserving}
        isAvailable={isAvailable}
        onClick={() => onReserve?.(book)}
      />
      {reserveError && <p className="text-xs text-amber-700">{reserveError}</p>}
    </article>
  )
}
