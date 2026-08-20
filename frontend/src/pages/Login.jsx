import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login nahi ho paya. Dobara try karo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-68px)] bg-paper dark:bg-ink flex items-center justify-center px-5 py-12 sm:py-16">

      <div className="w-full max-w-[430px]">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-8">

          {/* Logo */}
          <Link
            to="/"
            className="inline-flex items-center justify-center group mb-6"
          >
            <span className="w-11 h-11 rounded-2xl bg-marigold flex items-center justify-center shadow-sm group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
              >
                <path
                  d="M4 12L10 18L20 6"
                  stroke="#18181B"
                  strokeWidth="2.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-paper">
            Welcome back 👋
          </h1>

          <p className="text-muted dark:text-darkmuted text-sm mt-2.5">
            Login karo aur apni campus community se connect karo.
          </p>

        </div>

        {/* ================= CARD ================= */}
        <div className="bg-white dark:bg-darkcard border border-line dark:border-darkborder rounded-2xl p-6 sm:p-8 shadow-sm">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 px-4 py-3.5 rounded-xl mb-5">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 mt-0.5 shrink-0"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 8V12M12 16H12.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <p className="text-sm leading-5">
                {error}
              </p>

            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-darkmuted mb-2"
              >
                Email address
              </label>

              <div className="relative">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M3 7L12 13L21 7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-line dark:border-darkborder bg-paper/50 dark:bg-ink text-ink dark:text-paper text-sm placeholder:text-gray-400 focus:outline-none focus:border-marigold focus:ring-4 focus:ring-marigold/10 transition-all"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-darkmuted"
                >
                  Password
                </label>

              </div>

              <div className="relative">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M8 10V7.5A4 4 0 0 1 16 7.5V10"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-line dark:border-darkborder bg-paper/50 dark:bg-ink text-ink dark:text-paper text-sm placeholder:text-gray-400 focus:outline-none focus:border-marigold focus:ring-4 focus:ring-marigold/10 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-marigold transition-colors"
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-4 h-4"
                    >
                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6A2 2 0 0 0 13.4 13.4M9.9 5.2A10.6 10.6 0 0 1 12 5c5.2 0 8.5 5.5 8.5 5.5a15 15 0 0 1-2.1 2.8M6.2 6.2C3.9 7.8 3.5 10.5 3.5 10.5S6.8 16 12 16c1 0 1.9-.2 2.7-.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-4 h-4"
                    >
                      <path
                        d="M3.5 12S6.8 6.5 12 6.5 20.5 12 20.5 12 17.2 17.5 12 17.5 3.5 12 3.5 12Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                  )}
                </button>

              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-ink dark:bg-marigold text-paper dark:text-ink font-semibold text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-marigold/15 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-paper/40 dark:border-ink/40 border-t-paper dark:border-t-ink animate-spin" />
                  Logging you in...
                </>
              ) : (
                <>
                  Login to JugaadU
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4"
                  >
                    <path
                      d="M5 12H19M13 6L19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-line dark:bg-darkborder" />
            <span className="text-[10px] uppercase tracking-widest text-muted dark:text-darkmuted">
              New here?
            </span>
            <div className="flex-1 h-px bg-line dark:bg-darkborder" />
          </div>

          {/* Register */}
          <Link
            to="/register"
            className="w-full h-11 rounded-xl border border-line dark:border-darkborder flex items-center justify-center text-sm font-semibold text-ink dark:text-paper hover:border-marigold hover:text-marigold hover:bg-marigold/5 transition-all duration-300"
          >
            Create your account
          </Link>

        </div>

        {/* Footer text */}
        <p className="text-center text-[11px] text-muted dark:text-darkmuted mt-6">
          Buy · Borrow · Exchange · Free
        </p>

      </div>
    </main>
  );
}