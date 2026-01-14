import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { createUser, deleteUser, getUsers, updateUser } from '../../api/users.api'
import DashboardPanel from './DashboardPanel'
import UserList from './UserList'

export default function UsersPanel() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const size = 10
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', page, size],
    queryFn: ({ signal }) => getUsers({ page, size }, signal),
  })

  const users = data ?? []
  const loadError = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load users'
    : null
  const isLastPage = !isLoading && users.length < size

  const handleAxiosError = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err)) {
      const responseData = err.response?.data as { message?: string } | string | undefined
      if (typeof responseData === 'string') {
        setActionError(responseData)
      } else {
        setActionError(responseData?.message ?? fallback)
      }
      return
    }
    setActionError(err instanceof Error ? err.message : fallback)
  }

  const createMutation = useMutation({
    mutationFn: (payload: { username: string; password: string }, { signal }) =>
      createUser(payload, signal),
    onSuccess: () => {
      setActionSuccess('User created.')
      setPage(0)
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (err) => handleAxiosError(err, 'Failed to create user.'),
  })

  const updateMutation = useMutation({
    mutationFn: (
      { userId, payload }: { userId: string; payload: { username: string; password: string } },
      { signal },
    ) => updateUser(userId, payload, signal),
    onMutate: async ({ userId, payload }) => {
      const queryKey = ['users', page, size]
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<typeof users>(queryKey)
      queryClient.setQueryData<typeof users>(queryKey, (current) =>
        current?.map((user) => (user.id === userId ? { ...user, username: payload.username } : user)),
      )
      return { previous, queryKey }
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous)
      }
      handleAxiosError(err, 'Failed to update user.')
    },
    onSuccess: () => {
      setActionSuccess('User updated.')
      void queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
    onSettled: () => {
      setUpdatingUserId(null)
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (userId: string, { signal }) => deleteUser(userId, signal),
    onMutate: async (userId) => {
      const queryKey = ['users', page, size]
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<typeof users>(queryKey)
      queryClient.setQueryData<typeof users>(queryKey, (current) =>
        current?.filter((user) => user.id !== userId),
      )
      return { previous, queryKey }
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous)
      }
      handleAxiosError(err, 'Failed to delete user.')
    },
    onSuccess: () => {
      setActionSuccess('User deleted.')
      void queryClient.invalidateQueries({ queryKey: ['loans'] })
      void queryClient.invalidateQueries({ queryKey: ['books'] })
    },
    onSettled: () => {
      setDeletingUserId(null)
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (createMutation.isPending) {
      return
    }
    setActionError(null)
    setActionSuccess(null)
    try {
      await createMutation.mutateAsync({ username: username.trim(), password: password.trim() })
      setUsername('')
      setPassword('')
    } catch {
      return
    }
  }

  const handleUpdate = async (
    userId: string,
    payload: { username: string; password: string },
  ): Promise<boolean> => {
    if (updateMutation.isPending) {
      return false
    }
    setUpdatingUserId(userId)
    setActionError(null)
    setActionSuccess(null)
    try {
      await updateMutation.mutateAsync({ userId, payload })
      return true
    } catch {
      setUpdatingUserId(null)
      return false
    }
  }

  const handleDelete = async (userId: string): Promise<boolean> => {
    if (deleteMutation.isPending) {
      return false
    }
    setDeletingUserId(userId)
    setActionError(null)
    setActionSuccess(null)
    try {
      await deleteMutation.mutateAsync(userId)
      return true
    } catch {
      setDeletingUserId(null)
      return false
    }
  }

  return (
    <DashboardPanel
      title="Users"
      description="Manage library members, roles, and access."
      className="flex flex-col lg:h-[clamp(34rem,70vh,44rem)]"
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              disabled={createMutation.isPending}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-[color:var(--ink-muted)]">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={createMutation.isPending}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[color:var(--ink)] outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="mt-4 rounded-full border border-black/10 bg-[color:var(--ink)] px-4 py-2 text-xs font-semibold text-[color:var(--paper)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createMutation.isPending ? 'Creating...' : 'Add user'}
        </button>
      </form>

      {isLoading && (
        <p className="text-sm text-[color:var(--ink-muted)]">Loading users...</p>
      )}
      {loadError && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-amber-700">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            Retry
          </button>
        </div>
      )}
      {actionError && !loadError && <p className="text-sm text-amber-700">{actionError}</p>}
      {actionSuccess && !loadError && <p className="text-sm text-emerald-700">{actionSuccess}</p>}
      <div className="mt-4 max-h-[420px] overflow-y-auto pr-2 lg:flex-1 lg:min-h-0 lg:max-h-none">
        {!isLoading && !loadError && users.length === 0 && (
          <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-[color:var(--ink-muted)]">
            No users found.
          </div>
        )}
        {!isLoading && !loadError && users.length > 0 && (
          <UserList
            users={users}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isUpdating={updateMutation.isPending}
            updatingUserId={updatingUserId}
            isDeleting={deleteMutation.isPending}
            deletingUserId={deletingUserId}
          />
        )}
      </div>

      {!loadError && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--ink-muted)]">
          <button
            type="button"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={isLoading || page === 0}
            className="rounded-full border border-black/10 bg-white/80 px-3 py-1 font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <span>
            Page <span className="font-semibold text-[color:var(--ink)]">{page + 1}</span>
          </span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={isLoading || isLastPage}
            className="rounded-full border border-black/10 bg-white/80 px-3 py-1 font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      )}
    </DashboardPanel>
  )
}
