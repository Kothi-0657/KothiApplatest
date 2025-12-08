"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// src/server.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const customersRoutes_1 = __importDefault(require("./routes/customersRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const vendorRoutes_1 = __importDefault(require("./routes/vendorRoutes"));
const paymentsRoutes_1 = __importDefault(require("./routes/paymentsRoutes"));
const adminAuthRoutes_1 = __importDefault(require("./routes/adminAuthRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const publicServicesRoutes_1 = __importDefault(require("./routes/publicServicesRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const db_1 = __importDefault(require("./config/db"));
exports.pool = db_1.default;
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
// Public Routes
app.use("/api/public/services", publicServicesRoutes_1.default);
app.get("/health", (_req, res) => res.json({ ok: true }));
// Admin + Protected Routes
app.use("/api/admin/auth", adminAuthRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api/payments", paymentsRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/services", serviceRoutes_1.default);
app.use("/api/customers", customersRoutes_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
app.use("/api/vendors", vendorRoutes_1.default);
// Start Server
const port = Number(process.env.PORT || 4000);
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
