import { roles } from '../utils/guards'

export const createUserDto = ({
  id = '',
  name = '',
  email = '',
  phone = '',
  role = roles.customer,
  status = 'active',
  avatarUrl = '',
  createdAt = new Date().toISOString(),
} = {}) => ({
  id,
  name: name.trim(),
  email: email.trim().toLowerCase(),
  phone,
  role,
  status,
  avatarUrl,
  createdAt,
})

