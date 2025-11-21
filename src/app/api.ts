import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = (typeof window !== 'undefined' && localStorage.getItem('token')) || undefined
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText
      return Promise.reject(new Error(message))
    }
    return Promise.reject(new Error(error))
  }
)

export function handleApiError(err: unknown): string {
  if (err instanceof Error) return err.message
  try { return String(err) } catch { return 'Unknown error' }
}

export default api
