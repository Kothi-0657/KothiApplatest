// src/server.ts
import "dotenv/config"; // 🔥 LOAD ENV FIRST

import express from "express";
import cors from "cors";

import adminRoutes from "./routes/adminRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import customersRoutes from "./routes/customersRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import paymentRoutes from "./routes/paymentsRoutes";
import adminAuthRoutes from "./routes/adminAuthRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import publicServicesRoutes from "./routes/publicServicesRoutes";
import customerBookingRoutes from "./routes/customerBookingRoutes";
import paintingRoutes from "./routes/paintingRoutes";
import authRoutes from "./routes/authRoutes";
import paintingRatesRoutes from "./routes/paintingRatesRoutes";
import calpaintingRotutes from "./routes/calpaintingRoutes";

import pool from "./config/db";
export { pool };

const app = express();

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/public/services", publicServicesRoutes);
app.use("/health", (_req, res) => res.json({ ok: true }));

// Admin routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/customer/booking", customerBookingRoutes);
app.use("/api/painting", paintingRoutes);
app.use("/api/painting-rates", paintingRatesRoutes);
app.use("/api/calculate-painting", calpaintingRotutes);
// Start server
const port = Number(process.env.PORT || 4000);
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
