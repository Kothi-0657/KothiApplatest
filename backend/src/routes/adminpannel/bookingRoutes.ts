import { Router } from "express";
import pool from "../../config/db";
import {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  assignVendor,
  deleteBooking,
} from "../../controllers/adminpannel/bookingController";

const router = Router();

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
router.get("/", getAllBookings);

// GET booking by ID
router.get("/:id", getBookingById);

// UPDATE booking status
router.patch("/:id/status", updateBookingStatus);

// ASSIGN vendor to booking
router.patch("/:id/vendor", assignVendor);

// DELETE booking
router.delete("/:id", deleteBooking);

router.get("/user/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query(
      "SELECT b.*, s.name AS service_name FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.customer_id = $1 ORDER BY b.scheduled_at DESC",
      [customerId]
    );

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
