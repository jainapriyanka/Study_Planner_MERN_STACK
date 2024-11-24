const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  planner: { type: mongoose.Schema.Types.ObjectId, ref: "Planner", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);
