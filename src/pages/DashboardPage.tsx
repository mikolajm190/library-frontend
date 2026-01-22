import DashboardTabs from '../components/Dashboard/DashboardTabs'
import DashboardHero from '../components/Dashboard/DashboardHero'
import LoansPanel from '../components/Dashboard/loans/LoansPanel'
import ReservationsPanel from '../components/Dashboard/reservations/ReservationsPanel'
import PageShell from '../components/Layout/PageShell'
import { useAuth } from '../hooks/useAuth'

export default function DashboardPage() {
  const { isAdmin, isStaff } = useAuth()

  return (
    <PageShell>
      <DashboardHero />

      <section className="mx-auto mt-10 w-full max-w-6xl">
        {isStaff ? (
          <DashboardTabs isAdmin={isAdmin} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <LoansPanel isStaff={false} />
            <ReservationsPanel isStaff={false} />
          </div>
        )}
      </section>
    </PageShell>
  )
}
