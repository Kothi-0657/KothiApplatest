import { Router } from "express";
import {
  getAssignedLeads,
  logLeadAction,
  createInspection,
  getFrms,
} from "../../controllers/rmpannel/rmController";

const router = Router();

/* ============================
   RM DASHBOARD
============================ */

// Get leads assigned to RM
// GET /api/rm/leads/assigned?rm_id=UUID
router.get("/leads/assigned", getAssignedLeads);

// Log RM call / follow-up action
// POST /api/rm/leads/log
router.post("/leads/log", logLeadAction);

/* ============================
   INSPECTION CREATION (RM → FRM)
============================ */

// Create inspection & assign FRM
// POST /api/rm/inspections/create
router.post("/inspections/create", createInspection);

/* ============================
   FRM DROPDOWN
============================ */

// Fetch active FRMs
// GET /api/rm/frms
router.get("/frms", getFrms);

export default router;
