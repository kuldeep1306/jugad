import { useEffect, useState } from "react";
import api from "../api/axios.js";
import NeedCard from "../components/NeedCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const categories = [
  "",
  "Books",
  "Furniture",
  "Electronics",
  "Stationery",
  "Other",
];

const types = ["", "Buy", "Borrow", "Exchange", "Free"];

export default function Browse() {
  const { user } = useAuth();

  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "",
    type: "",
    location: "",
    search: "",
  });

  const fetchNeeds = async () => {
    setLoading(true);

    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value)
      );

      const res = await api.get("/needs", { params });
      setNeeds(res.data);
    } catch (err) {
      setNeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
    // eslint-disable-next-line
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchNeeds();
  };

  const handleDelete = async (need) => {
    const ok = window.confirm(
      `"${need.title}" ko delete karna hai? Ye wapas nahi hoga.`
    );

    if (!ok) return;

    try {
      await api.delete(`/needs/${need._id}`);

      setNeeds((prev) =>
        prev.filter((n) => n._id !== need._id)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Delete nahi ho paya, dobara try karo"
      );
    }
  };

  const tilts = [-1.4, 1.1, -0.8, 1.6, -1.1, 0.9];

  const myNeeds = user
    ? needs.filter((n) => n.userId?._id === user.id)
    : [];

  const otherNeeds = user
    ? needs.filter((n) => n.userId?._id !== user.id)
    : needs;

  const activeFilters = Object.values(filters).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-[#0D0D0F] text-[#171717] dark:text-white">

      {/* ================= PAGE HEADER ================= */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-white/[0.08]">

        {/* Background glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-orange-200/30 dark:bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-10">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-500" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                  Community marketplace
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-gray-950 dark:text-white">
                Browse Needs
              </h1>

              <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl leading-7">
                Find what someone around you is looking for,
                or discover an opportunity to help someone out.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">

              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

              <span>
                {needs.length} {needs.length === 1 ? "need" : "needs"} found
              </span>

            </div>

          </div>

        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 sm:py-12">

        {/* ================= FILTER PANEL ================= */}
        <section className="relative bg-white dark:bg-white/[0.035] border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

            <div>
              <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                Find something
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Narrow down the community needs using filters.
              </p>
            </div>

            {activeFilters > 0 && (
              <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">
                {activeFilters} active{" "}
                {activeFilters === 1 ? "filter" : "filters"}
              </span>
            )}

          </div>

          <form
            onSubmit={handleFilterSubmit}
            className="grid sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr_auto] gap-3"
          >

            {/* Search */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-2">
                Search
              </label>

              <div className="relative">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M16 16L21 21"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      search: e.target.value,
                    })
                  }
                  placeholder="Java book, cycle..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111113] text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                />

              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-2">
                Category
              </label>

              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category: e.target.value,
                  })
                }
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111113] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category || "All categories"}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-2">
                Type
              </label>

              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    type: e.target.value,
                  })
                }
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111113] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type || "All types"}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-2">
                Location
              </label>

              <input
                value={filters.location}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    location: e.target.value,
                  })
                }
                placeholder="Block C..."
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111113] text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
              />
            </div>

            {/* Button */}
            <div className="flex items-end">

              <button
                type="submit"
                disabled={loading}
                className="w-full lg:w-auto h-[46px] px-6 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/10 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300"
              >
                {loading ? "Searching..." : "Search"}
              </button>

            </div>

          </form>
        </section>

        {/* ================= RESULTS ================= */}
        <section className="mt-12">

          {loading ? (

            /* Loading skeleton */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-[250px] rounded-2xl bg-white dark:bg-white/[0.035] border border-gray-200 dark:border-white/10 animate-pulse"
                />
              ))}

            </div>

          ) : needs.length === 0 ? (

            /* Empty state */
            <div className="rounded-3xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-white/[0.025] py-20 px-6 text-center">

              <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-2xl mb-5">
                🔎
              </div>

              <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
                No needs found
              </h2>

              <p className="max-w-md mx-auto mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                We couldn't find anything matching these filters.
                Try changing your search or category.
              </p>

            </div>

          ) : user ? (

            <div className="space-y-14">

              {/* ================= MY NEEDS ================= */}
              {myNeeds.length > 0 && (
                <section>

                  <div className="flex items-end justify-between gap-4 mb-6">

                    <div>
                      <div className="flex items-center gap-2.5">

                        <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
                          Your Needs
                        </h2>

                        <span className="min-w-6 h-6 px-1.5 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold flex items-center justify-center">
                          {myNeeds.length}
                        </span>

                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                        Requests you've posted to the community.
                      </p>
                    </div>

                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {myNeeds.map((need, index) => (
                      <div
                        key={need._id}
                        className="animate-fadeUp"
                        style={{
                          animationDelay: `${index * 60}ms`,
                        }}
                      >
                        <NeedCard
                          need={need}
                          tilt={tilts[index % tilts.length]}
                          isMine
                          onDelete={handleDelete}
                        />
                      </div>
                    ))}

                  </div>

                </section>
              )}

              {/* ================= OTHER NEEDS ================= */}
              <section>

                <div className="flex items-end justify-between gap-4 mb-6">

                  <div>
                    <div className="flex items-center gap-2.5">

                      <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
                        Community Needs
                      </h2>

                      <span className="min-w-6 h-6 px-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs font-semibold flex items-center justify-center">
                        {otherNeeds.length}
                      </span>

                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                      Things people around you are looking for.
                    </p>
                  </div>

                </div>

                {otherNeeds.length === 0 ? (

                  <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/10 py-12 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No community needs match your filters.
                    </p>
                  </div>

                ) : (

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {otherNeeds.map((need, index) => (
                      <div
                        key={need._id}
                        className="animate-fadeUp"
                        style={{
                          animationDelay: `${index * 60}ms`,
                        }}
                      >
                        <NeedCard
                          need={need}
                          tilt={tilts[index % tilts.length]}
                        />
                      </div>
                    ))}

                  </div>

                )}

              </section>

            </div>

          ) : (

            /* ================= GUEST ================= */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {needs.map((need, index) => (
                <div
                  key={need._id}
                  className="animate-fadeUp"
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                >
                  <NeedCard
                    need={need}
                    tilt={tilts[index % tilts.length]}
                  />
                </div>
              ))}

            </div>

          )}

        </section>

      </div>
    </main>
  );
}