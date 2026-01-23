import client from './client'
import type { User, UserListResponse, UserResponse } from '../schemas/user.schema'

type UserApi = Omit<User, 'role'> & {
  role?: User['role']
}

const normalizeUser = (user: UserApi): User => ({
  ...user,
  role: user.role ?? 'USER',
})

export async function getMe(signal?: AbortSignal): Promise<UserResponse> {
  const response = await client.get<UserApi>('/v1/users/me', { signal })
  return normalizeUser(response.data)
}

export type GetUsersParams = {
  page?: number
  size?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type CreateUserPayload = {
  username: string
  password: string
  role: 'USER' | 'LIBRARIAN'
}

export type UpdateUserPayload = {
  username: string
  password: string
}

export async function getUsers(
  params: GetUsersParams = {},
  signal?: AbortSignal,
): Promise<UserListResponse> {
  const query: Record<string, number | string> = {}
  if (params.page !== undefined) {
    query.page = params.page
  }
  if (params.size !== undefined) {
    query.size = params.size
  }
  if (params.sortBy) {
    query.sortBy = params.sortBy
  }
  if (params.sortOrder) {
    query.sortOrder = params.sortOrder
  }

  const response = await client.get<UserApi[]>('/v1/users', {
    params: Object.keys(query).length > 0 ? query : undefined,
    signal,
  })

  return response.data.map(normalizeUser)
}

export async function createUser(
  payload: CreateUserPayload,
  signal?: AbortSignal,
): Promise<User | null> {
  const response = await client.post<UserApi | ''>('/v1/users', payload, { signal })
  const data = response.data
  if (!data || typeof data !== 'object') {
    return null
  }
  return normalizeUser(data)
}

export async function updateUser(
  userId: string,
  payload: UpdateUserPayload,
  signal?: AbortSignal,
): Promise<User | null> {
  const response = await client.put<UserApi | ''>(`/v1/users/${userId}`, payload, { signal })
  const data = response.data
  if (!data || typeof data !== 'object') {
    return null
  }
  return normalizeUser(data)
}

export async function deleteUser(userId: string, signal?: AbortSignal): Promise<void> {
  await client.delete(`/v1/users/${userId}`, { signal })
}
