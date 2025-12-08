"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get("/", userController_1.getAllCustomers);
router.put("/:id/status", userController_1.updateCustomersStatus);
router.delete("/:id", userController_1.deleteCustomers);
exports.default = router;
