const Task = require("../models/taskModel");
const {sendInAppNotification} =require("../controllers/notificationController")

exports.addTask = async (req, res) => {
  const { title, dueDate } = req.body;

  // Ensure title and dueDate are provided
  if (!title || !dueDate) {
    return res.status(400).json({ error: "Title and due date are required" });
  }

  try {
    // Create a new task and associate it with the planner and user
    const task = await Task.create({
      planner: req.params.plannerId, // Planner ID from URL params
      user: req.user.id,         // User ID from JWT
      title,
      dueDate,
    });
    await sendInAppNotification(req.user.id, `New task "${title}" has been added to your planner.`);

    // Return success with the task details
    res.status(201).json({
      success: true,
      message: "Task added successfully",
      task,
    });
  } catch (error) {
    // Handle errors and send detailed response
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Error adding task" });
  }
};


exports.updateTask = async (req, res) => {
  const { title, dueDate, isCompleted } = req.body;
  console.log("TaskId",req.params.id)
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, dueDate, isCompleted },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ success: true, task });
  } catch (error) {
    // Log the error to see more details
    console.error("Error updating task:", error);

    // Send an error response with the error message
    res.status(500).json({ error: error.message || "Error updating task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      planner: req.params.plannerId,
      user: req.user.id,
    });
    res.status(200).json({ success: true, tasks: tasks || [] });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};
