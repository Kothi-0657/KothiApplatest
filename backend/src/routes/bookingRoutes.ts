import express from "express";
import { getAllBookings, updateBookingStatus, assignVendor } from "../controllers/bookingController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/bookings", authenticate, getAllBookings);
router.patch("/bookings/:id/status", authenticate, updateBookingStatus);
router.patch("/bookings/:id/vendor", authenticate, assignVendor);

export default router;
