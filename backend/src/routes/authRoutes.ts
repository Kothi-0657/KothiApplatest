import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const customersResult = await pool.query("SELECT * FROM cusotmers WHERE email = $1", [email]);

    if (customersResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const customers = customersResult.rows[0];
    const isMatch = await bcrypt.compare(password, customers.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: customers.id, role: customers.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: customers.id,
        name: customers.name,
        email: customers.email,
        role: customers.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
