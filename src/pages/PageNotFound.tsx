import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'

export default function PageNotFound() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <Header />

      <section className="mx-auto mt-14 w-full max-w-6xl">
        <h1 className="font-[var(--font-display)] text-3xl text-[color:var(--ink)]">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
          The page you are looking for does not exist.
        </p>
      </section>

      <Footer />
    </main>
  )
}
