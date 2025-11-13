import express from "express";
import {
  getAllPayments,
  updatePaymentStatus,
  downloadPaymentReport,
} from "../controllers/paymentController";
import { verifyAdminToken } from "../middleware/auth";

const router = express.Router();

router.get("/payments", verifyAdminToken, getAllPayments);
router.patch("/payments/:id/status", verifyAdminToken, updatePaymentStatus);
router.get("/payments/report", verifyAdminToken, downloadPaymentReport);

export default router;
