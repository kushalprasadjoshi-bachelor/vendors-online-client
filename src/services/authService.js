import { storage } from '../utils/storage'
import { apiClient } from './apiClient'

export const authService = {
  async login(dto) {
    const res = await apiClient.post('/auth/login', dto)
    if (res && res.token) {
      storage.set('vendors_online_token', res.token)
      storage.set('vendors_online_user', res.user)
    }
    return res;
  },
  async register(dto) {
    const res = await apiClient.post('/auth/register', dto)
    if (res && res.token) {
      storage.set('vendors_online_token', res.token)
      storage.set('vendors_online_user', res.user)
    }
    return res;
  },
  logout() {
    storage.remove('vendors_online_token')
    storage.remove('vendors_online_user')
  },
}
