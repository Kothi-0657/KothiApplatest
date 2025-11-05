import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ✅ CORS configuration for both Admin Panel and Mobile App (Expo)
app.use(
  cors({
    origin: [
      // --- Admin Panel URLs ---
      "http://localhost:3000",
      "http://192.168.29.182:3000",

      // --- React Web App (Vite or Next.js) ---
      "http://localhost:5173",
      "http://192.168.29.182:5173",

      // --- Mobile App (Expo Local + LAN) ---
      "http://localhost:8081",
      "http://192.168.29.182:8081",
      "exp://192.168.29.182:8081", // sometimes Expo uses this scheme

      // --- Optional: Allow all for testing ---
      // "*"  // uncomment if you want open access temporarily
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ JSON parser
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Health check
app.get("/", (_req, res) => {
  res.send("🚀 Kothi Backend is running successfully!");
});

// ✅ Start server
(async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL database");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on ${BASE_URL}`);
      console.log(`🌐 Accessible via: http://192.168.29.182:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
})();
