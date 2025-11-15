import express from "express";
import { adminLogin, registerAdmin } from "../controllers/authController";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/register", registerAdmin);
export default router;
