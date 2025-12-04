"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
router.post("/", paymentController_1.createPayment);
router.post("/", paymentController_1.createPayment);
router.get("/", paymentController_1.getAllPayments);
router.get("/customers/:customers_id", paymentController_1.getPaymentById);
router.put("/:id", paymentController_1.updatePayment);
router.delete("/:id", paymentController_1.deletePayment);
exports.default = router;
