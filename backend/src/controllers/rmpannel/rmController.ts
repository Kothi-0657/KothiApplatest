import { Request, Response } from "express";
import db from "../../config/db"; // your PostgreSQL connection

/* -------------------- Get Assigned Inspections -------------------- */
export const getAssignedInspections = async (req: Request, res: Response) => {
  try {
    const frmId = req.query.frm_id as string;
    console.log("[RM] Fetching inspections for FRM ID:", frmId);

    if (!frmId) return res.status(400).json({ message: "frm_id required" });

    const inspections = await db.query(
      `
      SELECT 
        i.id AS inspection_id,
        i.scheduled_date,
        i.location,
        i.requirements,
        i.status,
        i.frm_id,
        l.id AS lead_id,
        c.id AS customer_id,
        c.name AS customer_name,
        c.phone AS customer_phone,
        c.email AS customer_email
      FROM inspections i
      JOIN leads l ON i.lead_id = l.id
      LEFT JOIN customers c ON l.customer_id = c.id
      WHERE i.frm_id = $1
      ORDER BY i.scheduled_date ASC
      `,
      [frmId]
    );

    console.log(`[RM] Inspections fetched: ${inspections.rows.length}`);
    res.json(inspections.rows);
  } catch (err) {
    console.error("[RM] Error in getAssignedInspections:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- Log Inspection Action -------------------- */
export const logInspectionAction = async (req: Request, res: Response) => {
  try {
    const { inspection_id, action, stage, substage, remarks, timestamp } = req.body;

    if (!inspection_id || !action)
      return res.status(400).json({ message: "Required fields missing" });

    await db.query(
      `
      INSERT INTO call_logs (inspection_id, action, stage, substage, remarks, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [inspection_id, action, stage, substage || null, remarks || null, timestamp]
    );

    res.json({ message: "Action logged successfully" });
  } catch (err) {
    console.error("[RM] Error in logInspectionAction:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- Get Inspection Logs -------------------- */
export const getInspectionLogs = async (req: Request, res: Response) => {
  try {
    const inspectionId = req.query.inspection_id as string;

    if (!inspectionId) return res.status(400).json({ message: "inspection_id required" });

    const logs = await db.query(
      `
      SELECT *
      FROM call_logs
      WHERE inspection_id = $1
      ORDER BY timestamp ASC
      `,
      [inspectionId]
    );

    res.json(logs.rows);
  } catch (err) {
    console.error("[RM] Error in getInspectionLogs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- Get Active FRMs -------------------- */
export const getFrms = async (_req: Request, res: Response) => {
  try {
    const result = await db.query(
      `
      SELECT id, name, email, phone
      FROM rms
      WHERE status = 'active'
      ORDER BY name
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error("[RM] Error in getFrms:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- Schedule / Update Inspection -------------------- */
export const scheduleInspection = async (req: Request, res: Response) => {
  try {
    const { inspection_id, frm_id, scheduled_date, location, remarks, updated_by } = req.body;

    if (!inspection_id || !frm_id || !scheduled_date)
      return res.status(400).json({ message: "Missing fields" });

    // 1. Get current inspection
    const current = await db.query(
      `SELECT frm_id FROM inspections WHERE id = $1`,
      [inspection_id]
    );

    const oldFrmId = current.rows[0]?.frm_id || null;

    // 2. Update inspection details
    await db.query(
      `
      UPDATE inspections
      SET frm_id = $1,
          scheduled_date = $2,
          location = $3,
          updated_at = NOW()
      WHERE id = $4
      `,
      [frm_id, scheduled_date, location, inspection_id]
    );

    // 3. Log assignment changes
    await db.query(
      `
      INSERT INTO inspection_assignment_logs
      (inspection_id, old_frm_id, new_frm_id, scheduled_date, location, updated_by, remarks)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [inspection_id, oldFrmId, frm_id, scheduled_date, location, updated_by, remarks || null]
    );

    res.json({ message: "Inspection scheduled & assigned successfully" });
  } catch (err) {
    console.error("[RM] Error in scheduleInspection:", err);
    res.status(500).json({ message: "Server error" });
  }
};
