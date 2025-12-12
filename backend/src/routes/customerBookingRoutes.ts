import { Router } from "express";
import { 
  getBookingsByCustomer,
  getSingleBooking,
  getPaymentStatus
} from "../controllers/customerBookingController";

const router = Router();

// Fetch all bookings for a customer
router.get("/customer/:customerId", getBookingsByCustomer);

// Fetch a specific booking
router.get("/booking/:bookingId", getSingleBooking);

// Fetch payment status for a booking
router.get("/payment-status/:bookingId", getPaymentStatus);

export default router;
