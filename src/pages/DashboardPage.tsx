import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import AdminPanels from '../components/Dashboard/AdminPanels'
import DashboardHero from '../components/Dashboard/DashboardHero'
import LoansPanel from '../components/Dashboard/LoansPanel'
import { useAuth } from '../hooks/useAuth'

export default function DashboardPage() {
  const { isAdmin } = useAuth()

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <Header />
      <DashboardHero />

      <section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 lg:grid-cols-2">
        <LoansPanel isAdmin={isAdmin} />
        {isAdmin && <AdminPanels />}
      </section>

      <Footer />
    </main>
  )
}
