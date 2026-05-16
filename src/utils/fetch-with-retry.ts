const DEFAULT_RETRIES = 3
const DEFAULT_TIMEOUT_MS = 8000

interface FetchWithRetryOptions extends RequestInit {
  retries?: number
  timeoutMs?: number
}

function isRetryableFetchError(error: unknown) {
  return error instanceof TypeError || error instanceof DOMException
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  { timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...init }: FetchWithRetryOptions,
) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  { retries = DEFAULT_RETRIES, ...options }: FetchWithRetryOptions = {},
) {
  let lastError: unknown

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await fetchWithTimeout(input, options)
    } catch (error) {
      lastError = error

      if (!isRetryableFetchError(error) || attempt === retries) {
        throw error
      }
    }
  }

  throw lastError
}
