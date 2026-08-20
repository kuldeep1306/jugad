import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Chat() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);

  const loadData = async () => {
    try {
      const [connRes, msgRes] = await Promise.all([
        api.get(`/connections/${id}`),
        api.get(`/messages/${id}`),
      ]);

      setConnection(connRes.data);
      setMessages(msgRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      api
        .get(`/messages/${id}`)
        .then((res) => setMessages(res.data))
        .catch(() => {});
    }, 4000);

    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim() || sending) return;

    const messageText = text.trim();

    try {
      setSending(true);

      const res = await api.post("/messages", {
        connectionId: id,
        text: messageText,
      });

      setMessages((prev) => [
        ...prev,
        {
          ...res.data,
          senderId: {
            _id: user.id,
            name: user.name,
          },
        },
      ]);

      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const markComplete = async () => {
    try {
      await api.patch(`/connections/${id}/complete`);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

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

  if (!connection) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] dark:bg-[#0D0D0F] px-6 py-12">
        <div className="max-w-3xl mx-auto">

          <div className="h-20 rounded-2xl bg-white dark:bg-white/[0.035] border border-gray-200 dark:border-white/10 animate-pulse mb-3" />

          <div className="h-[55vh] rounded-2xl bg-white dark:bg-white/[0.035] border border-gray-200 dark:border-white/10 animate-pulse" />

        </div>
      </main>
    );
  }

  const otherPerson =
    connection.requesterId?._id === user.id
      ? connection.helperId
      : connection.requesterId;

  const isCompleted = connection.status === "completed";

  return (
    <main className="min-h-screen bg-[#FAFAF8] dark:bg-[#0D0D0F] text-gray-900 dark:text-white">

      {/* ================= HEADER ================= */}
      <section className="border-b border-gray-200 dark:border-white/[0.08]">

        <div className="max-w-4xl mx-auto px-5 sm:px-7 py-6">

          {/* Back */}
          <button
            onClick={() => navigate("/connections")}
            className="group inline-flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors mb-5"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            >
              <path
                d="M19 12H5M11 18L5 12L11 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Back to connections
          </button>

          {/* Conversation header */}
          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3.5 min-w-0">

              {/* Avatar */}
              <div className="relative shrink-0">

                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                  {getInitials(otherPerson?.name)}
                </div>

                {!isCompleted && (
                  <span className="absolute -right-1 -bottom-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#FAFAF8] dark:border-[#0D0D0F]" />
                )}

              </div>

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h1 className="font-display font-semibold text-base sm:text-lg truncate text-gray-950 dark:text-white">
                    {otherPerson?.name || "Unknown user"}
                  </h1>

                  {!isCompleted && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Online
                    </span>
                  )}

                </div>

                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                  {otherPerson?.city
                    ? `📍 ${otherPerson.city}`
                    : "Community member"}
                </p>

              </div>

            </div>

            {/* Status / Complete */}
            <div className="shrink-0">

              {connection.status === "active" ? (

                <button
                  onClick={markComplete}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black text-xs font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/15 transition-all duration-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      d="M5 12.5L9.5 17L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="hidden sm:inline">
                    Mark Complete
                  </span>

                  <span className="sm:hidden">
                    Complete
                  </span>
                </button>

              ) : (

                <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Completed
                </span>

              )}

            </div>

          </div>

          {/* Need reference */}
          <div className="mt-5 flex items-center gap-2 px-3.5 py-3 rounded-xl bg-orange-50 dark:bg-orange-500/[0.07] border border-orange-100 dark:border-orange-500/10">

            <span className="text-sm">📌</span>

            <div className="min-w-0">

              <p className="text-[10px] uppercase tracking-wider font-semibold text-orange-600 dark:text-orange-400">
                Discussing
              </p>

              <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 truncate mt-0.5">
                {connection.needId?.title || "Untitled Need"}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CHAT ================= */}
      <div className="max-w-4xl mx-auto px-5 sm:px-7 py-5">

        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">

          {/* Messages */}
          <div className="bg-[#F3F2EE] dark:bg-[#111113] h-[55vh] sm:h-[480px] overflow-y-auto px-4 sm:px-6 py-6">

            {messages.length === 0 ? (

              <div className="h-full flex items-center justify-center">

                <div className="text-center max-w-xs">

                  <div className="mx-auto w-14 h-14 rounded-2xl bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 flex items-center justify-center text-xl shadow-sm">
                    👋
                  </div>

                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mt-4">
                    Start the conversation
                  </h3>

                  <p className="text-xs leading-5 text-gray-500 dark:text-gray-500 mt-2">
                    Say hello and discuss the price, location,
                    timing or anything else about this deal.
                  </p>

                </div>

              </div>

            ) : (

              <div className="space-y-3">

                {messages.map((message, index) => {

                  const isMe =
                    message.senderId?._id === user.id;

                  const previousMessage =
                    messages[index - 1];

                  const sameSender =
                    previousMessage?.senderId?._id ===
                    message.senderId?._id;

                  return (
                    <div
                      key={message._id}
                      className={`flex ${
                        isMe
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`flex items-end gap-2 max-w-[88%] sm:max-w-[72%] ${
                          isMe
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >

                        {/* Small avatar only when sender changes */}
                        {!sameSender ? (

                          <div
                            className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold ${
                              isMe
                                ? "bg-gray-900 dark:bg-orange-500 text-white dark:text-black"
                                : "bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400"
                            }`}
                          >
                            {getInitials(
                              isMe
                                ? user?.name
                                : message.senderId?.name
                            )}
                          </div>

                        ) : (

                          <div className="w-7 shrink-0" />

                        )}

                        <div
                          className={`px-4 py-2.5 text-sm leading-6 shadow-sm ${
                            isMe
                              ? "bg-gray-950 dark:bg-orange-500 text-white dark:text-black rounded-2xl rounded-br-md"
                              : "bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/[0.08] rounded-2xl rounded-bl-md"
                          }`}
                        >
                          {message.text}
                        </div>

                      </div>

                    </div>
                  );
                })}

                <div ref={bottomRef} />

              </div>

            )}

          </div>

          {/* ================= MESSAGE INPUT ================= */}
          <div className="bg-white dark:bg-[#161618] border-t border-gray-200 dark:border-white/10 p-3 sm:p-4">

            {isCompleted && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/[0.035] text-xs text-gray-500 dark:text-gray-400">
                <span>✓</span>
                This connection has been completed.
              </div>
            )}

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2"
            >

              <div className="relative flex-1">

                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    isCompleted
                      ? "Send a follow-up message..."
                      : "Write a message..."
                  }
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0D0D0F] text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                />

              </div>

              <button
                type="submit"
                disabled={!text.trim() || sending}
                className="shrink-0 w-11 h-11 sm:w-auto sm:h-[46px] sm:px-5 rounded-xl bg-gray-950 dark:bg-orange-500 text-white dark:text-black flex items-center justify-center gap-2 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
              >

                <span className="hidden sm:inline">
                  {sending ? "Sending..." : "Send"}
                </span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4"
                >
                  <path
                    d="M21 3L10.5 13.5M21 3L14.3 21L10.5 13.5L3 9.7L21 3Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              </button>

            </form>

          </div>

        </div>

        {/* Bottom hint */}
        <p className="text-center text-[11px] text-gray-400 dark:text-gray-600 mt-4">
          Keep conversations respectful and settle details directly.
        </p>

      </div>

    </main>
  );
}