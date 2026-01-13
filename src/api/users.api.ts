import client from './client'
import type { UserResponse } from '../schemas/user.schema'

export async function getMe(signal?: AbortSignal): Promise<UserResponse> {
  const response = await client.get<UserResponse>('/v1/users/me', { signal })
  return response.data
}
