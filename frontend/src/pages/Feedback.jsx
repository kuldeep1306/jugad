import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

function Stars({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star`}
          className="p-0.5"
        >
          <svg
            viewBox="0 0 24 24"
            fill={n <= value ? "#f97316" : "none"}
            stroke={n <= value ? "#f97316" : "#9ca3af"}
            strokeWidth="1.6"
            className="w-6 h-6 transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

function StaticStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 24 24"
          fill={n <= rating ? "#f97316" : "none"}
          stroke={n <= rating ? "#f97316" : "#9ca3af"}
          strokeWidth="1.6"
          className="w-3.5 h-3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Feedback() {
  const { user } = useAuth();

  const [view, setView] = useState("all"); // "all" | "mine"
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedback = async (which) => {
    setLoading(true);
    try {
      const endpoint = which === "mine" ? "/feedback/mine" : "/feedback";
      const res = await api.get(endpoint);
      setFeedback(res.data);
    } catch (err) {
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(view);
    // eslint-disable-next-line
  }, [view]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!rating) {
      setError("Pick a star rating first");
      return;
    }
    if (!message.trim()) {
      setError("Write a message before submitting");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/feedback", { rating, message: message.trim() });
      setRating(0);
      setMessage("");
      await fetchFeedback(view);
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't submit feedback, try again"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this feedback? This can't be undone.");
    if (!ok) return;

    try {
      await api.delete(`/feedback/${id}`);
      setFeedback((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed, try again");
    }
  };

  const avgRating =
    feedback.length > 0
      ? (
          feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
        ).toFixed(1)
      : null;

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-[#0D0D0F] text-[#171717] dark:text-white">
      {/* ================= PAGE HEADER ================= */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-white/[0.08]">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-orange-200/30 dark:bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
              Community voice
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-gray-950 dark:text-white">
            Feedback
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl leading-7">
            Tell us what's working and what's not. Every piece of feedback is
            visible to the whole community.
          </p>

          {avgRating && (
            <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10">
              <StaticStars rating={Math.round(avgRating)} />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {avgRating}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                average from {feedback.length}{" "}
                {feedback.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
        {/* ================= FORM ================= */}
        {user ? (
          <section className="bg-white dark:bg-white/[0.035] border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm mb-12">
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-1">
              Share your feedback
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-5">
              Posting as {user.name || user.email}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-2">
                  Rating
                </label>
                <Stars value={rating} onChange={setRating} />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="What do you like, what should we improve..."
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111113] text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/10 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300"
              >
                {submitting ? "Submitting..." : "Submit feedback"}
              </button>
            </form>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-white/[0.025] p-6 text-center mb-12">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <Link to="/login" className="text-orange-500 font-semibold">
                Log in
              </Link>{" "}
              to share your own feedback.
            </p>
          </section>
        )}

        {/* ================= VIEW TOGGLE ================= */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
            {view === "mine" ? "Your feedback" : "All feedback"}
          </h2>

          {user && (
            <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-white/[0.06]">
              <button
                onClick={() => setView("all")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  view === "all"
                    ? "bg-white dark:bg-white/10 text-gray-950 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Everyone
              </button>
              <button
                onClick={() => setView("mine")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  view === "mine"
                    ? "bg-white dark:bg-white/10 text-gray-950 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Just mine
              </button>
            </div>
          )}
        </div>

        {/* ================= LIST ================= */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[140px] rounded-2xl bg-white dark:bg-white/[0.035] border border-gray-200 dark:border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : feedback.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-white/[0.025] py-16 px-6 text-center">
            <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
              {view === "mine" ? "You haven't posted feedback yet" : "No feedback yet"}
            </h3>
            <p className="max-w-md mx-auto mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {view === "mine"
                ? "Share what you think using the form above."
                : "Be the first to tell the community what you think."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {feedback.map((f, index) => (
              <div
                key={f._id}
                className="animate-fadeUp rounded-2xl bg-white dark:bg-white/[0.035] border border-gray-200 dark:border-white/10 p-5"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {f.userId?.name || "Deleted user"}
                    </p>
                    <div className="mt-1.5">
                      <StaticStars rating={f.rating} />
                    </div>
                  </div>

                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {timeAgo(f.createdAt)}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {f.message}
                </p>

                {user && f.userId?._id === user.id && (
                  <button
                    onClick={() => handleDelete(f._id)}
                    className="mt-3 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
