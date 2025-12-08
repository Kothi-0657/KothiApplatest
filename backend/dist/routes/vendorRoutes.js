"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendorController_1 = require("../controllers/vendorController");
const router = (0, express_1.Router)();
/**
 * BASE PATH (from server.ts):
 * app.use("/api/vendors", vendorRoutes);
 *
 * ✔ GET     /api/vendors
 * ✔ GET     /api/vendors/:id
 * ✔ POST    /api/vendors
 * ✔ PUT     /api/vendors/:id
 * ✔ DELETE  /api/vendors/:id
 */
// GET all vendors
router.get("/", vendorController_1.getAllVendors);
// GET vendor by ID
router.get("/:id", vendorController_1.getVendorById);
// CREATE vendor
router.post("/", vendorController_1.addVendor);
// UPDATE vendor
router.put("/:id", vendorController_1.updateVendor);
// DELETE vendor
router.delete("/:id", vendorController_1.deleteVendor);
exports.default = router;
