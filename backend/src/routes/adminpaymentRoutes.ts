import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentsByUser,
  getPaymentByBooking,
  updatePaymentStatus,
  deletePayment,
} from "../controllers/paymentController";

const router = express.Router();

router.post("/", createPayment);
router.get("/", getAllPayments);
router.get("/user/:user_id", getPaymentsByUser);
router.get("/booking/:booking_id", getPaymentByBooking);
router.put("/:id", updatePaymentStatus);
router.delete("/:id", deletePayment);

export default router;
