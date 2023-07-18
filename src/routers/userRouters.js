import {
  getUsers,
  createUsers,
  getSingleUsers,
  deleteUser,
} from "../controllers/userControllers.js";
import express from "express";

const app = express();

app.get("/users", getUsers);
app.get("/users/:id", getSingleUsers);
app.delete("/users/:id", deleteUser);
app.post("/users", createUsers);

export default app;
