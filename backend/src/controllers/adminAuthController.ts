import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

// Use the same secret as in middleware
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Hardcoded admin for simplicity (you can move this to DB later)
    if (email === "admin@kothiindia.com") {
      if (password === "Admin@123") {
        const token = jwt.sign(
          { email, role: "admin" },
          JWT_SECRET,
          { expiresIn: "1d" }
        );
        return res.json({ success: true, token });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid password" });
      }
    }

    return res
      .status(404)
      .json({ success: false, message: "Admin not found" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
