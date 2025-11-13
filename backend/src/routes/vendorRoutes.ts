import express from "express";
import {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, getAllVendors);
router.get("/:id", authenticate, getVendorById);
router.post("/", authenticate, createVendor);
router.put("/:id", authenticate, updateVendor);
router.delete("/:id", authenticate, deleteVendor);

export default router;
