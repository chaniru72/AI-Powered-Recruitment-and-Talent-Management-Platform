import { useMemo, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./AdminLayout.css";

type StoredUser = {
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
};

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: "📊",
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: "👥",
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useMemo<StoredUser>(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return {};
    }

    try {
      return JSON.parse(storedUser) as StoredUser;
    } catch {
      return {};
    }
  }, []);

  const displayName =
    user.fullName || user.name || "System Administrator";

  const displayEmail = user.email || "admin@talentsync.ai";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart.charAt(0).toUpperCase())
    .join("");

  const pageTitle =
    navItems.find((item) =>
      location.pathname.startsWith(item.path),
    )?.label || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar admin-sidebar-desktop">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-mark">TS</div>

          <div>
            <p>TalentSync AI</p>
            <span>Admin Console</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "admin-nav-link admin-nav-link-active"
                  : "admin-nav-link"
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              {initials || "SA"}
            </div>

            <div>
              <p>{displayName}</p>
              <span>{displayEmail}</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <button
          type="button"
          className="admin-mobile-overlay"
          onClick={closeMobileMenu}
          aria-label="Close admin menu"
        />
      )}

      <aside
        className={
          isMobileMenuOpen
            ? "admin-sidebar admin-sidebar-mobile admin-sidebar-mobile-open"
            : "admin-sidebar admin-sidebar-mobile"
        }
      >
        <div className="admin-sidebar-brand">
          <div className="admin-brand-mark">TS</div>

          <div>
            <p>TalentSync AI</p>
            <span>Admin Console</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                isActive
                  ? "admin-nav-link admin-nav-link-active"
                  : "admin-nav-link"
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              {initials || "SA"}
            </div>

            <div>
              <p>{displayName}</p>
              <span>{displayEmail}</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open admin menu"
          >
            ☰
          </button>

          <div>
            <p>Admin Console</p>
            <h1>{pageTitle}</h1>
          </div>

          <div className="admin-topbar-profile">
            <div className="admin-user-avatar">
              {initials || "SA"}
            </div>

            <div>
              <p>{displayName}</p>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
