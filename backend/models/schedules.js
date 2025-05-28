import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true }, // Firebase UID
    day: { type: String, required: true },
    subject: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Schedule", scheduleSchema);
