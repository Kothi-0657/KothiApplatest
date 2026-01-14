import { Router } from "express";
import { getAllCustomers, getBookingsByCustomer } from "../../controllers/mobilepannel/customerBookingController";
import { authenticate } from "../../middleware/auth";

const router = Router();

// ✔ Protected customer bookings route
router.get(
  "/api/customer/booking/:customerId",
  authenticate,
  getBookingsByCustomer
);

router.get(
  "/api/customers",
  authenticate,
  getAllCustomers
);

export default router;
