export default function HomeHero() {
  return (
    <section className="mx-auto mt-10 w-full max-w-6xl">
      <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--ink-muted)]">
        Library shelf
      </p>
      <h1 className="mt-3 font-[var(--font-display)] text-4xl text-[color:var(--ink)] sm:text-5xl">
        Discover your next read
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[color:var(--ink-muted)]">
        Check the latest arrivals and see what is ready for checkout.
      </p>
    </section>
  )
}
