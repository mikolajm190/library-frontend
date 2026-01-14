import AdminPanels from '../components/Dashboard/AdminPanels'
import DashboardHero from '../components/Dashboard/DashboardHero'
import LoansPanel from '../components/Dashboard/loans/LoansPanel'
import PageShell from '../components/Layout/PageShell'
import { useAuth } from '../hooks/useAuth'

export default function DashboardPage() {
  const { isAdmin } = useAuth()

  return (
    <PageShell>
      <DashboardHero />

      <section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 lg:grid-cols-2">
        <LoansPanel isAdmin={isAdmin} />
        {isAdmin && <AdminPanels />}
      </section>
    </PageShell>
  )
}
