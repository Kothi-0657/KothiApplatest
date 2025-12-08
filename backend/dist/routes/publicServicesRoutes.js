"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/publicServicesRoutes.ts
const express_1 = __importDefault(require("express"));
const publicServiceController_1 = require("../controllers/publicServiceController");
const router = express_1.default.Router();
// Public (no auth)
router.get("/", publicServiceController_1.listServices);
router.get("/:id", publicServiceController_1.getService);
exports.default = router;
