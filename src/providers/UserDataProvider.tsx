import { useState, type ReactNode } from 'react'
import axios from 'axios'
import { createUser, deleteUser, updateUser } from '../api/users.api'
import useUsers from '../hooks/useUsers'
import { UserDataContext } from '../context/UserDataContext'

type UserDataProviderProps = {
  children: ReactNode
  onUserChange?: () => void
}

export default function UserDataProvider({ children, onUserChange }: UserDataProviderProps) {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const { users, isLoading, error, reload } = useUsers({ page, size })
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

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

  const handleCreate = async (payload: {
    username: string
    password: string
  }): Promise<boolean> => {
    if (isCreating) {
      return false
    }
    try {
      setIsCreating(true)
      setActionError(null)
      setActionSuccess(null)
      await createUser(payload)
      setActionSuccess('User created.')
      setPage(0)
      reload()
      return true
    } catch (err) {
      handleAxiosError(err, 'Failed to create user.')
      return false
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdate = async (
    userId: string,
    payload: { username: string; password: string },
  ): Promise<boolean> => {
    if (isUpdating) {
      return false
    }
    try {
      setIsUpdating(true)
      setUpdatingUserId(userId)
      setActionError(null)
      setActionSuccess(null)
      await updateUser(userId, payload)
      setActionSuccess('User updated.')
      reload()
      onUserChange?.()
      return true
    } catch (err) {
      handleAxiosError(err, 'Failed to update user.')
      return false
    } finally {
      setIsUpdating(false)
      setUpdatingUserId(null)
    }
  }

  const handleDelete = async (userId: string): Promise<boolean> => {
    if (isDeleting) {
      return false
    }
    try {
      setIsDeleting(true)
      setDeletingUserId(userId)
      setActionError(null)
      setActionSuccess(null)
      await deleteUser(userId)
      setActionSuccess('User deleted.')
      reload()
      onUserChange?.()
      return true
    } catch (err) {
      handleAxiosError(err, 'Failed to delete user.')
      return false
    } finally {
      setIsDeleting(false)
      setDeletingUserId(null)
    }
  }

  return (
    <UserDataContext.Provider
      value={{
        users,
        isLoading,
        error,
        actionError,
        actionSuccess,
        isCreating,
        isUpdating,
        updatingUserId,
        isDeleting,
        deletingUserId,
        page,
        size,
        setPage,
        setSize,
        reload,
        createUser: handleCreate,
        updateUser: handleUpdate,
        deleteUser: handleDelete,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}
