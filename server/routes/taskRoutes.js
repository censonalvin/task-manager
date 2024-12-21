const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, taskController.getTasks); // Protected route
router.get("/project/:projectId", authMiddleware, taskController.getProjectTasks); // Protected route
router.post("/", authMiddleware, taskController.createTask); // Protected route
router.put("/:taskId", authMiddleware, taskController.updateTask); // Protected route
router.delete("/:taskId", authMiddleware, taskController.deleteTask); // Protected route

module.exports = router;
