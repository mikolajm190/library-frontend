import client from './client'
import type { AuthCredentials, AuthTokenResponse } from '../schemas/auth.schema'

export async function login(credentials: AuthCredentials): Promise<AuthTokenResponse> {
  const response = await client.post<AuthTokenResponse>('/v1/auth/login', credentials)
  return response.data
}

export async function register(credentials: AuthCredentials): Promise<AuthTokenResponse> {
  const response = await client.post<AuthTokenResponse>('/v1/auth/register', credentials)
  return response.data
}
