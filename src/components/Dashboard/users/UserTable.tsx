import type { User } from '../../../schemas/user.schema'
import UserTableRow from './UserTableRow'

type UserTableProps = {
  users: User[]
  onUpdate: (userId: string, payload: { username: string; password: string }) => Promise<boolean>
  onDelete: (userId: string) => Promise<boolean>
  isUpdating: boolean
  updatingUserId: string | null
  isDeleting: boolean
  deletingUserId: string | null
}

export default function UserTable({
  users,
  onUpdate,
  onDelete,
  isUpdating,
  updatingUserId,
  isDeleting,
  deletingUserId,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white/60">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-white/70 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
          <tr>
            <th className="px-4 py-3">Username</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">User ID</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isUpdating={isUpdating && updatingUserId === user.id}
              isDeleting={isDeleting && deletingUserId === user.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
