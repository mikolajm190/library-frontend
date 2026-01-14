import { Users } from 'lucide-react'
import useUsersAdmin from '../../../hooks/useUsersAdmin'
import DashboardPanel from '../shared/DashboardPanel'
import UserCreateForm from './UserCreateForm'
import UserList from './UserList'
import PanelFooter from '../shared/PanelFooter'
import PanelListContainer from '../shared/PanelListContainer'
import PanelStatus from '../shared/PanelStatus'

export default function UsersPanel() {
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
  } = useUsersAdmin({ size: 10 })

  return (
    <DashboardPanel
      title="Users"
      description="Manage library members, roles, and access."
      icon={<Users className="h-5 w-5 text-[color:var(--ink)]" aria-hidden />}
      className="flex flex-col lg:h-[clamp(34rem,70vh,44rem)]"
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <UserCreateForm isSubmitting={isCreating} onCreate={createUser} />

      {isLoading && <PanelStatus variant="loading" message="Loading users..." />}
      {loadError && (
        <PanelStatus variant="error" message={loadError} onRetry={() => void refetch()} />
      )}
      {actionError && !loadError && <PanelStatus variant="error" message={actionError} />}
      {actionSuccess && !loadError && <PanelStatus variant="success" message={actionSuccess} />}
      <PanelListContainer>
        {!isLoading && !loadError && users.length === 0 && (
          <PanelStatus variant="empty" message="No users found." />
        )}
        {!isLoading && !loadError && users.length > 0 && (
          <UserList
            users={users}
            onUpdate={updateUser}
            onDelete={deleteUser}
            isUpdating={isUpdating}
            updatingUserId={updatingUserId}
            isDeleting={isDeleting}
            deletingUserId={deletingUserId}
          />
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
