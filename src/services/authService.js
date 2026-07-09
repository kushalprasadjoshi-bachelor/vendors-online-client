import { env } from '../config/env'
import { createUserDto } from '../dtos'
import { storage } from '../utils/storage'
import { apiClient } from './apiClient'

const demoNames = {
  customer: 'Demo Customer',
  vendor: 'Demo Vendor',
  admin: 'Demo Admin',
}

export const authService = {
  async login(dto) {
    if (!env.enableMocks) return apiClient.post('/auth/login', dto)

    const user = createUserDto({
      id: `demo_${dto.role}`,
      name: demoNames[dto.role],
      email: dto.email,
      role: dto.role,
    })
    const token = `mock-token-${dto.role}`
    storage.set('vendors_online_token', token)
    storage.set('vendors_online_user', user)

    return { user, token }
  },
  async register(dto) {
    if (!env.enableMocks) return apiClient.post('/auth/register', dto)

    const user = createUserDto({
      id: `demo_${dto.role}`,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      role: dto.role,
    })
    const token = `mock-token-${dto.role}`
    storage.set('vendors_online_token', token)
    storage.set('vendors_online_user', user)

    return { user, token }
  },
  logout() {
    storage.remove('vendors_online_token')
    storage.remove('vendors_online_user')
  },
}

