// src/routes/adminpannel/adminUserManagementRoutes.ts
import express from "express";
import adminAuth from "../../middleware/adminAuth";
import {
  getRMs,
  getFRMs,
  createRM,
  createFRM,
  toggleUserStatus,
  deleteUser,
} from "../../controllers/adminpannel/adminUserManagementController";

const router = express.Router();

// Protect all routes
router.use(adminAuth);

// RM routes
router.get("/rms", getRMs);
router.post("/rms", createRM);

// FRM routes
router.get("/frms", getFRMs);
router.post("/frms", createFRM);

// Shared routes
router.patch("/:id/toggle", toggleUserStatus);
router.delete("/:id", deleteUser);

export default router;
