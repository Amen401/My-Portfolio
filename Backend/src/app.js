require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
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

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL, ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [])]
      : [
          "http://localhost:3000",
          "http://localhost:5173",
          "https://paul-gelgelo-portifolio.vercel.app",
          "https://pawlos-gelgelo-portifolio.vercel.app",
        ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Root Route
app.get("/", (req, res) => {
  res.status(200).send("Portfolio backend is running");
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
  res.json({ status: "ok" });
});

// DB diagnostics
app.get("/api/db-status", async (req, res) => {
  const report = {
    hasMongoUri: !!process.env.MONGO_URI,
    mongoUriHost: process.env.MONGO_URI ? new URL(process.env.MONGO_URI).host : null,
    readyState: mongoose.connection.readyState,
    time: new Date().toISOString(),
  };
  try {
    if (mongoose.connection.readyState !== 1) {
      const t0 = Date.now();
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
      report.connectMs = Date.now() - t0;
    } else {
      report.alreadyConnected = true;
    }
    await mongoose.connection.db.admin().ping();
    report.ping = "ok";
    report.finalReadyState = mongoose.connection.readyState;
    res.json(report);
  } catch (e) {
    report.error = e.message;
    if (e.reason) {
      const s = e.reason.servers || {};
      report.servers = {};
      for (const k in s) report.servers[k] = { type: s[k].type, error: s[k].error && s[k].error.message };
    }
    res.status(500).json(report);
  }
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
