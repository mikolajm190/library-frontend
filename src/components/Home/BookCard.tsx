import type { Book } from '../../schemas/book.schema'

type BookCardProps = {
  book: Book
  onBorrow?: (book: Book) => void
  className?: string
  isBorrowing?: boolean
}

const baseCardClasses =
  'group flex h-full flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md'

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}

export default function BookCard({ book, onBorrow, className, isBorrowing = false }: BookCardProps) {
  const totalCopies = Math.max(0, book.availableCopies + book.copiesOnLoan)
  const availabilityRatio = totalCopies === 0 ? 0 : book.availableCopies / totalCopies
  const isAvailable = book.availableCopies > 0
  const availabilityText = isAvailable ? 'Available now' : 'All copies loaned'
  const cardClasses = [baseCardClasses, className].filter(Boolean).join(' ')
  const borrowDisabled = !onBorrow || !isAvailable || isBorrowing

  return (
    <article className={cardClasses}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--ink-muted)]">
            Book
          </p>
          <h3 className="mt-2 font-[var(--font-display)] text-2xl leading-tight text-[color:var(--ink)]">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-[color:var(--ink-muted)]">by {book.author}</p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            isAvailable
              ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700'
              : 'border-amber-500/30 bg-amber-50 text-amber-700'
          }`}
        >
          {availabilityText}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-black/5 bg-white/70 p-3 text-sm">
        <div>
          <p className="text-[color:var(--ink-muted)]">Available</p>
          <p className="mt-1 text-lg font-semibold text-[color:var(--ink)]">
            {book.availableCopies}
          </p>
        </div>
        <div>
          <p className="text-[color:var(--ink-muted)]">On loan</p>
          <p className="mt-1 text-lg font-semibold text-[color:var(--ink)]">
            {book.copiesOnLoan}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[color:var(--ink-muted)]">
          <span>Total copies</span>
          <span className="font-semibold text-[color:var(--ink)]">{totalCopies}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-black/10" aria-hidden>
          <div
            className="h-2 rounded-full bg-emerald-500/80 transition-all"
            style={{ width: formatPercent(availabilityRatio) }}
          />
        </div>
        <p className="text-xs text-[color:var(--ink-muted)]">
          {formatPercent(availabilityRatio)} availability
        </p>
      </div>

      <button
        type="button"
        onClick={() => onBorrow?.(book)}
        disabled={borrowDisabled}
        className="mt-auto inline-flex items-center justify-center rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] shadow-sm transition enabled:hover:-translate-y-0.5 enabled:hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
        aria-disabled={borrowDisabled}
      >
        {isBorrowing ? 'Borrowing...' : 'Borrow'}
      </button>
    </article>
  )
}
