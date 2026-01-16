// src/controllers/adminpannel/adminUserManagementController.ts
import { Request, Response } from "express";
import pool from "../../config/db";

/* ================= RMs ================= */
export const getRMs = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, email, is_active AS "isActive" FROM admin_users WHERE role='RM' ORDER BY id DESC`
    );
    res.json({ rms: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch RMs" });
  }
};

export const createRM = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await pool.query(`INSERT INTO admin_users (email, role, is_active) VALUES ($1, 'RM', true)`, [email]);
    res.json({ message: "RM created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create RM" });
  }
};

/* ================= FRMs ================= */
export const getFRMs = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, email, is_active AS "isActive" FROM admin_users WHERE role='FRM' ORDER BY id DESC`
    );
    res.json({ frms: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch FRMs" });
  }
};

export const createFRM = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await pool.query(`INSERT INTO admin_users (email, role, is_active) VALUES ($1, 'FRM', true)`, [email]);
    res.json({ message: "FRM created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create FRM" });
  }
};

/* ================= Shared ================= */
export const toggleUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query(`UPDATE admin_users SET is_active = NOT is_active WHERE id=$1`, [id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM admin_users WHERE id=$1`, [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
