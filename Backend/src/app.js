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

// Database
connectDB();

app.use(
  cors({
    origin: "http://localhost:3000", // Ensure this matches exactly your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tech-logos", techRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/stats", statsRoutes);

// Health Check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Global Error Handler (Must be used after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
