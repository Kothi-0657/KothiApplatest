import express, { Request, Response } from "express";
import {
  getAllCustomers,
  updateCustomersStatus,
  deleteCustomers,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getAllCustomers);
router.put("/:id/status", updateCustomersStatus);
router.delete("/:id", deleteCustomers);

export default router;
