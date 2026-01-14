import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../../controllers/adminpannel/paymentController";

const router = express.Router();

router.post("/", createPayment);
router.post("/", createPayment);
router.get("/", getAllPayments);
router.get("/customers/:customers_id", getPaymentById);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;
