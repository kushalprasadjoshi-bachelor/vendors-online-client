export const roles = {
  customer: 'customer',
  vendor: 'vendor',
  admin: 'admin',
}

export const hasRole = (user, allowedRoles = []) => {
  if (!user) return false
  return allowedRoles.includes(user.role)
}

