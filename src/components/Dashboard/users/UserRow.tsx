import { useEffect, useState } from 'react'
import type { User } from '../../../schemas/user.schema'
import UserDetails from './UserDetails'
import UserEditFields from './UserEditFields'
import UserRowActions from './UserRowActions'

type UserRowProps = {
  user: User
  onUpdate: (userId: string, payload: { username: string; password: string }) => Promise<boolean>
  onDelete: (userId: string) => Promise<boolean>
  isUpdating: boolean
  isDeleting: boolean
}

export default function UserRow({ user, onUpdate, onDelete, isUpdating, isDeleting }: UserRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user.username)
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (isEditing) {
      return
    }
    setUsername(user.username)
  }, [user.username, isEditing])

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

  return (
    <li className="rounded-2xl border border-black/10 bg-white/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
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
            <UserDetails username={user.username} id={user.id} />
          )}
        </div>
      </div>
      <UserRowActions
        isEditing={isEditing}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={() => {
          if (!window.confirm('Delete this user?')) {
            return
          }
          void onDelete(user.id)
        }}
      />
    </li>
  )
}
