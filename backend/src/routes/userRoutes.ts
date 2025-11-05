import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserPassword,
  deleteUser,
} from "../controllers/userController";
import { authenticateAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticateAdmin, getAllUsers);
router.get("/:id", authenticateAdmin, getUserById);
router.put("/:id", authenticateAdmin, updateUser);
router.put("/:id/password", updateUserPassword);
router.delete("/:id", authenticateAdmin, deleteUser);

export default router;
