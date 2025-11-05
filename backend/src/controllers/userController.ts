import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcryptjs";

/**
 * 👥 Get all users (Admin use)
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ success: true, users: users.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

/**
 * 👤 Get single user by ID
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1",
      [id]
    );

    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

/**
 * ✏️ Update user info
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, phone = $3 
       WHERE id = $4 RETURNING id, name, email, phone, role, created_at`,
      [name, email, phone, id]
    );

    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User updated successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

/**
 * 🔑 Update password
 */
export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const userResult = await pool.query("SELECT password FROM users WHERE id = $1", [id]);
    if (!userResult.rows.length)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, userResult.rows[0].password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Old password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, id]);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ success: false, message: "Failed to update password" });
  }
};

/**
 * 🗑️ Delete user (Admin use)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};
