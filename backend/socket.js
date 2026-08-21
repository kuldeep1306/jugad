const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io = null;

// har logged-in user ke saare open sockets (multiple tabs/devices ho sakte hain)
const userSockets = new Map(); // userId (string) -> Set<socketId>

const addUserSocket = (userId, socketId) => {
  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId).add(socketId);
};

const removeUserSocket = (userId, socketId) => {
  const set = userSockets.get(userId);
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) userSockets.delete(userId);
};

const initSocket = (server, corsOrigins) => {
  io = new Server(server, {
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  // handshake ke token se user verify karo taaki har socket ka owner pata ho
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token;

      if (!token) {
        // guest bhi connect ho sakta hai, bas kisi user room mein join nahi hoga
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      // invalid token ho to bhi connection allow karo, bas anonymous rahega
      next();
    }
  });

  io.on("connection", (socket) => {
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      socket.join("logged_in"); // sab logged-in users ka common room
      addUserSocket(socket.userId, socket.id);
    }

    socket.on("disconnect", () => {
      if (socket.userId) removeUserSocket(socket.userId, socket.id);
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
