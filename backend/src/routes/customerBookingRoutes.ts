import { Router } from "express";
import { 
  getBookingsByCustomer,
  getSingleBooking,
  getPaymentStatus
} from "../controllers/customerBookingController";

const router = Router();

// Fetch all customer bookings
router.get("/customer/:customerId", getBookingsByCustomer);

// Fetch a specific booking
router.get("/booking/:bookingId", getSingleBooking);

// Fetch payment status
router.get("/payment-status/:bookingId", getPaymentStatus);

export default router;
