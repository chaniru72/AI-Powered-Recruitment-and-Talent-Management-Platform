import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UsersRound,
  X,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./DashboardLayout.css";

type StoredUser = {
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
};

const navigationItems = [
  {
    name: "Dashboard",
    path: "/hiring-manager/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Candidates",
    path: "/hiring-manager/candidates",
    icon: UsersRound,
  },
];

function readStoredUser(): StoredUser | null {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as StoredUser;
  } catch {
    return null;
  }
}

function createInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "HM";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function HiringManagerLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = useMemo(readStoredUser, []);

  const displayName =
    storedUser?.fullName?.trim() ||
    storedUser?.name?.trim() ||
    storedUser?.email?.split("@")[0] ||
    "";

  const displayRole =
    storedUser?.role?.trim() || "";

  const initials = createInitials(
    displayName || displayRole,
  );

  const currentPage =
    navigationItems.find((item) =>
      location.pathname.startsWith(item.path),
    )?.name ?? "Hiring Manager Portal";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="candidate-layout">
      <div className="candidate-layout-inner">
        <aside
          className="candidate-rail"
          aria-label="Hiring manager navigation"
        >
          <div className="candidate-rail-brand">
            <button
              type="button"
              aria-label="Open hiring manager dashboard"
              onClick={() =>
                navigate("/hiring-manager/dashboard")
              }
              className="candidate-rail-logo"
            >
              <BriefcaseBusiness size={22} />
            </button>

            <div className="candidate-rail-brand-copy">
              <strong>
                TalentSync <span>AI</span>
              </strong>

              <small>Decision workspace</small>
            </div>
          </div>

          <div className="candidate-rail-caption">
            <p>Hiring manager portal</p>
            <span>Review. Decide. Hire.</span>
          </div>

          <nav className="candidate-rail-navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `candidate-rail-link ${
                      isActive ? "is-active" : ""
                    }`
                  }
                >
                  <span className="candidate-rail-icon">
                    <Icon size={20} />
                  </span>

                  <span className="candidate-tooltip">
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label="Sign out"
            onClick={handleLogout}
            className="candidate-logout"
          >
            <span className="candidate-rail-icon">
              <LogOut size={20} />
            </span>

            <span className="candidate-tooltip">
              Sign out
            </span>
          </button>
        </aside>

        <section className="candidate-workspace">
          <header className="candidate-topbar">
            <div className="candidate-topbar-left">
              <button
                type="button"
                aria-label="Open hiring manager navigation"
                onClick={() => setMobileMenuOpen(true)}
                className="candidate-menu-button"
              >
                <Menu size={21} />
              </button>

              <div className="candidate-page-heading">
                <p>TalentSync hiring manager portal</p>
                <h1>{currentPage}</h1>
              </div>

              <label className="candidate-search">
                <Search size={18} />

                <input
                  type="search"
                  placeholder="Search candidates"
                  aria-label="Search candidates"
                />
              </label>
            </div>

            <div className="candidate-topbar-actions">
              <button
                type="button"
                aria-label="Notifications"
                className="candidate-notification"
              >
                <Bell size={19} />
              </button>

              <button
                type="button"
                className="candidate-account"
                aria-label="Open hiring manager account menu"
              >
                <span className="candidate-avatar">
                  {initials}
                </span>

                <span className="candidate-account-text">
                  <strong>{displayName}</strong>
                  <span>{displayRole}</span>
                </span>

                <ChevronDown
                  size={16}
                  className="candidate-account-arrow"
                />
              </button>
            </div>
          </header>

          <main className="candidate-content-scroll">
            <div className="candidate-content-inner">
              <Outlet />
            </div>
          </main>
        </section>
      </div>

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close hiring manager navigation overlay"
          onClick={() => setMobileMenuOpen(false)}
          className="candidate-mobile-overlay"
        />
      )}

      <aside
        className={`candidate-mobile-sidebar ${
          mobileMenuOpen ? "is-open" : ""
        }`}
        aria-label="Mobile hiring manager navigation"
      >
        <div className="candidate-mobile-header">
          <button
            type="button"
            onClick={() =>
              navigate("/hiring-manager/dashboard")
            }
            className="candidate-mobile-brand"
          >
            <span>
              <BriefcaseBusiness size={21} />
            </span>

            <strong>
              TalentSync <b>AI</b>
            </strong>
          </button>

          <button
            type="button"
            aria-label="Close hiring manager navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="candidate-mobile-close"
          >
            <X size={21} />
          </button>
        </div>

        <div className="candidate-mobile-introduction">
          <strong>Hiring manager portal</strong>
          <p>Review. Decide. Hire.</p>
        </div>

        <nav className="candidate-mobile-navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `candidate-mobile-link ${
                    isActive ? "is-active" : ""
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="candidate-mobile-logout"
        >
          <LogOut size={20} />
          <span>Sign out</span>
        </button>
      </aside>
    </div>
  );
}