const Task = require("../models/Task");
const Project = require("../models/Project");

// Get all tasks for the current user
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.userId }).populate("project");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    next(error);
  }
};

// Get all tasks for a specific project
const getProjectTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name email'); // Populate assignedTo field with user details
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};


// Create a new task for a project
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, projectId } = req.body; // Use 'assignedTo' field
    
    console.log('Request Body:', req.body); // Log the input data for debugging

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const task = new Task({
      title,
      description,
      assignedTo, // Correctly use 'assignedTo' field
      project: projectId,
      creator: req.user.id, // Ensure you have the user's ID from the token or session
    });

    await task.save();
    
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    next(error);
  }
};

// Update a task by ID
const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: req.userId },
      updates,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    next(error);
  }
};

// Delete a task by ID
const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOneAndDelete({ _id: taskId, user: req.userId });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Remove the task reference from the project
    await Project.updateOne(
      { _id: task.project },
      { $pull: { tasks: task._id } }
    );

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    next(error);
  }
};

module.exports = {
  getTasks,
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
};
