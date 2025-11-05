import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

/**
 * 🧩 Helper to generate JWT token
 */
const generateToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

/**
 * 📝 Register User
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists (email or phone)
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $2",
      [email, phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone number",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const result = await pool.query(
      "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone",
      [name, email, phone, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

/**
 * 🔐 Login User
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};
