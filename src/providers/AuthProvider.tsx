import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  AUTH_TOKEN_KEY,
  clearStoredToken,
  getStoredToken,
  getRoleFromToken,
  setStoredToken,
} from '../auth/token'
import { AuthContext, type AuthContextValue } from '../context/AuthContext'

type AuthProviderProps = {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_KEY) {
        setToken(event.newValue)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = (nextToken: string) => {
    setStoredToken(nextToken)
    setToken(nextToken)
  }

  const logout = () => {
    clearStoredToken()
    setToken(null)
  }

  const role = useMemo(() => getRoleFromToken(token), [token])
  const isAdmin = role === 'admin'

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      role,
      isAdmin,
      login,
      logout,
    }),
    [token, role, isAdmin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
