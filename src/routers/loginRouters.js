import { registerUser, loginUser } from "../controllers/loginControllers.js";
import express from "express";

const app = express();

app.post("/auth/register", registerUser);

app.post("/auth/login", loginUser);

export default app;
