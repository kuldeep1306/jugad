import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext.jsx";

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "abhi";
  if (mins < 60) return `${mins}m pehle`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h pehle`;
  const days = Math.floor(hrs / 24);
  return `${days}d pehle`;
};

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (notification) => {
    markAsRead(notification._id);
    setOpen(false);
    const needId = notification.needId?._id || notification.needId;
    if (needId) navigate(`/needs/${needId}`);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:border-orange-300 dark:hover:border-orange-500/40 transition-all duration-300"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
          <path
            d="M18 8.5C18 6.5 16.5 3 12 3C7.5 3 6 6.5 6 8.5C6 14.5 4 15.5 4 16.5C4 17.5 5 18 12 18C19 18 20 17.5 20 16.5C20 15.5 18 14.5 18 8.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 21C10.1 21.6 10.9 22 12 22C13.1 22 13.9 21.6 14.5 21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151517] shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-orange-500 hover:text-orange-600"
              >
                Sab read mark karo
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Koi notification nahi hai abhi tak
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors ${
                    !n.read ? "bg-orange-50/60 dark:bg-orange-500/[0.06]" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
