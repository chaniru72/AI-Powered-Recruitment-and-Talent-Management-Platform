import {
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  UserRound,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
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
    name: "My Applications",
    path: "/candidate/applications",
    icon: FileText,
  },
  {
    name: "Messages",
    path: "/candidate/messages",
    icon: MessageSquareText,
  },
  {
    name: "My Profile",
    path: "/candidate/profile",
    icon: UserRound,
  },
];

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col
          bg-gradient-to-b from-blue-950 to-blue-900 text-white
          shadow-2xl transition-transform duration-300 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <button
            type="button"
            className="flex items-center gap-3"
            onClick={() => navigate("/candidate/dashboard")}
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
              <BriefcaseBusiness size={21} />
            </span>

            <span className="text-lg font-bold">
              TalentSync <span className="text-blue-300">AI</span>
            </span>
          </button>

          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-blue-100 hover:bg-white/10 lg:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
            Candidate Portal
          </p>

          <p className="mt-2 text-sm text-blue-100/70">
            Find your next opportunity
          </p>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3
                  text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-950/30"
                      : "text-blue-100/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3
              text-sm font-medium text-blue-100/75 transition
              hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut size={19} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}