import DashboardPanel from './DashboardPanel'

export default function AdminPanels() {
  return (
    <>
      <DashboardPanel title="Users" description="Manage library members, roles, and access.">
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-[color:var(--ink-muted)]">
          User management tools are coming soon.
        </div>
      </DashboardPanel>

      <DashboardPanel title="Books" description="Keep the catalog up to date.">
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-[color:var(--ink-muted)]">
          Catalog management tools are coming soon.
        </div>
      </DashboardPanel>
    </>
  )
}
