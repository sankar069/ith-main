import { useStudentStore } from '../store/useStudentStore'

export class StudentApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

/**
 * Thin fetch wrapper for /api/student/** endpoints — mirrors adminFetch's
 * shape but reads the Supabase-issued session token from useStudentStore.
 */
export async function studentFetch(path, { method = 'GET', body, headers, ...rest } = {}) {
  const { token, logout } = useStudentStore.getState()

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
  // token attached is just a normal auth failure, so fall through and
  // surface the server's real message.
  if (res.status === 401 && token) {
    logout()
    throw new StudentApiError('Your session expired. Please log in again.', 401)
  }

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
    const message = (isJson && payload && payload.error) || 'Something went wrong. Please try again.'
    throw new StudentApiError(message, res.status)
  }

  return payload
}

/** Upload a File to Supabase Storage via /api/student/upload, returns { url }. */
export async function studentUploadFile(file, folder) {
  const { token, logout } = useStudentStore.getState()
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const res = await fetch('/api/student/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })

  if (res.status === 401 && token) {
    logout()
    throw new StudentApiError('Your session expired. Please log in again.', 401)
  }

  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    throw new StudentApiError((payload && payload.error) || 'Upload failed.', res.status)
  }
  return payload
}
