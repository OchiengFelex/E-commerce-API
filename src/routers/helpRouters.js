import {
  getHelp,
  deleteHelp,
  createHelp,
} from "../controllers/helpControllers.js";

import express from "express";

const app = express();

app.get("/help", getHelp);
app.post("/help", createHelp);
app.delete("/help/:id", deleteHelp);

export default app;
