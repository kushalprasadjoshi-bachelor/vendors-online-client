import { roles } from '../utils/guards'

export const createLoginDto = ({ email = '', password = '', role = roles.customer } = {}) => ({
  email: email.trim().toLowerCase(),
  password,
  role,
})

export const createRegisterDto = ({
  name = '',
  email = '',
  phone = '',
  password = '',
  role = roles.customer,
  storeName = '',
} = {}) => ({
  name: name.trim(),
  email: email.trim().toLowerCase(),
  phone,
  password,
  role,
  storeName: storeName.trim(),
})

