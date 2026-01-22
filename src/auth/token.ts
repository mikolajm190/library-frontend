export const AUTH_TOKEN_KEY = 'authToken'

export type Role = 'admin' | 'librarian' | 'user'

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY)

export const setStoredToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const clearStoredToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

type TokenRole = 'ROLE_ADMIN' | 'ROLE_LIBRARIAN' | 'ROLE_USER'

type TokenPayload = {
  roles?: TokenRole[]
  sub?: string
  iat?: number
  exp?: number
}

const decodePayload = (token: string): TokenPayload | null => {
  const [, payload] = token.split('.')
  if (!payload) {
    return null
  }
  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    const json = atob(padded)
    return JSON.parse(json) as TokenPayload
  } catch {
    return null
  }
}

export const getRoleFromToken = (token: string | null): Role | null => {
  if (!token) {
    return null
  }
  const payload = decodePayload(token)
  if (!payload) {
    return null
  }
  const role = payload.roles?.[0]
  if (!role) {
    return null
  }
  if (role === 'ROLE_ADMIN') {
    return 'admin'
  }
  if (role === 'ROLE_LIBRARIAN') {
    return 'librarian'
  }
  if (role === 'ROLE_USER') {
    return 'user'
  }
  return null
}
