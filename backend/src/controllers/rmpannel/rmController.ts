import { Request, Response } from "express";
import db from "../../config/db";

/* =====================================================
   GET ASSIGNED LEADS (RM DASHBOARD)
   GET /rm/leads/assigned?rm_id=UUID
===================================================== */
export const getAssignedLeads = async (req: Request, res: Response) => {
  try {
    const rmId = req.query.rm_id as string;
    if (!rmId) return res.status(400).json({ message: "rm_id required" });

    const result = await db.query(
      `
      SELECT
        l.id AS lead_id,
        l.status,
        l.stage,
        l.substage,
        l.created_at,
        c.name AS customer_name,
        c.phone AS customer_phone,
        c.email AS customer_email
      FROM leads l
      JOIN customers c ON l.customer_id = c.id
      WHERE l.rm_id = $1
      ORDER BY l.created_at DESC
      `,
      [rmId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("[RM] getAssignedLeads error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   LOG RM ACTION / CALL / FOLLOW-UP
   POST /rm/leads/log
===================================================== */
export const logLeadAction = async (req: Request, res: Response) => {
  try {
    const { lead_id, action, stage, substage, remarks, created_by } = req.body;

    if (!lead_id || !action)
      return res.status(400).json({ message: "lead_id & action required" });

    await db.query(
      `
      INSERT INTO call_logs
      (lead_id, action, stage, substage, remarks, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        lead_id,
        action,
        stage || null,
        substage || null,
        remarks || null,
        created_by,
      ]
    );

    // optional: update lead stage
    if (stage) {
      await db.query(
        `
        UPDATE leads
        SET stage = $1, substage = $2
        WHERE id = $3
        `,
        [stage, substage || null, lead_id]
      );
    }

    res.json({ message: "Lead action logged" });
  } catch (err) {
    console.error("[RM] logLeadAction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   CREATE INSPECTION (RM → FRM HANDOFF)
   POST /rm/inspections/create
===================================================== */
export const createInspection = async (req: Request, res: Response) => {
  try {
    const {
      lead_id,
      frm_id,
      scheduled_date,
      location,
      requirements,
      created_by,
    } = req.body;

    if (!lead_id || !frm_id || !scheduled_date)
      return res.status(400).json({ message: "Missing fields" });

    await db.query(
      `
      INSERT INTO inspections
      (lead_id, frm_id, scheduled_date, location, requirements, status, created_by)
      VALUES ($1, $2, $3, $4, $5, 'SCHEDULED', $6)
      `,
      [lead_id, frm_id, scheduled_date, location, requirements || null, created_by]
    );

    // Update lead status
    await db.query(
      `
      UPDATE leads
      SET status = 'INSPECTION_SCHEDULED'
      WHERE id = $1
      `,
      [lead_id]
    );

    res.json({ message: "Inspection scheduled successfully" });
  } catch (err) {
    console.error("[RM] createInspection error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   GET ACTIVE FRMs (RM DROPDOWN)
   GET /rm/frms
===================================================== */
export const getFrms = async (_req: Request, res: Response) => {
  try {
    const result = await db.query(
      `
      SELECT id, name, phone
      FROM rms
      WHERE role = 'FRM' AND status = 'active'
      ORDER BY name
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error("[RM] getFrms error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
