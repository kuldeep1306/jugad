import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function NeedDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [need, setNeed] = useState(null);
  const [responses, setResponses] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [alreadyResponded, setAlreadyResponded] = useState(false);

  const isOwner = need && user && need.userId?._id === user.id;

  const loadNeed = async () => {
    try {
      const res = await api.get(`/needs/${id}`);
      setNeed(res.data);
    } catch {
      setNeed(null);
    }
  };

  const loadResponses = async () => {
    try {
      const res = await api.get(`/responses/need/${id}`);
      setResponses(res.data);
    } catch {
      setResponses([]);
    }
  };

  useEffect(() => {
    loadNeed();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (isOwner) loadResponses();
    // eslint-disable-next-line
  }, [isOwner]);

  const handleRespond = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    setStatus("sending");

    try {
      await api.post(`/responses/${id}`, { message });
      setAlreadyResponded(true);
      setStatus("done");
    } catch (err) {
      setStatus(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  const handleDecision = async (responseId, decision) => {
    try {
      const res = await api.patch(`/responses/${responseId}`, {
        status: decision,
      });

      if (decision === "accepted" && res.data.connection) {
        navigate(`/chat/${res.data.connection._id}`);
      } else {
        loadResponses();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      `"${need.title}" ko delete karna hai? Ye wapas nahi hoga.`
    );

    if (!ok) return;

    try {
      await api.delete(`/needs/${id}`);
      navigate("/browse");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Delete nahi ho paya, dobara try karo."
      );
    }
  };

  if (!need) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-marigold/30 border-t-marigold animate-spin" />
          <p className="text-sm text-muted dark:text-darkmuted">
            Need load ho rahi hai...
          </p>
        </div>
      </div>
    );
  }

  const tagStyles = {
    Buy: "bg-[#FDE8CC] text-[#8A5A0D] dark:bg-[#8A5A0D]/20 dark:text-[#F7C877]",
    Borrow:
      "bg-[#DCEEE5] text-[#1F6B4C] dark:bg-[#1F6B4C]/20 dark:text-[#7CD6AD]",
    Free: "bg-[#F1EBDD] text-[#806A3D] dark:bg-[#806A3D]/20 dark:text-[#D8C58F]",
    Exchange:
      "bg-[#FBE5E5] text-[#9E4A4A] dark:bg-[#9E4A4A]/20 dark:text-[#F0A9A9]",
  };

  const statusStyles = {
    open: "bg-[#DCEEE5] text-[#1F6B4C] dark:bg-[#1F6B4C]/20 dark:text-[#7CD6AD]",
    pending:
      "bg-[#FDE8CC] text-[#8A5A0D] dark:bg-[#8A5A0D]/20 dark:text-[#F7C877]",
    completed:
  "bg-[#F1EBDD] text-[#806A3D] dark:bg-[#806A3D]/20 dark:text-[#D8C58F]",
    rejected:
      "bg-[#FBE5E5] text-[#9E4A4A] dark:bg-[#9E4A4A]/20 dark:text-[#F0A9A9]",
  };

  return (
    <main className="max-w-4xl mx-auto px-5 sm:px-7 py-10 sm:py-14">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="group inline-flex items-center gap-2 text-sm text-muted dark:text-darkmuted hover:text-marigold transition-colors mb-7"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
        >
          <path
            d="M19 12H5M5 12L11 6M5 12L11 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Browse
      </button>

      {/* MAIN CARD */}
      <section className="bg-white dark:bg-darkcard border border-line dark:border-darkborder rounded-3xl overflow-hidden shadow-sm">

        {/* TOP ACCENT */}
        <div className="h-1 bg-gradient-to-r from-marigold via-[#F3B95F] to-transparent" />

        <div className="p-6 sm:p-8">

          {/* BADGES */}
          <div className="flex flex-wrap items-center gap-2 mb-5">

            <span
              className={`font-mono text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-full font-semibold ${
                tagStyles[need.type] ||
                "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-darkmuted"
              }`}
            >
              {need.type} · {need.category}
            </span>

            {isOwner && (
              <span className="font-mono text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-full font-semibold bg-marigold/15 text-[#8A5A0D] dark:text-marigold">
                Your Need
              </span>
            )}

            <span
              className={`font-mono text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-full font-semibold ${
                statusStyles[need.status] ||
                "bg-gray-100 text-gray-600 dark:bg-white/10"
              }`}
            >
              {need.status}
            </span>
          </div>

          {/* TITLE */}
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-paper leading-tight">
            {need.title}
          </h1>

          {/* DESCRIPTION */}
          {need.description && (
            <p className="mt-4 text-[15px] leading-7 text-charcoal dark:text-darkmuted max-w-2xl">
              {need.description}
            </p>
          )}

          {/* INFO GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">

            <InfoItem
              icon="👤"
              label="Posted by"
              value={need.userId?.name || "Unknown"}
            />

            <InfoItem
              icon="📍"
              label="Location"
              value={need.location || "Not specified"}
            />

            <InfoItem
              icon="🏙️"
              label="City"
              value={need.userId?.city || "Not specified"}
            />

            <InfoItem
              icon="💰"
              label="Budget"
              value={need.budget ? `₹${need.budget}` : "Flexible"}
            />

          </div>

          {/* OWNER ACTION */}
          {isOwner && (
            <div className="mt-7 pt-6 border-t border-line dark:border-darkborder flex flex-wrap items-center justify-between gap-3">

              <div>
                <p className="text-sm font-semibold text-ink dark:text-paper">
                  This is your listing
                </p>
                <p className="text-xs text-muted dark:text-darkmuted mt-1">
                  Manage responses or remove this need.
                </p>
              </div>

              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8BABA] dark:border-[#9E4A4A]/40 text-[#9E4A4A] dark:text-[#F0A9A9] text-sm font-semibold hover:bg-[#FBE5E5] dark:hover:bg-[#9E4A4A]/10 transition-all"
              >
                <span>🗑</span>
                Delete Need
              </button>
            </div>
          )}
        </div>
      </section>

      {/* RESPOND SECTION */}
      {!isOwner && need.status === "open" && (
        <section className="mt-6 bg-white dark:bg-darkcard border border-line dark:border-darkborder rounded-3xl p-6 sm:p-7">

          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-marigold/15 flex items-center justify-center text-xl">
              🙋
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-ink dark:text-paper">
                Can you help with this?
              </h2>

              <p className="text-sm text-muted dark:text-darkmuted mt-1">
                Send the owner a message and let them know you can help.
              </p>
            </div>
          </div>

          {alreadyResponded ? (
            <div className="rounded-2xl bg-[#DCEEE5] dark:bg-[#1F6B4C]/15 border border-[#B9DDCC] dark:border-[#1F6B4C]/30 p-4">
              <div className="flex gap-3">
                <span className="text-lg">✓</span>

                <div>
                  <p className="text-sm font-semibold text-[#1F6B4C] dark:text-[#7CD6AD]">
                    Response sent successfully
                  </p>

                  <p className="text-xs text-[#477A63] dark:text-[#7CD6AD]/80 mt-1">
                    Owner accept karega to direct chat open ho jayega.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRespond} className="space-y-4">

              <div>
                <label className="text-xs font-semibold text-charcoal dark:text-darkmuted block mb-2">
                  Your message
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! Mere paas ye available hai..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-line dark:border-darkborder bg-[#FFFCF7] dark:bg-ink text-ink dark:text-paper text-sm resize-none placeholder:text-muted/60 dark:placeholder:text-darkmuted/60 focus:outline-none focus:ring-2 focus:ring-marigold/40 focus:border-marigold transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                <p className="text-xs text-muted dark:text-darkmuted">
                  Message optional hai.
                </p>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-ink dark:bg-marigold text-paper dark:text-ink font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-marigold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-paper/30 border-t-paper dark:border-ink/30 dark:border-t-ink animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Response
                      <span>→</span>
                    </>
                  )}
                </button>

              </div>

              {status &&
                status !== "sending" &&
                status !== "done" && (
                  <p className="text-sm text-[#9E4A4A] dark:text-[#F0A9A9]">
                    {status}
                  </p>
                )}
            </form>
          )}
        </section>
      )}

      {/* RESPONSES */}
      {isOwner && (
        <section className="mt-8">

          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink dark:text-paper">
                Responses
              </h2>

              <p className="text-sm text-muted dark:text-darkmuted mt-1">
                Logon ne is need ke liye respond kiya hai.
              </p>
            </div>

            <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full bg-marigold/15 text-[#8A5A0D] dark:text-marigold">
              {responses.length}
            </span>
          </div>

          {responses.length === 0 ? (
            <div className="bg-white dark:bg-darkcard border border-dashed border-line dark:border-darkborder rounded-2xl p-10 text-center">

              <div className="w-12 h-12 mx-auto rounded-full bg-marigold/10 flex items-center justify-center text-xl mb-4">
                💬
              </div>

              <p className="text-sm font-medium text-ink dark:text-paper">
                No responses yet
              </p>

              <p className="text-xs text-muted dark:text-darkmuted mt-1">
                Jab koi help karna chahega, uska response yahan dikhega.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {responses.map((r) => (
                <div
                  key={r._id}
                  className="group bg-white dark:bg-darkcard border border-line dark:border-darkborder rounded-2xl p-5 hover:border-marigold/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div className="flex items-start gap-3">

                      <div className="w-10 h-10 shrink-0 rounded-full bg-marigold/15 flex items-center justify-center font-semibold text-[#8A5A0D] dark:text-marigold">
                        {r.helperId?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>

                      <div>
                        <p className="font-semibold text-sm text-ink dark:text-paper">
                          {r.helperId?.name}
                        </p>

                        <p className="text-xs text-muted dark:text-darkmuted mt-0.5">
                          {r.helperId?.city}
                        </p>

                        {r.message && (
                          <p className="text-sm text-charcoal dark:text-darkmuted mt-3 leading-relaxed">
                            “{r.message}”
                          </p>
                        )}

                        <span className="inline-block text-[11px] font-mono capitalize mt-2 text-muted dark:text-darkmuted">
                          Status: {r.status}
                        </span>
                      </div>
                    </div>

                    {r.status === "pending" && (
                      <div className="flex gap-2 sm:self-center">

                        <button
                          onClick={() =>
                            handleDecision(r._id, "accepted")
                          }
                          className="px-4 py-2.5 rounded-xl bg-[#DCEEE5] dark:bg-[#1F6B4C]/20 text-[#1F6B4C] dark:text-[#7CD6AD] text-xs font-semibold hover:bg-[#CBE5D8] dark:hover:bg-[#1F6B4C]/30 transition-colors"
                        >
                          ✓ Accept
                        </button>

                        <button
                          onClick={() =>
                            handleDecision(r._id, "rejected")
                          }
                          className="px-4 py-2.5 rounded-xl border border-line dark:border-darkborder text-charcoal dark:text-darkmuted text-xs font-semibold hover:border-[#D99A9A] hover:text-[#9E4A4A] transition-colors"
                        >
                          Reject
                        </button>

                      </div>
                    )}

                  </div>
                </div>
              ))}

            </div>
          )}
        </section>
      )}

    </main>
  );
}


/* -------------------------------- */
/* INFO ITEM */
/* -------------------------------- */

function InfoItem({ icon, label, value }) {
  return (
    <div className="bg-[#FFFCF7] dark:bg-ink border border-line dark:border-darkborder rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{icon}</span>

        <span className="text-[11px] uppercase tracking-wide font-mono text-muted dark:text-darkmuted">
          {label}
        </span>
      </div>

      <p className="text-sm font-semibold text-ink dark:text-paper truncate">
        {value}
      </p>
    </div>
  );
}