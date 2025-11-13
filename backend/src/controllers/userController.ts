import { Request, Response } from "express";
import pool from "../config/db"; // your PostgreSQL pool

// GET /api/users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// PATCH /api/users/:id/status
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query("UPDATE users SET status=$1 WHERE id=$2", [status, id]);
    res.json({ success: true, message: "User status updated" });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};
