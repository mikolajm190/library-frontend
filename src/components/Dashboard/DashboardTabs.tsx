import { useState } from 'react'
import BooksPanel from './books/BooksPanel'
import LoansPanel from './loans/LoansPanel'
import UsersPanel from './users/UsersPanel'
import DashboardTabList from './DashboardTabList'
import DashboardTabPanels from './DashboardTabPanels'

const ADMIN_TABS = [
  { id: 'loans', label: 'Loans', render: () => <LoansPanel isAdmin /> },
  { id: 'books', label: 'Books', render: () => <BooksPanel /> },
  { id: 'users', label: 'Users', render: () => <UsersPanel /> },
] as const

type AdminTabId = (typeof ADMIN_TABS)[number]['id']

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<AdminTabId>('loans')

  return (
    <>
      <DashboardTabList
        tabs={ADMIN_TABS}
        activeTab={activeTab}
        onSelect={setActiveTab}
      />
      <DashboardTabPanels tabs={ADMIN_TABS} activeTab={activeTab} />
    </>
  )
}
