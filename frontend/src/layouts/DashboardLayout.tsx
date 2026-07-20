import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  UserRound,
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
    path: "/candidate/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Find Jobs",
    path: "/candidate/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Applications",
    path: "/candidate/applications",
    icon: FileText,
  },
  {
    name: "Messages",
    path: "/candidate/messages",
    icon: MessageSquareText,
  },
  {
    name: "Profile",
    path: "/candidate/profile",
    icon: UserRound,
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
    return "CA";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = useMemo(readStoredUser, []);

  const displayName =
    storedUser?.fullName?.trim() ||
    storedUser?.name?.trim() ||
    storedUser?.email?.split("@")[0] ||
    "Candidate";

  const displayRole =
    storedUser?.role?.trim() || "Candidate";

  const initials = createInitials(displayName);

  const currentPage =
    navigationItems.find((item) =>
      location.pathname.startsWith(item.path),
    )?.name ?? "Candidate Portal";

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
          aria-label="Candidate navigation"
        >
          <div className="candidate-rail-brand">
            <button
              type="button"
              aria-label="Open candidate dashboard"
              onClick={() =>
                navigate("/candidate/dashboard")
              }
              className="candidate-rail-logo"
            >
              <BriefcaseBusiness size={22} />
            </button>

            <div className="candidate-rail-brand-copy">
              <strong>
                TalentSync <span>AI</span>
              </strong>

              <small>Career workspace</small>
            </div>
          </div>

          <div className="candidate-rail-caption">
            <p>Candidate portal</p>
            <span>Hire. Succeed. Grow.</span>
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
                aria-label="Open navigation"
                onClick={() => setMobileMenuOpen(true)}
                className="candidate-menu-button"
              >
                <Menu size={21} />
              </button>

              <div className="candidate-page-heading">
                <p>TalentSync candidate portal</p>
                <h1>{currentPage}</h1>
              </div>

              <label className="candidate-search">
                <Search size={18} />

                <input
                  type="search"
                  placeholder="Search jobs and applications"
                  aria-label="Search jobs and applications"
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
                <span aria-hidden="true" />
              </button>

              <button
                type="button"
                className="candidate-account"
                aria-label="Open account menu"
              >
                <span className="candidate-avatar">
                  {initials}
                </span>

                <span className="candidate-account-text">
                  <strong>{displayName}</strong>
                  <small>{displayRole}</small>
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
          aria-label="Close navigation overlay"
          onClick={() => setMobileMenuOpen(false)}
          className="candidate-mobile-overlay"
        />
      )}

      <aside
        className={`candidate-mobile-sidebar ${
          mobileMenuOpen ? "is-open" : ""
        }`}
        aria-label="Mobile candidate navigation"
      >
        <div className="candidate-mobile-header">
          <button
            type="button"
            onClick={() =>
              navigate("/candidate/dashboard")
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
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="candidate-mobile-close"
          >
            <X size={21} />
          </button>
        </div>

        <div className="candidate-mobile-introduction">
          <p>Candidate portal</p>
          <span>Hire. Succeed. Grow.</span>
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