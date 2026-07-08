import { ChevronDown, Search, ShoppingCart, UserCircle, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { storefrontNav } from '../../config/navigation'
import { routes } from '../../config/routes'
import { useAuth } from '../../plugins/authContext'
import { useCart } from '../../plugins/cartContext'
import Logo from '../common/Logo'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { count } = useCart()

  const handleSearch = (event) => {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('search')?.toString().trim()

    if (value) navigate(`/stores?query=${encodeURIComponent(value)}`)
  }

  return (
    <header className="site-header">
      <div className="promo-bar">
        <span>Sign up and get 20% off to your first order.</span>
        <NavLink to={routes.register}>Sign Up Now</NavLink>
        <button className="icon-button promo-close" type="button" aria-label="Dismiss promotion">
          <X size={18} />
        </button>
      </div>

      <nav className="navbar container-shell">
        <NavLink className="navbar-logo" to={routes.home} aria-label="VendorsOnline home">
          <Logo />
        </NavLink>

        <div className="navbar-links">
          {storefrontNav.map((item) => (
            <NavLink key={item.label} to={item.path}>
              <span>{item.label}</span>
              {item.label === 'Categories' && <ChevronDown size={16} aria-hidden="true" />}
            </NavLink>
          ))}
        </div>

        <form className="search-box" onSubmit={handleSearch}>
          <Search size={20} aria-hidden="true" />
          <input name="search" type="search" placeholder="What are you looking about?" />
        </form>

        <div className="navbar-actions">
          <NavLink className="icon-button cart-button" to={routes.cart} aria-label="Cart">
            <ShoppingCart size={26} />
            {count > 0 && <span>{count}</span>}
          </NavLink>
          <NavLink className="icon-button" to={user ? routes.orders : routes.login} aria-label="Account">
            <UserCircle size={28} />
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
