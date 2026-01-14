import axios from 'axios'

type ApiErrorPayload = { message?: string } | string | undefined

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as ApiErrorPayload
    if (typeof responseData === 'string') {
      return responseData
    }
    if (responseData?.message) {
      return responseData.message
    }
  }

  return error instanceof Error ? error.message : fallback
}
