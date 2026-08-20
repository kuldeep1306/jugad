require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

const authRoutes = require("./routes/auth");
const needsRoutes = require("./routes/needs");
const responsesRoutes = require("./routes/responses");
const connectionsRoutes = require("./routes/connections");
const messagesRoutes = require("./routes/messages");
const reviewsRoutes = require("./routes/reviews");
const notificationsRoutes = require("./routes/notifications");

const app = express();
const server = http.createServer(app);

connectDB();

// hardcoded origins + env se extra origins (comma-separated FRONTEND_URLS) + koi bhi *.vercel.app
// preview/production URL — Vercel har deploy pe alag domain de sakta hai, isliye regex fallback bhi rakha hai
const staticOrigins = [
  "http://localhost:5173",
  "https://jugad-ochre.vercel.app",
  "https://jugaduu.vercel.app",
  ...((process.env.FRONTEND_URLS || "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean)),
];

const vercelPreviewRegex = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // server-to-server / curl / same-origin requests mein origin header nahi hota
  return staticOrigins.includes(origin) || vercelPreviewRegex.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// real-time notifications ke liye socket.io ussi server pe attach karo
initSocket(server, isAllowedOrigin);

app.get("/", (req, res) => {
  res.json({ message: "JugaadU API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/needs", needsRoutes);
app.use("/api/responses", responsesRoutes);
app.use("/api/connections", connectionsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/notifications", notificationsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
