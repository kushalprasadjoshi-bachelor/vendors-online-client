import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  ReceiptText,
  Search,
  ShoppingCart,
  UserCircle,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { storefrontNav } from "../../config/navigation";
import { routes } from "../../config/routes";
import { useAuth } from "../../plugins/authContext";
import { useCart } from "../../plugins/cartContext";
import { catalogService } from "../../services/catalogService";
import Logo from "../common/Logo";

const dashboardPath = {
  vendor: routes.vendor,
  admin: routes.admin,
};

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { count } = useCart();
  const [promoVisible, setPromoVisible] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    catalogService
      .getCategories()
      .then((items) => setCategories(items.filter(Boolean)))
      .catch(() => setCategories([]));
  }, []);

  // close categories dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      const path = e.composedPath ? e.composedPath() : [];
      if (
        !path.some(
          (el) =>
            el.classList &&
            el.classList.contains &&
            el.classList.contains("categories-root"),
        )
      ) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget)
      .get("search")
      ?.toString()
      .trim();

    if (value) navigate(`${routes.search}?query=${encodeURIComponent(value)}`);
  };

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate(routes.home);
  };

  return (
    <header className="bg-white shadow-sm">
      {promoVisible && !user && (
        <div className="bg-black text-white px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium">
            Sign up and get 20% off to your first order.
          </span>
          <div className="flex items-center gap-2">
            <NavLink
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-100"
              to={routes.register}
            >
              Sign Up Now
            </NavLink>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition hover:bg-slate-900"
              type="button"
              aria-label="Dismiss promotion"
              onClick={() => setPromoVisible(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <nav className="flex flex-wrap items-center justify-between gap-4 py-4 px-4 max-w-7xl mx-auto">
        <NavLink
          className="inline-flex items-center"
          to={routes.home}
          aria-label="VendorsOnline home"
        >
          <Logo />
        </NavLink>

        <div className="hidden items-center gap-4 lg:flex">
          {storefrontNav.map((item) =>
            item.label === "Categories" ? (
              <div className="relative categories-root" key={item.label}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 transition hover:text-slate-900"
                  onClick={() => setCategoriesOpen((s) => !s)}
                  aria-expanded={categoriesOpen}
                >
                  <span>{item.label}</span>
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
                <div
                  className={`absolute left-0 top-full z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg ${categoriesOpen ? "visible opacity-100" : "invisible opacity-0"} transition-all duration-150`}
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <NavLink
                        key={category}
                        className="block px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        to={`${routes.stores}?category=${encodeURIComponent(category)}`}
                        onClick={() => setCategoriesOpen(false)}
                      >
                        {category}
                      </NavLink>
                    ))
                  ) : (
                    <span className="block px-4 py-2 text-sm text-slate-500">
                      No categories yet
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-sm font-bold text-slate-900 transition"
                    : "text-sm text-slate-700 hover:text-slate-900 transition"
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ),
          )}
        </div>

        <form
          className="flex w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 sm:w-auto"
          onSubmit={handleSearch}
        >
          <Search size={20} aria-hidden="true" className="text-slate-500" />
          <input
            name="search"
            type="search"
            placeholder="Search shops and products"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </form>

        <div className="flex items-center gap-3">
          <NavLink
            className="relative inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-100"
            to={routes.cart}
            aria-label="Cart"
          >
            <ShoppingCart size={26} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[0.65rem] font-semibold text-white">
                {count}
              </span>
            )}
          </NavLink>

          <div className="relative">
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
              type="button"
              aria-label="Account menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((open) => !open)}
            >
              <UserCircle size={28} />
            </button>
            {accountOpen && (
              <div className="absolute right-0 z-30 mt-2 w-72 min-w-[18rem] overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                {user ? (
                  <>
                    <div className="mb-3 border-b border-slate-200 pb-3">
                      <strong className="block text-sm font-semibold text-slate-900">
                        {user.name}
                      </strong>
                      <span className="block text-xs text-slate-500">
                        {user.email}
                      </span>
                      <small className="block text-xs uppercase tracking-[0.08em] text-slate-900">
                        {user.role}
                      </small>
                    </div>
                    {user.role === "customer" ? (
                      <>
                        <NavLink
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                          to={routes.orders}
                          onClick={() => setAccountOpen(false)}
                        >
                          <ReceiptText size={16} />
                          My Orders
                        </NavLink>
                        <NavLink
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                          to={routes.profile}
                          onClick={() => setAccountOpen(false)}
                        >
                          <UserCircle size={16} />
                          Profile
                        </NavLink>
                        <NavLink
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                          to={routes.search}
                          onClick={() => setAccountOpen(false)}
                        >
                          <PackageCheck size={16} />
                          Browse Products
                        </NavLink>
                      </>
                    ) : (
                      <NavLink
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        to={dashboardPath[user.role] || routes.home}
                        onClick={() => setAccountOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </NavLink>
                    )}
                    <button
                      className="flex w-full items-center justify-start gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                      type="button"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      to={routes.login}
                      onClick={() => setAccountOpen(false)}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      to={routes.register}
                      onClick={() => setAccountOpen(false)}
                    >
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
