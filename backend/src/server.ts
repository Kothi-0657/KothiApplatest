// src/server.ts
import "dotenv/config"; // 🔥 LOAD ENV FIRST

import express from "express";
import cors from "cors";

import adminRoutes from "./routes/adminpannel/adminRoutes";

import serviceRoutes from "./routes/adminpannel/serviceRoutes";
import customersRoutes from "./routes/adminpannel/customersRoutes";
import bookingRoutes from "./routes/adminpannel/bookingRoutes";
import vendorRoutes from "./routes/adminpannel/vendorRoutes";
import paymentRoutes from "./routes/adminpannel/paymentsRoutes";
import adminAuthRoutes from "./routes/adminAuthRoutes";
import dashboardRoutes from "./routes/adminpannel/dashboardRoutes";
import publicServicesRoutes from "./routes/mobilepannel/publicServicesRoutes";
import customerBookingRoutes from "./routes/mobilepannel/customerBookingRoutes";
import paintingRoutes from "./routes/adminpannel/paintingRoutes";
import authRoutes from "./routes/authRoutes";
import paintingRatesRoutes from "./routes/adminpannel/paintingRatesRoutes";
import calpaintingRotutes from "./routes/mobilepannel/calpaintingRoutes";
import rmRoutes from "./routes/rmpannel/rmRoutes";
import adminusermanagementRoutes from "./routes/adminpannel/adminUserManagementRoutes";

import pool from "./config/db";
import adminUserManagementRoutes from "./routes/adminpannel/adminUserManagementRoutes";
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
app.use("/api/admin", adminRoutes);
app.use("/api/public/services", publicServicesRoutes);
app.use("/health", (_req, res) => res.json({ ok: true }));

// Admin routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/painting", paintingRoutes);
app.use("/api/painting-rates", paintingRatesRoutes);
app.use("/api/calculate-painting", calpaintingRotutes);
app.use("/api/customers/bookings", customerBookingRoutes);
app.use("/api/admin/user-management", adminUserManagementRoutes);
// RM Panel routes

app.use("/api/rm", rmRoutes);

// Start server
const port = Number(process.env.PORT || 4000);
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
