import { Router } from "express";
import {
  getAssignedInspections,
  logInspectionAction,
  getInspectionLogs,
  getFrms,
  scheduleInspection
} from "../../controllers/rmpannel/rmController";

const router = Router();

// Fetch inspections assigned to an FRM
router.get("/inspections/assigned", getAssignedInspections);

// Log an action taken on an inspection
router.post("/inspections/log", logInspectionAction);

// Fetch logs for a specific inspection
router.get("/inspections/logs", getInspectionLogs);

// Fetch active FRMs
router.get("/frms", getFrms);

// Schedule / update an inspection
router.post("/inspections/schedule", scheduleInspection);

export default router;
