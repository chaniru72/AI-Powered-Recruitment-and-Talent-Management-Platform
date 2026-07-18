import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className="lg:pl-64"
        style={{
          width: "100%",
          height: "100vh",
          overflowX: "hidden",
          overflowY: "scroll",
          scrollbarGutter: "stable",
        }}
      >
        <header
          className="sticky top-0 z-20 flex h-20 items-center
            justify-between border-b border-slate-200 bg-white/95
            px-4 shadow-sm backdrop-blur sm:px-6 lg:px-8"
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Open sidebar"
              className="rounded-xl border border-slate-200 p-2.5
                text-slate-600 transition hover:bg-slate-100
                lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>

            <div
              className="hidden items-center gap-3 rounded-xl
                border border-slate-200 bg-slate-50 px-4
                sm:flex sm:w-72 lg:w-80"
            >
              <Search
                size={18}
                className="flex-none text-slate-400"
              />

              <input
                type="search"
                placeholder="Search jobs, applications..."
                className="h-11 w-full border-0 bg-transparent
                  text-sm text-slate-700 outline-none
                  placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-xl border
                border-slate-200 p-2.5 text-slate-600
                transition hover:bg-slate-100"
            >
              <Bell size={20} />

              <span
                className="absolute right-2 top-2 h-2 w-2
                  rounded-full border-2 border-white bg-red-500"
              />
            </button>

            <button
              type="button"
              className="flex items-center gap-3 rounded-xl
                border border-slate-200 px-2 py-1.5
                transition hover:bg-slate-50"
            >
              <span
                className="grid h-9 w-9 place-items-center
                  rounded-xl bg-gradient-to-br from-blue-500
                  to-indigo-600 text-sm font-bold text-white
                  shadow-md shadow-blue-200"
              >
                VK
              </span>

              <span className="hidden text-left sm:block">
                <strong className="block text-sm text-slate-800">
                  Vibhavi K.
                </strong>

                <small className="block text-xs text-slate-500">
                  Candidate
                </small>
              </span>

              <ChevronDown
                size={16}
                className="hidden text-slate-400 sm:block"
              />
            </button>
          </div>
        </header>

        <main className="p-4 pb-16 sm:p-6 sm:pb-16 lg:p-8 lg:pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}