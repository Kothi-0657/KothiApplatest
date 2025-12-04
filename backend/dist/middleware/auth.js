"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";
async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
}
