import { useState } from 'react'
import { Users } from 'lucide-react'
import useUsersAdmin from '../../../hooks/useUsersAdmin'
import DashboardPanel from '../shared/DashboardPanel'
import UserCreateForm from './UserCreateForm'
import UserList from './UserList'
import UserTable from './UserTable'
import PanelFooter from '../shared/PanelFooter'
import PanelListContainer from '../shared/PanelListContainer'
import PanelStatus from '../shared/PanelStatus'
import PanelSearch from '../shared/PanelSearch'

type UserSortKey = 'username' | 'role'

export default function UsersPanel() {
  const [sortBy, setSortBy] = useState<UserSortKey>('username')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const {
    users,
    isLoading,
    loadError,
    refetch,
    page,
    isLastPage,
    goPrev,
    goNext,
    actionError,
    actionSuccess,
    isCreating,
    createUser,
    isUpdating,
    updatingUserId,
    updateUser,
    isDeleting,
    deletingUserId,
    deleteUser,
  } = useUsersAdmin({ size: 10, sortBy, sortOrder })

  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const sortOptions: Array<{ value: UserSortKey; label: string }> = [
    { value: 'username', label: 'Username' },
    { value: 'role', label: 'Role' },
  ]
  const filteredUsers = normalizedQuery
    ? users.filter((user) => {
        const haystack = `${user.username} ${user.id}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    : users
  const isFiltering = normalizedQuery.length > 0
  const emptyMessage = isFiltering
    ? `No users match "${searchQuery.trim()}".`
    : 'No users found.'

  return (
    <DashboardPanel
      title="Users"
      description="Manage library members, roles, and access."
      icon={<Users className="h-5 w-5 text-[color:var(--ink)]" aria-hidden />}
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <UserCreateForm isSubmitting={isCreating} onCreate={createUser} />
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <PanelSearch
          label="Search users"
          placeholder="Search by username or id"
          value={searchQuery}
          onChange={setSearchQuery}
          className="min-w-[220px] flex-1"
        />
        <div className="min-w-[200px]">
          <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
            Sort by
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as UserSortKey)}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="min-w-[140px]">
          <p className="text-xs text-[color:var(--ink-muted)]">Order</p>
          <button
            type="button"
            onClick={() => setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {isLoading && <PanelStatus variant="loading" message="Loading users..." />}
      {loadError && (
        <PanelStatus variant="error" message={loadError} onRetry={() => void refetch()} />
      )}
      {actionError && !loadError && <PanelStatus variant="error" message={actionError} />}
      {actionSuccess && !loadError && <PanelStatus variant="success" message={actionSuccess} />}
      <PanelListContainer>
        {!isLoading && !loadError && filteredUsers.length === 0 && (
          <PanelStatus variant="empty" message={emptyMessage} />
        )}
        {!isLoading && !loadError && filteredUsers.length > 0 && (
          <>
            <div className="md:hidden">
              <UserList
                users={filteredUsers}
                onUpdate={updateUser}
                onDelete={deleteUser}
                isUpdating={isUpdating}
                updatingUserId={updatingUserId}
                isDeleting={isDeleting}
                deletingUserId={deletingUserId}
              />
            </div>
            <div className="hidden md:block">
              <UserTable
                users={filteredUsers}
                onUpdate={updateUser}
                onDelete={deleteUser}
                isUpdating={isUpdating}
                updatingUserId={updatingUserId}
                isDeleting={isDeleting}
                deletingUserId={deletingUserId}
              />
            </div>
          </>
        )}
      </PanelListContainer>

      {!loadError && (
        <PanelFooter
          page={page}
          isLoading={isLoading}
          isLastPage={isLastPage}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </DashboardPanel>
  )
}
