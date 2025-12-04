"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
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
router.post("/", paymentController_1.createPayment);
// GET all payments
router.get("/", paymentController_1.getAllPayments);
// GET payment by ID
router.get("/:id", paymentController_1.getPaymentById);
// UPDATE payment
router.put("/:id", paymentController_1.updatePayment);
// DELETE payment
router.delete("/:id", paymentController_1.deletePayment);
exports.default = router;
