import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Connections() {
  const { user } = useAuth();

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = () => {
    setLoading(true);
    setError(null);
    api
      .get("/connections")
      .then((res) => setConnections(res.data))
      .catch((err) => {
        setConnections([]);
        setError(
          err?.response?.data?.message ||
            "Connections load nahi ho payi. Please try again."
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const getInitials = (name = "") => {
    return (
      name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U"
    );
  };

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return {
        wrapper:
          "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
        dot: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        label: "Completed",
      };
    }

    return {
      wrapper:
        "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20",
      dot: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-400",
      label: "Active",
    };
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-[#0D0D0F] text-gray-900 dark:text-white">

      {/* ================= HEADER ================= */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-white/[0.08]">

        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-orange-200/30 dark:bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-10">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

            <div>

              <div className="flex items-center gap-2 mb-4">

                <span className="w-2 h-2 rounded-full bg-orange-500" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                  Your activity
                </span>

              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-gray-950 dark:text-white">
                My Connections
              </h1>

              <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl leading-7">
                Keep track of people you've connected with and
                continue your conversations from here.
              </p>

            </div>

            {!loading && connections.length > 0 && (
              <div className="flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-green-500" />

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {connections.length}{" "}
                  {connections.length === 1
                    ? "connection"
                    : "connections"}
                </span>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 sm:py-12">

        {error ? (

          /* ================= ERROR STATE ================= */
          <div className="relative overflow-hidden rounded-3xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-6 py-16 text-center">
            <div className="relative">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-2xl mb-6">
                ⚠️
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Kuch gadbad ho gayi
              </h2>

              <p className="max-w-md mx-auto mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {error}
              </p>

              <button
                onClick={fetchConnections}
                className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/15 transition-all duration-300"
              >
                Retry
              </button>
            </div>
          </div>

        ) : loading ? (

          /* ================= SKELETON ================= */
          <div className="space-y-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[100px] rounded-2xl bg-white dark:bg-white/[0.035] border border-gray-200 dark:border-white/10 animate-pulse"
              />
            ))}

          </div>

        ) : connections.length === 0 ? (

          /* ================= EMPTY STATE ================= */
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-white/[0.025] px-6 py-20 text-center">

            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative">

              <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-2xl mb-6">
                💬
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                No connections yet
              </h2>

              <p className="max-w-md mx-auto mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Jab kisi need par deal start hogi, your connection
                will appear here so you can continue the conversation.
              </p>

              <Link
                to="/browse"
                className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/15 transition-all duration-300"
              >
                Browse Needs
                <span>→</span>
              </Link>

            </div>

          </div>

        ) : (

          /* ================= CONNECTION LIST ================= */
          <div>

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Connections
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Your active and completed deals.
                </p>
              </div>

            </div>

            <div className="space-y-3">

              {connections.map((connection, index) => {

                const otherPerson =
                  connection.requesterId?._id === user?.id
                    ? connection.helperId
                    : connection.requesterId;

                const status = getStatusStyle(
                  connection.status
                );

                return (
                  <Link
                    key={connection._id}
                    to={`/chat/${connection._id}`}
                    className="group relative block overflow-hidden rounded-2xl bg-white dark:bg-white/[0.035] border border-gray-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-orange-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 60}ms`,
                    }}
                  >

                    <div className="p-5 sm:p-6">

                      <div className="flex items-center gap-4">

                        {/* Avatar */}
                        <div className="relative shrink-0">

                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                            {getInitials(
                              otherPerson?.name
                            )}
                          </div>

                          {connection.status !== "completed" && (
                            <span className="absolute -right-1 -bottom-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-[#151515]" />
                          )}

                        </div>

                        {/* Main information */}
                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">

                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                              {connection.needId?.title ||
                                "Untitled Need"}
                            </h3>

                            <span className="hidden sm:block text-gray-300 dark:text-gray-700">
                              •
                            </span>

                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                              {otherPerson?.name ||
                                "Unknown user"}
                            </p>

                          </div>

                          <div className="flex items-center gap-2 mt-2">

                            {otherPerson?.city && (
                              <>
                                <span className="text-xs text-gray-400">
                                  📍
                                </span>

                                <span className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                  {otherPerson.city}
                                </span>
                              </>
                            )}

                          </div>

                        </div>

                        {/* Status + arrow */}
                        <div className="flex items-center gap-3 shrink-0">

                          <span
                            className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold ${status.wrapper} ${status.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                            />

                            {status.label}
                          </span>

                          <span className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 transition-all duration-300">

                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                            >
                              <path
                                d="M5 12H19M13 6L19 12L13 18"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>

                          </span>

                        </div>

                      </div>

                      {/* Mobile status */}
                      <div className="sm:hidden mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.06]">

                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold ${status.wrapper} ${status.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                          />

                          {status.label}
                        </span>

                      </div>

                    </div>

                    {/* Hover accent */}
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-500" />

                  </Link>
                );
              })}

            </div>

          </div>

        )}

      </div>
    </main>
  );
}