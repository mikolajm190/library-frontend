const TAB_BUTTON_BASE =
  'inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold shadow-sm transition'
const TAB_BUTTON_ACTIVE = 'bg-[color:var(--ink)] text-[color:var(--paper)]'
const TAB_BUTTON_IDLE =
  'bg-white/80 text-[color:var(--ink)] hover:-translate-y-0.5 hover:shadow'

const getTabButtonClass = (isActive: boolean) =>
  [TAB_BUTTON_BASE, isActive ? TAB_BUTTON_ACTIVE : TAB_BUTTON_IDLE].join(' ')

type DashboardTabListItem<T extends string> = {
  id: T
  label: string
}

type DashboardTabListProps<T extends string> = {
  tabs: readonly DashboardTabListItem<T>[]
  activeTab: T
  onSelect: (tabId: T) => void
}

export default function DashboardTabList<T extends string>({
  tabs,
  activeTab,
  onSelect,
}: DashboardTabListProps<T>) {
  return (
    <div
      role="tablist"
      aria-label="Dashboard panels"
      className="flex flex-wrap gap-2 border-b border-black/10 pb-4"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`dashboard-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`dashboard-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            className={getTabButtonClass(isActive)}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
