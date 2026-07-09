import { env } from '../config/env'
import { storage } from '../utils/storage'

const request = async (path, options = {}) => {
  const token = storage.get('vendors_online_token')
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  let data = null
  if (response.status !== 204) {
    try {
      data = await response.json()
    } catch (e) {
      // Ignore parsing errors for non-JSON responses
    }
  }

  if (!response.ok) {
    const errorMsg = data && data.message ? data.message : 'Request failed'
    throw new Error(errorMsg)
  }

  if (response.status === 204) return null

  if (data && data.success === false) {
    throw new Error(data.message || 'Request failed')
  }

  return data && data.result !== undefined ? data.result : data
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

