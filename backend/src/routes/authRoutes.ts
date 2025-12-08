import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const router = express.Router();

/* ---------------------- SIGNUP ----------------------- */
router.post("/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const exists = await pool.query(
      "SELECT * FROM customers WHERE email = $1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.json({
        success: false,
        message: "Email already registered",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO customers (name, email, phone, password_hash, signup_source)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone`,
      [name, email, phone, password_hash, "mobile_app"]
    );

    return res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


/* ---------------------- LOGIN ----------------------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM customers WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
