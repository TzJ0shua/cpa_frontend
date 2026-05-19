const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

export function buildApiEndpoint(path: string) {
  const baseUrl = API_BASE_URL ?? 'http://localhost:8080'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${baseUrl}${normalizedPath}`
}
