import express from "express";
import { getTodayHw, uploadHw, generateNewHw } from "../controllers/hwController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/today", getTodayHw);

router.post("/upload", upload.single("file"), uploadHw);

router.post("/new", generateNewHw);

export default router;
