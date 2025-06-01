import express from "express";
import mongoose from "mongoose";
import scheduleRoutes from "./routes/schedRoutes.js";
import hwRoutes from "./routes/hwRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//for chat with AI middleware

app.use(
  session({
    secret: "smart_sahayak_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/api/schedules", scheduleRoutes);
app.use("/api/hw", hwRoutes);
app.use("/api/doubts", chatRoutes);
app.use("/api/habit", habitRoutes);


// MongoDB connections

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
