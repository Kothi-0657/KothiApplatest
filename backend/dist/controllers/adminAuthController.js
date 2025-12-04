"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Use the same secret as in middleware
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Hardcoded admin for simplicity (you can move this to DB later)
        if (email === "admin@kothiindia.com") {
            if (password === "Admin@123") {
                const token = jsonwebtoken_1.default.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "1d" });
                return res.json({ success: true, token });
            }
            else {
                return res
                    .status(401)
                    .json({ success: false, message: "Invalid password" });
            }
        }
        return res
            .status(404)
            .json({ success: false, message: "Admin not found" });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.adminLogin = adminLogin;
