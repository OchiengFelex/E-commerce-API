import {
  getAdmins,
  createAdmin,
  updateAdmins,
  deleteAdmins,
  loginAdmin,
} from "../controllers/adminControllers.js";
import express from "express";

const app = express();

app.get("/admins", getAdmins);
app.put("/admin/:id", updateAdmins);
app.delete("/admin/:id", deleteAdmins);

//creating a new admin and login for the admin

app.post("/auth/createAdmin", createAdmin);
app.post("/auth/admin/login", loginAdmin);

export default app;
