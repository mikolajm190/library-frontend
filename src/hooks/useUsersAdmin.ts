import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  type CreateUserPayload,
  type UpdateUserPayload,
} from '../api/users.api'
import { getApiErrorMessage } from '../api/apiError'
import { queryKeys } from '../api/queryKeys'
import type { User } from '../schemas/user.schema'

type UseUsersAdminOptions = {
  size?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

type UseUsersAdminResult = {
  users: User[]
  isLoading: boolean
  loadError: string | null
  refetch: () => void
  page: number
  isLastPage: boolean
  goPrev: () => void
  goNext: () => void
  resetPage: () => void
  actionError: string | null
  actionSuccess: string | null
  isCreating: boolean
  createUser: (payload: CreateUserPayload) => Promise<boolean>
  isUpdating: boolean
  updatingUserId: string | null
  updateUser: (userId: string, payload: UpdateUserPayload) => Promise<boolean>
  isDeleting: boolean
  deletingUserId: string | null
  deleteUser: (userId: string) => Promise<boolean>
}

const DEFAULT_SORT_BY = 'username'
const DEFAULT_SORT_ORDER = 'asc'

export default function useUsersAdmin({
  size = 10,
  sortBy = DEFAULT_SORT_BY,
  sortOrder = DEFAULT_SORT_ORDER,
}: UseUsersAdminOptions = {}): UseUsersAdminResult {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.users({ page, size, sortBy, sortOrder }),
    queryFn: ({ signal }) => getUsers({ page, size, sortBy, sortOrder }, signal),
  })

  const users = data ?? []
  const loadError = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load users'
    : null
  const isLastPage = !isLoading && users.length < size

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload, { signal }) => createUser(payload, signal),
    onSuccess: () => {
      setActionSuccess('User created.')
      setPage(0)
      void queryClient.invalidateQueries({ queryKey: queryKeys.users() })
    },
    onError: (err) => setActionError(getApiErrorMessage(err, 'Failed to create user.')),
  })

  const updateMutation = useMutation({
    mutationFn: (
      { userId, payload }: { userId: string; payload: UpdateUserPayload },
      { signal },
    ) => updateUser(userId, payload, signal),
    onMutate: async ({ userId, payload }) => {
      const queryKey = queryKeys.users({ page, size, sortBy, sortOrder })
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
      setActionError(getApiErrorMessage(err, 'Failed to update user.'))
    },
    onSuccess: () => {
      setActionSuccess('User updated.')
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans() })
    },
    onSettled: () => {
      setUpdatingUserId(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.users() })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (userId: string, { signal }) => deleteUser(userId, signal),
    onMutate: async (userId) => {
      const queryKey = queryKeys.users({ page, size, sortBy, sortOrder })
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
      setActionError(getApiErrorMessage(err, 'Failed to delete user.'))
    },
    onSuccess: () => {
      setActionSuccess('User deleted.')
      void queryClient.invalidateQueries({ queryKey: queryKeys.loans() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.books() })
    },
    onSettled: () => {
      setDeletingUserId(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.users() })
    },
  })

  const createUserEntry = async (payload: CreateUserPayload): Promise<boolean> => {
    if (createMutation.isPending) {
      return false
    }
    setActionError(null)
    setActionSuccess(null)
    try {
      await createMutation.mutateAsync(payload)
      return true
    } catch {
      return false
    }
  }

  const updateUserEntry = async (
    userId: string,
    payload: UpdateUserPayload,
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

  const deleteUserEntry = async (userId: string): Promise<boolean> => {
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

  const goPrev = () => setPage((current) => Math.max(0, current - 1))
  const goNext = () => setPage((current) => current + 1)
  const resetPage = () => setPage(0)

  return {
    users,
    isLoading,
    loadError,
    refetch,
    page,
    isLastPage,
    goPrev,
    goNext,
    resetPage,
    actionError,
    actionSuccess,
    isCreating: createMutation.isPending,
    createUser: createUserEntry,
    isUpdating: updateMutation.isPending,
    updatingUserId,
    updateUser: updateUserEntry,
    isDeleting: deleteMutation.isPending,
    deletingUserId,
    deleteUser: deleteUserEntry,
  }
}
