import { supabase } from '../../supabase/client'

export class AdminApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
  }
}

type QueryValue = string | number | boolean | null | undefined

type ApiOptions = {
  query?: Record<string, QueryValue>
  body?: Record<string, unknown>
  method?: 'GET' | 'POST'
}

export async function adminApi<T>(action: string, options: ApiOptions = {}): Promise<T> {
  const method = options.method ?? (options.body ? 'POST' : 'GET')
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new AdminApiError('Your session has expired. Please sign in again.', 401)
  }

  const params = new URLSearchParams({ action })
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.access_token}`,
  }
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (publishableKey) headers.apikey = publishableKey
  if (method === 'POST') headers['Content-Type'] = 'application/json'

  const response = await fetch(`/api/admin?${params.toString()}`, {
    method,
    headers,
    body: method === 'POST' ? JSON.stringify(options.body ?? {}) : undefined,
  })

  const payload = (await response.json().catch(() => null)) as { data?: T; error?: string } | null
  if (!response.ok) {
    throw new AdminApiError(payload?.error ?? `Request failed with status ${response.status}.`, response.status)
  }

  return (payload?.data ?? (payload as unknown)) as T
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export async function fetchAsBlob(url: string): Promise<Blob> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Download failed with status ${response.status}.`)
  return response.blob()
}
