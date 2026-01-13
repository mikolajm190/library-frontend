import type { User } from '../../schemas/user.schema'
import UserRow from './UserRow'

type UserListProps = {
  users: User[]
  onUpdate: (userId: string, payload: { username: string; password: string }) => Promise<boolean>
  onDelete: (userId: string) => Promise<boolean>
  isUpdating: boolean
  updatingUserId: string | null
  isDeleting: boolean
  deletingUserId: string | null
}

export default function UserList({
  users,
  onUpdate,
  onDelete,
  isUpdating,
  updatingUserId,
  isDeleting,
  deletingUserId,
}: UserListProps) {
  return (
    <ul className="space-y-3 text-sm">
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={isUpdating && updatingUserId === user.id}
          isDeleting={isDeleting && deletingUserId === user.id}
        />
      ))}
    </ul>
  )
}
