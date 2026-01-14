import PageShell from '../components/Layout/PageShell'

export default function PageNotFound() {
  return (
    <PageShell>
      <section className="mx-auto mt-14 w-full max-w-6xl">
        <h1 className="font-[var(--font-display)] text-3xl text-[color:var(--ink)]">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
          The page you are looking for does not exist.
        </p>
      </section>
    </PageShell>
  )
}
