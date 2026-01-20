type DashboardTabPanelItem<T extends string> = {
  id: T
  render: () => JSX.Element
}

type DashboardTabPanelsProps<T extends string> = {
  tabs: readonly DashboardTabPanelItem<T>[]
  activeTab: T
}

export default function DashboardTabPanels<T extends string>({
  tabs,
  activeTab,
}: DashboardTabPanelsProps<T>) {
  return tabs.map((tab) => {
    const isActive = tab.id === activeTab

    return (
      <div
        key={tab.id}
        role="tabpanel"
        id={`dashboard-panel-${tab.id}`}
        aria-labelledby={`dashboard-tab-${tab.id}`}
        tabIndex={isActive ? 0 : -1}
        hidden={!isActive}
        className="mt-6"
      >
        {tab.render()}
      </div>
    )
  })
}
