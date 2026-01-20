import DashboardTabs from '../components/Dashboard/DashboardTabs'
import DashboardHero from '../components/Dashboard/DashboardHero'
import LoansPanel from '../components/Dashboard/loans/LoansPanel'
import PageShell from '../components/Layout/PageShell'
import { useAuth } from '../hooks/useAuth'

export default function DashboardPage() {
  const { isAdmin } = useAuth()

  return (
    <PageShell>
      <DashboardHero />

      <section className="mx-auto mt-10 w-full max-w-6xl">
        {isAdmin ? <DashboardTabs /> : <LoansPanel isAdmin={false} />}
      </section>
    </PageShell>
  )
}
