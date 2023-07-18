import {
  getBookings,
  getSingleBookings,
  deleteBooking,
  createBookings,
} from "../controllers/bookingControllers.js";
import express from "express";

const app = express();

app.get("/bookings", getBookings);
app.get("/bookings/:id", getSingleBookings);
app.delete("/bookings/:id", deleteBooking);
app.post("/bookings", createBookings);

export default app;
