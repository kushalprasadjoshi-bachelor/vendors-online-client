import { ArrowRight, LockKeyhole, Mail, Phone, Store, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/common/Logo'
import { routes } from '../../config/routes'
import { createRegisterDto } from '../../dtos'
import { useAuth } from '../../plugins/authContext'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [role, setRole] = useState('customer')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await register(createRegisterDto({
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      password: form.get('password'),
      role,
      storeName: form.get('storeName'),
    }))

    navigate(role === 'vendor' ? routes.vendorStore : routes.home)
  }

  return (
    <main className="auth-page">
      <section className="auth-visual register">
        <Logo />
        <h1>Start selling and shopping with confidence</h1>
        <p>Vendor storefronts, customer carts, simulated escrow, and OTP delivery verification are ready for the MERN backend.</p>
      </section>

      <section className="auth-panel">
        <div>
          <span>New account</span>
          <h2>Register</h2>
        </div>
        <div className="segmented-control" role="tablist" aria-label="Registration role">
          {['customer', 'vendor'].map((item) => (
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
          <label>Name<span><User size={18} /><input name="name" required placeholder="Full name" /></span></label>
          <label>Email<span><Mail size={18} /><input name="email" type="email" required placeholder="you@example.com" /></span></label>
          <label>Phone<span><Phone size={18} /><input name="phone" required placeholder="98XXXXXXXX" /></span></label>
          {role === 'vendor' && (
            <label>Store Name<span><Store size={18} /><input name="storeName" required placeholder="Your shop name" /></span></label>
          )}
          <label>Password<span><LockKeyhole size={18} /><input name="password" type="password" required placeholder="Create password" /></span></label>
          <button className="btn btn-dark wide" type="submit">Create Account <ArrowRight size={19} /></button>
        </form>
        <p className="auth-switch">Already registered? <Link to={routes.login}>Login</Link></p>
      </section>
    </main>
  )
}

export default RegisterPage

