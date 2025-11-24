import { Router } from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController";

const router = Router();

/**
 * BASE PATH (registered in server.ts):
 * app.use("/api/admin/payments", paymentRoutes);
 *
 * ✔ POST    /api/admin/payments
 * ✔ GET     /api/admin/payments
 * ✔ GET     /api/admin/payments/:id
 * ✔ PUT     /api/admin/payments/:id
 * ✔ DELETE  /api/admin/payments/:id
 */

// CREATE payment manually (admin)
router.post("/", createPayment);

// GET all payments
router.get("/", getAllPayments);

// GET payment by ID
router.get("/:id", getPaymentById);

// UPDATE payment
router.put("/:id", updatePayment);

// DELETE payment
router.delete("/:id", deletePayment);

export default router;
