import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db";
import serviceRoutes from './routes/serviceRoutes';
import * as bookingRoutes from './routes/bookingRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/services', serviceRoutes);
const bookingsRouter = (bookingRoutes as any).default ?? (bookingRoutes as any).router ?? bookingRoutes;
app.use('/api/bookings', bookingsRouter);

app.get("/", (_req, res) => {
  res.send("Home Services API is running 🚀");
});

export default app;
