// src/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import customersRoutes from "./routes/customersRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import paymentRoutes from "./routes/adminpaymentRoutes";
import adminAuthRoutes from "./routes/adminAuthRoutes";


dotenv.config();

const app = express();
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`✅ Backend running at http://localhost:${port}`));
