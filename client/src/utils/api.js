import axios from 'axios'

// Ensure baseURL always targets the Express /api prefix
function resolveBaseURL() {
  const raw = import.meta.env.VITE_API_URL
  // Default to local server origin
  let url = raw && typeof raw === 'string' && raw.trim() ? raw.trim() : 'http://localhost:5000'
  // Remove trailing slashes
  url = url.replace(/\/+$/, '')
  // If it doesn't already end with /api, append it
  if (!/\/api$/i.test(url)) url += '/api'
  return url
}

const baseURL = resolveBaseURL()

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (typeof window !== 'undefined' && window.location?.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
