const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

export function buildApiEndpoint(path: string, fallbackEndpoint: string) {
  if (!API_BASE_URL) return fallbackEndpoint

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}
