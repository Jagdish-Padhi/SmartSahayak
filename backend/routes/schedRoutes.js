import express from "express";
import Schedule from "../models/schedules.js";
import { getScheduledSubjectsForToday } from "../controllers/hwController.js";
const router = express.Router();

//_______________to get subjects of today which scheduled________________________________

router.get("/today-subjects", getScheduledSubjectsForToday);

//___________________for get request of schedules___________________________________________

router.get("/", async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: "UID required" });

  const schedules = await Schedule.find({ uid });
  res.json(schedules);
});

//____________________________To save new schedules___________________________________________

router.post("/", async (req, res) => {
  const { uid, day, subject, from, to } = req.body;

  if (!uid) return res.status(400).json({ error: "UID required" });
  if (!day || !subject || !from || !to) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newSchedule = await Schedule.create({ uid, day, subject, from, to });
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//____________________for Deleting each schedule__________________________________

router.delete("/:id", async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "schedule deleted" });
  } catch (err) {
    res.status(500).json([{ error: err.message }]);
  }
});

//_______________________For Reset whole timetale____________________________________

router.delete("/", async (req, res) => {
  const { uid } = req.query;

  if (!uid) return res.status(400).json({ error: error.message });

  try {
    await Schedule.deleteMany({ uid });
    res.json({ message: "All schedules deleted for this user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
