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
const feedbackRoutes = require("./routes/feedback");

const app = express();
const server = http.createServer(app);

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://jugad-ochre.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// real-time notifications ke liye socket.io ussi server pe attach karo
initSocket(server, allowedOrigins);

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
app.use("/api/feedback", feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
