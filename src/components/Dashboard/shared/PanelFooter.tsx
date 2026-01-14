type PanelFooterProps = {
  page: number
  isLoading: boolean
  isLastPage: boolean
  onPrev: () => void
  onNext: () => void
}

export default function PanelFooter({
  page,
  isLoading,
  isLastPage,
  onPrev,
  onNext,
}: PanelFooterProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--ink-muted)]">
      <button
        type="button"
        onClick={onPrev}
        disabled={isLoading || page === 0}
        className="rounded-full border border-black/10 bg-white/80 px-3 py-1 font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
      >
        Previous
      </button>
      <span>
        Page <span className="font-semibold text-[color:var(--ink)]">{page + 1}</span>
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={isLoading || isLastPage}
        className="rounded-full border border-black/10 bg-white/80 px-3 py-1 font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
      >
        Next
      </button>
    </div>
  )
}
