const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, projectController.createProject); // Create a new project
router.get("/", authMiddleware, projectController.getProjectsByUser); // Get projects by user
router.get("/:projectId", authMiddleware, projectController.getProjectById); // Get project by ID
router.post("/:projectId/add-user", authMiddleware, projectController.addUserToProject); // Add user to project
router.post("/:projectId/add-task", authMiddleware, projectController.addTaskToProject); // Route for adding tasks
router.patch("/tasks/:taskId/status", authMiddleware, projectController.updateTaskStatus); // Route for updating task status
router.delete('/deleteProject/:projectId', projectController.deleteProject);

module.exports = router;
