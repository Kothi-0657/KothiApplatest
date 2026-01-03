import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_jwt_key_replace_me";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ✅ Hardcoded admin credentials
    const ADMIN_EMAIL = "admin@kothiindia.com";
    const ADMIN_PASSWORD = "Admin@123";

    if (email !== ADMIN_EMAIL) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: "superadmin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      token,
      admin: {
        email: ADMIN_EMAIL,
        role: "superadmin",
      },
    });
  } catch (error) {
    console.error("❌ Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};
