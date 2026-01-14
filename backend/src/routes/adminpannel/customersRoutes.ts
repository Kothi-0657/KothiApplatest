import express, { Request, Response } from "express";
import { getCustomerBookings } from "../../controllers/adminpannel/userController";
import {
  getAllCustomers,
  updateCustomersStatus,
  deleteCustomers,
  

} from "../../controllers/adminpannel/userController";

const router = express.Router();

router.get("/", getAllCustomers);
router.put("/:id/status", updateCustomersStatus);
router.delete("/:id", deleteCustomers);
router.get("/bookings/:customerId", getCustomerBookings);

export default router;
