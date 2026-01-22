import { useState } from 'react'
import BooksPanel from './books/BooksPanel'
import LoansPanel from './loans/LoansPanel'
import ReservationsPanel from './reservations/ReservationsPanel'
import UsersPanel from './users/UsersPanel'
import DashboardTabList from './DashboardTabList'
import DashboardTabPanels from './DashboardTabPanels'

const STAFF_TABS = [
  { id: 'loans', label: 'Loans', render: () => <LoansPanel isStaff /> },
  { id: 'reservations', label: 'Reservations', render: () => <ReservationsPanel isStaff /> },
] as const

const ADMIN_TABS = [
  ...STAFF_TABS,
  { id: 'books', label: 'Books', render: () => <BooksPanel /> },
  { id: 'users', label: 'Users', render: () => <UsersPanel /> },
] as const

type StaffTabId = (typeof STAFF_TABS)[number]['id']
type AdminTabId = (typeof ADMIN_TABS)[number]['id']

type DashboardTabsProps = {
  isAdmin: boolean
}

export default function DashboardTabs({ isAdmin }: DashboardTabsProps) {
  const tabs = isAdmin ? ADMIN_TABS : STAFF_TABS
  const [activeTab, setActiveTab] = useState<StaffTabId | AdminTabId>('loans')

  return (
    <>
      <DashboardTabList tabs={tabs} activeTab={activeTab} onSelect={setActiveTab} />
      <DashboardTabPanels tabs={tabs} activeTab={activeTab} />
    </>
  )
}
