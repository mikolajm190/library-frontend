import { useEffect, useState } from 'react'
import axios from 'axios'
import { getUsers } from '../api/users.api'
import type { User } from '../schemas/user.schema'

type UseUsersParams = {
  page?: number
  size?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

type UseUsersResult = {
  users: User[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export default function useUsers({
  page,
  size = 10,
  sortBy,
  sortOrder,
}: UseUsersParams = {}): UseUsersResult {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const loadUsers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getUsers({ page, size, sortBy, sortOrder }, controller.signal)
        setUsers(data)
      } catch (err) {
        if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') {
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to load users')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadUsers()

    return () => controller.abort()
  }, [page, size, sortBy, sortOrder, reloadToken])

  const reload = () => {
    setReloadToken((value) => value + 1)
  }

  return { users, isLoading, error, reload }
}
