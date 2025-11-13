// src/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import userRoutes from "./routes/userRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import vendorRoutes from "./routes/vendorRoutes";

dotenv.config();

const app = express();
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`✅ Backend running at http://localhost:${port}`));
