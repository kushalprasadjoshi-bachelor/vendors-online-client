import { ChevronDown, LayoutDashboard, LogOut, PackageCheck, ReceiptText, Search, ShoppingCart, UserCircle, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { storefrontNav } from '../../config/navigation'
import { routes } from '../../config/routes'
import { useAuth } from '../../plugins/authContext'
import { useCart } from '../../plugins/cartContext'
import { catalogService } from '../../services/catalogService'
import Logo from '../common/Logo'

const dashboardPath = {
  vendor: routes.vendor,
  admin: routes.admin,
}

const Navbar = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { count } = useCart()
  const [promoVisible, setPromoVisible] = useState(true)
  const [categories, setCategories] = useState([])
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    catalogService.getCategories()
      .then((items) => setCategories(items.filter(Boolean)))
      .catch(() => setCategories([]))
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('search')?.toString().trim()

    if (value) navigate(`${routes.search}?query=${encodeURIComponent(value)}`)
  }

  const handleLogout = () => {
    logout()
    setAccountOpen(false)
    navigate(routes.home)
  }

  return (
    <header className="site-header">
      {promoVisible && !user && (
        <div className="promo-bar">
          <span>Sign up and get 20% off to your first order.</span>
          <NavLink to={routes.register}>Sign Up Now</NavLink>
          <button
            className="icon-button promo-close"
            type="button"
            aria-label="Dismiss promotion"
            onClick={() => setPromoVisible(false)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      <nav className="navbar container-shell">
        <NavLink className="navbar-logo" to={routes.home} aria-label="VendorsOnline home">
          <Logo />
        </NavLink>

        <div className="navbar-links">
          {storefrontNav.map((item) => (
            item.label === 'Categories' ? (
              <div className="nav-dropdown" key={item.label}>
                <NavLink to={item.path}>
                  <span>{item.label}</span>
                  <ChevronDown size={16} aria-hidden="true" />
                </NavLink>
                <div className="nav-dropdown-menu">
                  {categories.length > 0 ? categories.map((category) => (
                    <NavLink
                      key={category}
                      to={`${routes.stores}?category=${encodeURIComponent(category)}`}
                    >
                      {category}
                    </NavLink>
                  )) : (
                    <span>No categories yet</span>
                  )}
                </div>
              </div>
            ) : (
              <NavLink key={item.label} to={item.path}>
                <span>{item.label}</span>
              </NavLink>
            )
          ))}
        </div>

        <form className="search-box" onSubmit={handleSearch}>
          <Search size={20} aria-hidden="true" />
          <input name="search" type="search" placeholder="Search shops and products" />
        </form>

        <div className="navbar-actions">
          <NavLink className="icon-button cart-button" to={routes.cart} aria-label="Cart">
            <ShoppingCart size={26} />
            {count > 0 && <span>{count}</span>}
          </NavLink>
          <div className="account-menu">
            <button
              className="icon-button"
              type="button"
              aria-label="Account menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((open) => !open)}
            >
              <UserCircle size={28} />
            </button>
            {accountOpen && (
              <div className="account-dropdown">
                {user ? (
                  <>
                    <div className="account-summary">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <small>{user.role}</small>
                    </div>
                    {user.role === 'customer' ? (
                      <>
                        <NavLink to={routes.orders} onClick={() => setAccountOpen(false)}>
                          <ReceiptText size={16} />My Orders
                        </NavLink>
                        <NavLink to={routes.search} onClick={() => setAccountOpen(false)}>
                          <PackageCheck size={16} />Browse Products
                        </NavLink>
                      </>
                    ) : (
                      <NavLink to={dashboardPath[user.role] || routes.home} onClick={() => setAccountOpen(false)}>
                        <LayoutDashboard size={16} />Dashboard
                      </NavLink>
                    )}
                    <button type="button" onClick={handleLogout}>
                      <LogOut size={16} />Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to={routes.login} onClick={() => setAccountOpen(false)}>Login</NavLink>
                    <NavLink to={routes.register} onClick={() => setAccountOpen(false)}>Register</NavLink>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
