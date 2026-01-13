import { createContext } from 'react'
import type { User } from '../schemas/user.schema'

export type UserDataContextValue = {
  users: User[]
  isLoading: boolean
  error: string | null
  actionError: string | null
  actionSuccess: string | null
  isCreating: boolean
  isUpdating: boolean
  updatingUserId: string | null
  isDeleting: boolean
  deletingUserId: string | null
  page: number
  size: number
  setPage: (page: number) => void
  setSize: (size: number) => void
  reload: () => void
  createUser: (payload: { username: string; password: string }) => Promise<boolean>
  updateUser: (
    userId: string,
    payload: { username: string; password: string },
  ) => Promise<boolean>
  deleteUser: (userId: string) => Promise<boolean>
}

export const UserDataContext = createContext<UserDataContextValue | undefined>(undefined)
