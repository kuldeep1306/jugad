import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const exploreLinks = [
  { to: "/browse", label: "Browse Needs" },
  { to: "/post-need", label: "Post a Need" },
  { to: "/connections", label: "My Connections" },
];

const accountLinks = [
  { to: "/login", label: "Login" },
  { to: "/register", label: "Create Account" },
];

const socials = [
  {
    name: "Instagram",
    href: "#",
    path: "M12 2c2.7 0 3.05.01 4.12.06 1.07.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.5.5.86 1.07 1.15 1.77.25.64.42 1.36.47 2.43.05 1.07.06 1.42.06 4.12s-.01 3.05-.06 4.12c-.05 1.07-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.36.42-2.43.47-1.07.05-1.42.06-4.12.06s-3.05-.01-4.12-.06c-1.07-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.36-.47-2.43C2.01 15.05 2 14.7 2 12s.01-3.05.06-4.12c.05-1.07.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53c.64-.25 1.36-.42 2.43-.47C8.95 2.01 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.4 6.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z",
  },
  {
    name: "LinkedIn",
    href: "#",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.66 4.78 6.11V21h-4v-5.7c0-1.36-.02-3.1-1.89-3.1-1.9 0-2.19 1.48-2.19 3v5.8h-4V9Z",
  },
  {
    name: "Twitter",
    href: "#",
    path: "M22 5.9c-.75.33-1.55.55-2.39.65a4.2 4.2 0 0 0 1.83-2.3 8.3 8.3 0 0 1-2.64 1.01 4.15 4.15 0 0 0-7.08 3.78A11.78 11.78 0 0 1 3.15 4.6a4.15 4.15 0 0 0 1.28 5.54 4.1 4.1 0 0 1-1.88-.52v.05a4.16 4.16 0 0 0 3.33 4.08 4.2 4.2 0 0 1-1.87.07 4.16 4.16 0 0 0 3.88 2.89A8.35 8.35 0 0 1 2 18.4a11.77 11.77 0 0 0 6.38 1.87c7.66 0 11.85-6.35 11.85-11.85 0-.18 0-.36-.01-.54A8.5 8.5 0 0 0 22 5.9Z",
  },
];

function FooterLink({ to, label }) {
  return (
    <li>
      <Link
        to={to}
        className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all duration-300"
      >
        <span className="relative">
          {label}

          <span className="absolute left-0 -bottom-1 h-px w-0 bg-orange-400 group-hover:w-full transition-all duration-300" />
        </span>

        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-orange-400 transition-all duration-300">
          →
        </span>
      </Link>
    </li>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const element = footerRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer
        ref={footerRef}
        className="relative bg-[#111113] text-white overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

        <div
          className={`relative max-w-6xl mx-auto px-6 sm:px-8 transition-all duration-700 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          {/* ================= MAIN FOOTER ================= */}
          <div className="py-16 sm:py-20">

            <div className="grid lg:grid-cols-[1.7fr_1fr_1fr_1.4fr] gap-12 lg:gap-16">

              {/* ================= BRAND ================= */}
              <div>

                <Link
                  to="/"
                  className="inline-flex items-center gap-3 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-orange-500 text-black flex items-center justify-center shadow-lg shadow-orange-500/10 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-5 h-5"
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

                  <span className="font-display text-2xl font-bold tracking-tight">
                    JugaadU
                  </span>
                </Link>

                <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
                  A community marketplace where students can
                  buy, borrow, exchange, or give away things they
                  already have.
                </p>

                {/* Mini statement */}
                <div className="mt-7 flex items-center gap-3 text-xs text-gray-500">
                  <span className="w-8 h-px bg-orange-500" />
                  <span>Built for students, by students.</span>
                </div>

                {/* Socials */}
                <div className="flex gap-2.5 mt-7">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      aria-label={social.name}
                      className="group w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-400 hover:text-orange-400 hover:border-orange-500/40 hover:bg-orange-500/10 hover:-translate-y-1 transition-all duration-300"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d={social.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* ================= EXPLORE ================= */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 mb-5">
                  Explore
                </p>

                <ul className="space-y-4">
                  {exploreLinks.map((link) => (
                    <FooterLink key={link.to} {...link} />
                  ))}
                </ul>
              </div>

              {/* ================= ACCOUNT ================= */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 mb-5">
                  Account
                </p>

                <ul className="space-y-4">
                  {accountLinks.map((link) => (
                    <FooterLink key={link.to} {...link} />
                  ))}
                </ul>
              </div>

              {/* ================= CTA CARD ================= */}
              <div>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6">

                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />

                  <div className="relative">

                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-5">
                      ✦
                    </div>

                    <h3 className="font-display text-lg font-semibold">
                      Have something useful?
                    </h3>

                    <p className="text-sm leading-6 text-gray-400 mt-2">
                      Someone around you might be looking for exactly
                      what you already have.
                    </p>

                    <Link
                      to="/post-need"
                      className="group inline-flex items-center gap-2 mt-5 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      Post a Need
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </Link>

                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ================= BOTTOM BAR ================= */}
          <div className="border-t border-white/10 py-6">

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} JugaadU. All rights reserved.
              </p>

              <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-wider text-gray-500">
                <span>Buy</span>
                <span className="text-orange-500">•</span>
                <span>Borrow</span>
                <span className="text-orange-500">•</span>
                <span>Exchange</span>
                <span className="text-orange-500">•</span>
                <span>Give</span>
              </div>

            </div>
          </div>
        </div>
      </footer>

      {/* ================= BACK TO TOP ================= */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`
          fixed bottom-6 right-6 z-50
          w-11 h-11 rounded-xl
          bg-white dark:bg-[#1C1C1F]
          border border-gray-200 dark:border-white/10
          text-gray-700 dark:text-white
          shadow-xl
          flex items-center justify-center
          hover:-translate-y-1
          hover:border-orange-400
          hover:text-orange-500
          transition-all duration-300
          ${
            showTop
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }
        `}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4"
        >
          <path
            d="M12 19V5M12 5L6 11M12 5L18 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}