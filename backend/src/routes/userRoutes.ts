import express from "express";
import { getAllUsers, updateUserStatus, deleteUser } from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/users", authenticate, getAllUsers);
router.patch("/users/:id/status", authenticate, updateUserStatus);
router.delete("/users/:id", authenticate, deleteUser);

export default router;
