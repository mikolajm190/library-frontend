import { useState } from 'react'
import type { User } from '../../../schemas/user.schema'
import UserEditFields from './UserEditFields'
import UserRowActions from './UserRowActions'

type UserTableRowProps = {
  user: User
  onUpdate: (userId: string, payload: { username: string; password: string }) => Promise<boolean>
  onDelete: (userId: string) => Promise<boolean>
  isUpdating: boolean
  isDeleting: boolean
}

export default function UserTableRow({
  user,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: UserTableRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user.username)
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!window.confirm('Save changes to this user?')) {
      return
    }
    if (!username.trim() || !password.trim()) {
      setFormError('Username and password are required.')
      return
    }
    const success = await onUpdate(user.id, { username: username.trim(), password: password.trim() })
    if (success) {
      setIsEditing(false)
      setPassword('')
      setFormError(null)
    }
  }

  const handleCancel = () => {
    setUsername(user.username)
    setPassword('')
    setFormError(null)
    setIsEditing(false)
  }

  const handleEdit = () => {
    setUsername(user.username)
    setPassword('')
    setFormError(null)
    setIsEditing(true)
  }

  return (
    <tr className="align-top">
      <td className="px-4 py-4">
        {isEditing ? (
          <UserEditFields
            username={username}
            password={password}
            isDisabled={isUpdating || isDeleting}
            formError={formError}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
          />
        ) : (
          <p className="text-base font-semibold text-[color:var(--ink)]">{user.username}</p>
        )}
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-[color:var(--ink)]">
        {user.role}
      </td>
      <td className="px-4 py-4 text-xs text-[color:var(--ink-muted)]">{user.id}</td>
      <td className="px-4 py-4 text-right">
        <UserRowActions
          isEditing={isEditing}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={() => {
            if (!window.confirm('Delete this user?')) {
              return
            }
            void onDelete(user.id)
          }}
          className="mt-0 justify-end"
        />
      </td>
    </tr>
  )
}
