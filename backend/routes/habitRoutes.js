import express from "express";
import { getTodayHabit, markHabitDone } from "../controllers/habitController.js";

const router = express.Router();

router.get("/today", getTodayHabit);
router.post("/mark-done", markHabitDone);

export default router;
