const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  planner: { type: mongoose.Schema.Types.ObjectId, ref: "Planner", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  target: { type: Number, required: true ,default:0},         // The target value (e.g., "10 hours" or "100%")
  progress: { type: Number, default: 0 },           // The current progress towards the goal (e.g., "4 hours")
  week: { type: String, required: true,default:false },           // The specific week for the goal (e.g., '2024-W48')
});

module.exports = mongoose.model("Task", taskSchema);

