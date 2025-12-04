"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdmin = exports.adminLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
// ✅ Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db_1.default.query("SELECT * FROM admins WHERE email = $1", [email]);
        const admin = result.rows[0];
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, role: "admin", email: admin.email }, JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            success: true,
            message: "Login successful",
            admin: { id: admin.id, name: admin.name, email: admin.email },
            token,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
};
exports.adminLogin = adminLogin;
// ✅ Register Admin (optional)
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await db_1.default.query("SELECT * FROM admins WHERE email = $1", [email]);
        if (exists.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Admin already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await db_1.default.query("INSERT INTO admins (name, email, password) VALUES ($1, $2, $3)", [name, email, hashedPassword]);
        res.status(201).json({ success: true, message: "Admin registered successfully" });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
};
exports.registerAdmin = registerAdmin;
