type BookCardBorrowButtonProps = {
  isDisabled: boolean
  isBorrowing: boolean
  onClick: () => void
}

export default function BookCardBorrowButton({
  isDisabled,
  isBorrowing,
  onClick,
}: BookCardBorrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="mt-auto inline-flex items-center justify-center rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] shadow-sm transition enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
      aria-disabled={isDisabled}
    >
      {isBorrowing ? 'Borrowing...' : 'Borrow'}
    </button>
  )
}
