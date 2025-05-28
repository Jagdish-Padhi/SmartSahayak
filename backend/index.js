import scheduleRoutes from "./routes/schedRoutes.js";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/schedules", scheduleRoutes);

// MongoDB connection'
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
