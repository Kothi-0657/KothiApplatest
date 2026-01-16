// src/middleware/adminAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;
if (!SECRET_KEY) throw new Error("JWT_SECRET not defined");

export interface AdminRequest extends Request {
  user?: { id: number; email: string; role: string };
}

export default function adminAuth(req: AdminRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
}
