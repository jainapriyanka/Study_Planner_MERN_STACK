const express = require("express");
const router = express.Router();
const { fetchUser } = require("../Middleware/fetchUser");
const {
  addTask,
  updateTask,
  deleteTask,
  getTasks,
} = require("../controllers/taskController");
const { verifyToken } = require("../middleware/verifyToken");


// Task Routes
router.post("/:plannerId/task",verifyToken, fetchUser, addTask);
router.put("/task/:id",verifyToken, fetchUser, updateTask);
router.delete("/deleteTask/:id",verifyToken, fetchUser, deleteTask);
router.get("/:plannerId/tasks",verifyToken, fetchUser, getTasks);

module.exports = router;
