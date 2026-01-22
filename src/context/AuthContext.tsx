import { createContext } from 'react'
import type { Role } from '../auth/token'

export type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
  role: Role | null
  isAdmin: boolean
  isLibrarian: boolean
  isStaff: boolean
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
