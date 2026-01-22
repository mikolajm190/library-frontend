type BookCardBorrowButtonProps = {
  isDisabled: boolean
  isLoading: boolean
  isAvailable: boolean
  onClick: () => void
}

export default function BookCardBorrowButton({
  isDisabled,
  isLoading,
  isAvailable,
  onClick,
}: BookCardBorrowButtonProps) {
  const buttonClasses = [
    'mt-auto inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition',
    isAvailable
      ? 'border-black/10 bg-[color:var(--ink)] text-[color:var(--paper)] enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:hover:shadow'
      : 'border-amber-300 bg-amber-50 text-amber-700 enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:hover:shadow',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' ')

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={buttonClasses}
      aria-disabled={isDisabled}
    >
      {isLoading ? 'Reserving...' : isAvailable ? 'Reserve' : 'Queue up'}
    </button>
  )
}
