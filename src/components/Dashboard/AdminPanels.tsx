import DashboardPanel from './DashboardPanel'
import BooksPanel from './BooksPanel'
import BookDataProvider from '../../providers/BookDataProvider'
import useLoanData from '../../hooks/useLoanData'

export default function AdminPanels() {
  const { reload } = useLoanData()

  return (
    <>
      <DashboardPanel title="Users" description="Manage library members, roles, and access.">
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-[color:var(--ink-muted)]">
          User management tools are coming soon.
        </div>
      </DashboardPanel>

      <BookDataProvider onBookChange={reload}>
        <BooksPanel />
      </BookDataProvider>
    </>
  )
}
