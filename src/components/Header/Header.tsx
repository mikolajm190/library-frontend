export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--ink-muted)]">
            Library shelf
          </p>
          <h1 className="font-[var(--font-display)] text-4xl text-[color:var(--ink)] sm:text-5xl">
            Discover your next read
          </h1>
          <p className="max-w-2xl text-sm text-[color:var(--ink-muted)]">
            Check the latest arrivals and see what is ready for checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            Login
          </button>
          <button
            type="button"
            className="rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            Register
          </button>
        </div>
      </div>
    </header>
  )
}
