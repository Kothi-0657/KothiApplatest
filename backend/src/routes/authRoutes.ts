import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * 🧩 USER SIGNUP
 */
router.post("/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Name, email, and password are required" });
  }

  try {
    // 🔍 Check if email already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧾 Insert into DB
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, "user"]
    );

    const user = result.rows[0];

    // 🎫 Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, message: "User registered successfully", user, token });
  } catch (err: any) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
});

/**
 * 🧩 USER LOGIN
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password required" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});

export default router;
