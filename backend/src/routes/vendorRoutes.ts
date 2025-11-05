import express from "express";
import {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController";
import { authenticateAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticateAdmin, getAllVendors);
router.get("/:id", authenticateAdmin, getVendorById);
router.post("/", authenticateAdmin, createVendor);
router.put("/:id", authenticateAdmin, updateVendor);
router.delete("/:id", authenticateAdmin, deleteVendor);

export default router;
