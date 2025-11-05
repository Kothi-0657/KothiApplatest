import express from "express";
import {
  listServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController";
import { authenticateAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", listServices);
router.get("/:id", getService);

// Admin-only service management
router.post("/", authenticateAdmin, createService);
router.put("/:id", authenticateAdmin, updateService);
router.delete("/:id", authenticateAdmin, deleteService);

export default router;
