// Task Controller
const Task = require("../models/taskModel");
const {sendNotifications} =require("../controllers/notificationController")

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
      user: req.user.id,             // User ID from JWT
      title,
      dueDate,
    });

    // Pass userId, title, and message correctly as an object
    await sendNotifications({ 
      userId: req.user.id, 
      title: `New task "${title}"`, 
      message: `A new task "${title}" has been added to your planner.` 
    });

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
  const { title, dueDate, isCompleted,target,progress,week } = req.body;
  console.log("TaskId",req.params.id)
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, dueDate, isCompleted ,target,progress,week },
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



// Function to fetch top 3 upcoming tasks sorted by due date for a specific user
exports.getUpcomingTasks = async (req, res) => {
  const { userId } = req.params; // Extract userId from the URL parameters

  try {
    // Fetch the top 3 upcoming tasks for the specified userId
    const upcomingTasks = await Task.find({
      userId: userId, // Ensure tasks belong to the specified userId
      dueDate: { $gte: new Date() }, // Ensure only future tasks are included
    })
      .sort({ dueDate: 1 }) // Sort by due date (ascending)
      .limit(3); // Limit to top 3 tasks

    console.log("Upcoming Tasks for User ID:", userId, upcomingTasks);

    if (!upcomingTasks || upcomingTasks.length === 0) {
      console.error("No upcoming tasks found for user:", userId);
      return res.status(404).json({
        success: false,
        error: `No upcoming tasks found for user ${userId}`,
      });
    }

    // Return the upcoming tasks for the specific user
    res.status(200).json({
      success: true,
      tasks: upcomingTasks,
    });
  } catch (error) {
    // Log the error details to understand the source of the failure
    console.error("Error fetching upcoming tasks:", error);

    // Detailed error message with stack trace
    res.status(500).json({
      success: false,
      error: "Error fetching upcoming tasks.",
      details: error.message, // Provide the specific error message
      stack: error.stack, // Include the stack trace for debugging
    });
  }
};
// Calculate overall progress for a user
exports.getUserProgress = async (req, res) => {
  const { userId, plannerId } = req.params; // Extract userId and plannerId from the URL parameters

  try {
    // Fetch all tasks for the user under the specific planner
    const tasks = await Task.find({ planner: plannerId, user: userId });

    if (tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found for the user" });
    }

    // Calculate the number of completed tasks and total tasks
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const totalTasks = tasks.length;

    // Calculate progress percentage
    const progress = (completedTasks / totalTasks) * 100;

    // Return the progress of the user
    res.status(200).json({
      success: true,
      progress: progress.toFixed(2), // Return progress as a percentage (two decimal points)
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Error fetching user progress", details: error.message });
  }
};

// Update progress based on task completion
exports.updateProgressOnCompletion = async (req, res) => {
  const { taskId } = req.params;

  try {
    // Find the task and update its completion status
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.isCompleted = true; // Mark the task as completed
    await task.save(); // Save the task

    // Recalculate the user's progress after the update
    const tasks = await Task.find({ planner: task.planner, user: task.user });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;

    const updatedProgress = (completedTasks / totalTasks) * 100;

    // Return the updated progress
    res.status(200).json({
      success: true,
      message: "Task marked as completed",
      updatedProgress: updatedProgress.toFixed(2),
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Error updating progress", details: error.message });
  }
};


exports.getWeeklyProgress = async (req, res) => {
  const { userId, week } = req.params; // Extract userId and week from the URL params

  try {
    // Find all tasks for the user in the specified week
    const tasks = await Task.find({ user: userId, week: week });
    console.log("Week",week);
    console.log("Tasks of this week",tasks);

    if (tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found for this week" });
    }

    // Calculate the total target and total progress
    const totalTarget = tasks.reduce((acc, task) => acc + task.target, 0);
    const totalProgress = tasks.reduce((acc, task) => acc + task.progress, 0);

    // Calculate the progress percentage
    const progress = (totalProgress / totalTarget) * 100;

    // Return the progress in the response
    res.status(200).json({
      success: true,
      progress: progress.toFixed(2), // Return progress as a percentage
    });
  } catch (error) {
    console.error("Error fetching weekly progress:", error);
    res.status(500).json({ error: "Error fetching weekly progress", details: error.message });
  }
};
