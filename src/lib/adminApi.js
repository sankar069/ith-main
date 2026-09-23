import { useAdminStore } from '../store/useAdminStore'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

/**
 * Thin fetch wrapper for /api/admin/** endpoints.
 * - Attaches the admin bearer token automatically.
 * - Parses JSON responses and throws ApiError with the server's message on failure.
 * - On a 401, clears the session so the UI falls back to the login screen.
 */
export async function adminFetch(path, { method = 'GET', body, headers, ...rest } = {}) {
  const { token, logout } = useAdminStore.getState()

  const res = await fetch(path, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  })

  // A 401 on a request that carried a token means the session itself was
  // rejected (expired/invalid) — clear it and bounce to login. A 401 with no
  // token attached (e.g. a login attempt) is just a normal auth failure like
  // wrong credentials, so fall through and surface the server's real message.
  if (res.status === 401 && token) {
    logout()
    throw new ApiError('Your session expired. Please log in again.', 401)
  }

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
    const message = (isJson && payload && payload.error) || 'Something went wrong. Please try again.'
    throw new ApiError(message, res.status)
  }

  return payload
}

/** Upload a File to Supabase Storage via /api/admin/upload, returns { url }. */
export async function adminUploadFile(file, folder) {
  const { token, logout } = useAdminStore.getState()
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })

  if (res.status === 401 && token) {
    logout()
    throw new ApiError('Your session expired. Please log in again.', 401)
  }

  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError((payload && payload.error) || 'Upload failed.', res.status)
  }
  return payload
}
