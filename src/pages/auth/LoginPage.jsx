import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/common/Logo'
import { routes } from '../../config/routes'
import { createLoginDto } from '../../dtos'
import { useAuth } from '../../plugins/authContext'

const roleDestinations = {
  customer: routes.home,
  vendor: routes.vendor,
  admin: routes.admin,
}

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [role, setRole] = useState('customer')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await login(createLoginDto({
      email: form.get('email'),
      password: form.get('password'),
      role,
    }))
    navigate(roleDestinations[role])
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Logo />
        <h1>Welcome back to VendorsOnline</h1>
        <p>Manage shopping, storefront operations, and escrow delivery confirmations from one account.</p>
      </section>

      <section className="auth-panel">
        <div>
          <span>Secure access</span>
          <h2>Login</h2>
        </div>
        <div className="segmented-control" role="tablist" aria-label="Login role">
          {['customer', 'vendor', 'admin'].map((item) => (
            <button
              className={item === role ? 'active' : ''}
              key={item}
              type="button"
              onClick={() => setRole(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <span><Mail size={18} /><input name="email" type="email" required defaultValue={`${role}@vendorsonline.test`} /></span>
          </label>
          <label>
            Password
            <span><LockKeyhole size={18} /><input name="password" type="password" required defaultValue="password123" /></span>
          </label>
          <button className="btn btn-dark wide" type="submit">Login <ArrowRight size={19} /></button>
        </form>
        <p className="auth-switch">New here? <Link to={routes.register}>Create an account</Link></p>
      </section>
    </main>
  )
}

export default LoginPage

