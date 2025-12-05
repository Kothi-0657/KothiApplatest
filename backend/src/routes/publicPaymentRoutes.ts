import express from "express";
import { authenticate } from "../middleware/auth";
import { getMyPayments, getMyPaymentById } from "../controllers/publicPaymentController";

const router = express.Router();

// mobile user payments route
router.get("/my", authenticate, getMyPayments);
router.get("/my/:id", authenticate, getMyPaymentById);

export default router;
