"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const bookingController_1 = require("../controllers/bookingController");
const router = (0, express_1.Router)();
/**
 * BASE PATH FOR THIS FILE (IN SERVER):
 * app.use("/api/admin/bookings", bookingRoutes)
 *
 * Resulting full paths:
 * GET    /api/admin/bookings
 * GET    /api/admin/bookings/:id
 * PATCH  /api/admin/bookings/:id/status
 * PATCH  /api/admin/bookings/:id/vendor
 * DELETE /api/admin/bookings/:id
 */
// GET all bookings
router.get("/", bookingController_1.getAllBookings);
// GET booking by ID
router.get("/:id", bookingController_1.getBookingById);
// UPDATE booking status
router.patch("/:id/status", bookingController_1.updateBookingStatus);
// ASSIGN vendor to booking
router.patch("/:id/vendor", bookingController_1.assignVendor);
// DELETE booking
router.delete("/:id", bookingController_1.deleteBooking);
router.get("/user/:customerId", async (req, res) => {
    const { customerId } = req.params;
    try {
        const result = await db_1.default.query("SELECT b.*, s.name AS service_name FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.customer_id = $1 ORDER BY b.scheduled_at DESC", [customerId]);
        res.json({ success: true, bookings: result.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.default = router;
