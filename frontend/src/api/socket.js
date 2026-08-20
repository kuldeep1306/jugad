import { io } from "socket.io-client";

// VITE_API_URL kuch is tarah hai: https://jugad-lc0p.onrender.com/api
// socket.io usi server par lagta hai, bas /api suffix ke bina
const SOCKET_URL = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");

let socket = null;

export const getSocket = (token) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: token ? { token } : {},
    withCredentials: true,
    autoConnect: false,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
