import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import Logo from "../common/Logo";

const DashboardShell = ({ navItems, title, eyebrow, user, onLogout }) => (
  <div className="dashboard-shell">
    <aside className="dashboard-sidebar">
      <Logo compact />
      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path.split("/").length === 2}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>

    <section className="dashboard-main">
      <header className="dashboard-topbar">
        <div>
          <span>{eyebrow}</span>
          <h1>{title}</h1>
        </div>
        <div className="dashboard-user">
          <span>{user?.name || "Preview User"}</span>
          <button
            className="icon-button"
            type="button"
            onClick={onLogout}
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <Outlet />
    </section>
  </div>
);

export default DashboardShell;
