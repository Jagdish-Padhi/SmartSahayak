import mongoose from 'mongoose';

const DailyHabitSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  text: { type: String, required: true },
});

export default mongoose.model("DailyHabit", DailyHabitSchema);
