import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

function NavLink({ to, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative group py-2 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "text-orange-500"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white"
      }`}
    >
      {children}

      <span
        className={`absolute left-0 bottom-0 h-[2px] rounded-full bg-orange-500 transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0D0D0F]/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-[72px] flex items-center justify-between">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            onClick={closeMobile}
            className="group flex items-center gap-3"
          >
            <span className="relative w-9 h-9 rounded-xl bg-orange-500 text-black flex items-center justify-center shadow-sm shadow-orange-500/20 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-[18px] h-[18px]"
              >
                <path
                  d="M5 12.5L10 17L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

            </span>

            <span className="font-display font-bold text-xl tracking-tight text-gray-950 dark:text-white">
              JugaadU
            </span>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden lg:flex items-center gap-8">

            <NavLink to="/browse">
              Browse Needs
            </NavLink>

            {user && (
              <NavLink to="/connections">
                My Connections
              </NavLink>
            )}

            <NavLink to="/feedback">
              Feedback
            </NavLink>

          </div>

          {/* ================= DESKTOP ACTIONS ================= */}
          <div className="hidden lg:flex items-center gap-2.5">

            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="group w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:border-orange-300 dark:hover:border-orange-500/40 transition-all duration-300"
            >
              {theme === "dark" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-[17px] h-[17px] group-hover:rotate-45 transition-transform duration-300"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="4.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M12 2.5V4.5M12 19.5V21.5M4.5 12H2.5M21.5 12H19.5M5.6 5.6L4.2 4.2M19.8 19.8L18.4 18.4M18.4 5.6L19.8 4.2M4.2 19.8L5.6 18.4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-[17px] h-[17px] group-hover:rotate-[-15deg] transition-transform duration-300"
                >
                  <path
                    d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            {user && <NotificationBell />}

            {user ? (
              <>
                {/* Post Need */}
                <Link
                  to="/post-need"
                  className="group ml-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/15 transition-all duration-300"
                >
                  <span>Post a Need</span>

                  <span className="group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/15 transition-all duration-300"
                >
                  Create Account

                  <span className="group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </Link>
              </>
            )}

          </div>

          {/* ================= MOBILE ACTIONS ================= */}
          <div className="flex lg:hidden items-center gap-2">

            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-all"
            >
              {theme === "dark" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-[17px] h-[17px]"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="4.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M12 2.5V4.5M12 19.5V21.5M4.5 12H2.5M21.5 12H19.5M5.6 5.6L4.2 4.2M19.8 19.8L18.4 18.4M18.4 5.6L19.8 4.2M4.2 19.8L5.6 18.4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-[17px] h-[17px]"
                >
                  <path
                    d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              )}
            </button>

            {user && <NotificationBell />}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] flex flex-col items-center justify-center gap-1.5"
            >
              <span
                className={`w-4 h-[1.5px] bg-current transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-[3px]" : ""
                }`}
              />

              <span
                className={`w-4 h-[1.5px] bg-current transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-[1px]" : ""
                }`}
              />
            </button>

          </div>

        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`lg:hidden overflow-hidden border-t border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0D0D0F] transition-all duration-300 ${
            mobileOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 py-5">

            <div className="flex flex-col gap-1">

              <NavLink to="/browse" onClick={closeMobile}>
                Browse Needs
              </NavLink>

              {user && (
                <NavLink
                  to="/connections"
                  onClick={closeMobile}
                >
                  My Connections
                </NavLink>
              )}

              <NavLink to="/feedback" onClick={closeMobile}>
                Feedback
              </NavLink>

            </div>

            <div className="h-px bg-gray-200 dark:bg-white/10 my-4" />

            {user ? (
              <div className="flex flex-col gap-2">

                <Link
                  to="/post-need"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black text-sm font-semibold"
                >
                  Post a Need →
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  Logout
                </button>

              </div>
            ) : (
              <div className="flex flex-col gap-2">

                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="flex items-center justify-center w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black text-sm font-semibold"
                >
                  Create Account →
                </Link>

              </div>
            )}

          </div>
        </div>
      </nav>
    </>
  );
}