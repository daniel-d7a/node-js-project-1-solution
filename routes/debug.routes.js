import express from "express";
import { createDB } from "../db.js";

export const debugRouter = express.Router();
const db = createDB();

debugRouter.get("/", async (req, res) => {
  const data = await db.raw();
  res.json(data);
});
