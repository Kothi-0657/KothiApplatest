import { Router } from "express";
import {
  getAllVendors,
  getVendorById,
  addVendor,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController";

const router = Router();

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
router.get("/", getAllVendors);

// GET vendor by ID
router.get("/:id", getVendorById);

// CREATE vendor
router.post("/", addVendor);

// UPDATE vendor
router.put("/:id", updateVendor);

// DELETE vendor
router.delete("/:id", deleteVendor);

export default router;
