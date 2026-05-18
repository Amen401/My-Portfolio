require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

// Route Imports
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const techRoutes = require("./routes/techRoutes");
const messageRoutes = require("./routes/messageRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

// Connect Database
connectDB();

// ✅ LOCALHOST ONLY CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Root Route
app.get("/", (req, res) => {
  res.status(200).send("Portfolio backend is running (localhost mode)");
});

// API Routes
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tech-logos", techRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/stats", statsRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: "localhost" });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running locally on port ${PORT}`);
});

module.exports = app;
