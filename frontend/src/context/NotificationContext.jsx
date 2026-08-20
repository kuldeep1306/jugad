import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios.js";
import { getSocket, disconnectSocket } from "../api/socket.js";
import { useAuth } from "./AuthContext.jsx";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(() => {
    api
      .get("/notifications")
      .then((res) => setNotifications(res.data))
      .catch(() => {});
  }, []);

  const fetchUnreadCount = useCallback(() => {
    api
      .get("/notifications/unread-count")
      .then((res) => setUnreadCount(res.data.count))
      .catch(() => {});
  }, []);

  // login/logout hote hi socket connect/disconnect aur pehli baar notifications load karo
  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
    fetchUnreadCount();

    const token = localStorage.getItem("jugaadu_token");
    const socket = getSocket(token);
    socket.connect();

    // jab bhi koi naya need post kare, sabhi logged-in users ko live update milega
    const handleNewNeed = (payload) => {
      setNotifications((prev) => [
        {
          _id: `live-${payload.needId}-${Date.now()}`,
          needId: { _id: payload.needId, title: payload.title },
          message: payload.message,
          read: false,
          createdAt: payload.createdAt || new Date().toISOString(),
        },
        ...prev,
      ]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new_need", handleNewNeed);

    return () => {
      socket.off("new_need", handleNewNeed);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // live (socket-only) notifications ki id backend mein nahi hai, unke liye API call skip karo
    if (!notificationId.startsWith("live-")) {
      api.patch(`/notifications/${notificationId}/read`).catch(() => {});
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    api.patch("/notifications/read-all").catch(() => {});
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
