import mongoose from "mongoose";

const hwSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  uid: { type: String, required: true },  
  subject: { type: String, required: true },
  task: { type: String, default: "Homework task to be defined...." },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  imageURL: String,
  extractedText: String,
  feedback: String, 
  score: { type: Number, default: 0 },
  givenByAI: { type: Boolean, default: false },
  topic: String, 
});

export default mongoose.model("Hw", hwSchema);