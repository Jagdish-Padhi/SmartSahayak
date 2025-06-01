import mongoose from 'mongoose';

const UserHabitSchema = new mongoose.Schema({
  uid: String,
  date: String,
  done: Boolean,
});

export default mongoose.model("UserHabit", UserHabitSchema);
