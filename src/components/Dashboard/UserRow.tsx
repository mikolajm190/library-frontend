import { useState } from 'react'
import type { User } from '../../schemas/user.schema'

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
            <div className="space-y-2">
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isUpdating || isDeleting}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isUpdating || isDeleting}
                placeholder="New password"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
              />
              {formError && <p className="text-xs text-amber-700">{formError}</p>}
            </div>
          ) : (
            <>
              <p className="text-base font-semibold text-[color:var(--ink)]">{user.username}</p>
              <p className="text-xs text-[color:var(--ink-muted)]">{user.id}</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={isUpdating || isDeleting}
              className="rounded-full border border-black/10 bg-[color:var(--ink)] px-3 py-1 text-xs font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdating || isDeleting}
              className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isUpdating || isDeleting}
              className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                if (!window.confirm('Delete this user?')) {
                  return
                }
                void onDelete(user.id)
              }}
              disabled={isUpdating || isDeleting}
              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        )}
      </div>
    </li>
  )
}
