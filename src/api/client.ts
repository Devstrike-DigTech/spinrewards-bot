import axios, { AxiosInstance, AxiosError } from 'axios'
import config from '../config'

// In-memory token store: telegramId → { access, refresh }
const tokenStore = new Map<string, { access: string; refresh: string }>()

export function setTokens(telegramId: string, tokens: { access: string; refresh: string }) {
  tokenStore.set(telegramId, tokens)
}

export function getTokens(telegramId: string) {
  return tokenStore.get(telegramId)
}

export function clearTokens(telegramId: string) {
  tokenStore.delete(telegramId)
}

// Unauthenticated client — for auth endpoint only
export const publicClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// Create an authenticated client for a specific user
export function createAuthClient(telegramId: string): AxiosInstance {
  const client = axios.create({
    baseURL: config.api.baseUrl,
    timeout: 10_000,
    headers: { 'Content-Type': 'application/json' },
  })

  client.interceptors.request.use((req) => {
    const tokens = tokenStore.get(telegramId)
    if (tokens?.access) {
      req.headers.Authorization = `Bearer ${tokens.access}`
    }
    return req
  })

  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        const tokens = tokenStore.get(telegramId)
        if (tokens?.refresh) {
          try {
            const res = await publicClient.post('/auth/refresh/', {
              refresh_token: tokens.refresh,
            })
            const newAccess = res.data.data.access_token
            tokenStore.set(telegramId, { ...tokens, access: newAccess })
            // Retry original request
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${newAccess}`
              return axios(error.config)
            }
          } catch {
            clearTokens(telegramId)
          }
        }
      }
      return Promise.reject(error)
    }
  )

  return client
}
