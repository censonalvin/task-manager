const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");

const createProject = async (req, res, next) => {
  try {
    const { name, users = [] } = req.body;

    // Add the creator's email to the users array
    const creatorEmail = req.userEmail;
    if (!users.includes(creatorEmail)) {
      users.push(creatorEmail);
    }

    // Remove null or empty strings from the users array
    const filteredUsers = users.filter(email => email && email.trim() !== '');

    const userObjects = await User.find({ email: { $in: filteredUsers } }).select("_id email");
    const userIds = userObjects.map(user => user._id);
    const registeredEmails = userObjects.map(user => user.email);
    const invalidEmails = filteredUsers.filter(email => !registeredEmails.includes(email));

    if (invalidEmails.length > 0) {
      return res.status(400).json({ error: `These emails are not registered: ${invalidEmails.join(', ')}` });
    }

    const project = new Project({
      name,
      admin: req.userId,
      users: userIds,
    });

    await project.save();
    console.log("Project created:", project); // Debug log

    res.status(201).json({ message: "Project created successfully!" });
  } catch (error) {
    console.error("Error creating project:", error);
    next(error);
  }
};


const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("users", "name email") // Ensure to populate name and email for users
      .populate({
        path: "tasks",
        populate: {
          path: "creator",
          select: "name email"
        }
      });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const addUserToProject = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.admin.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: "Only admin can add users" });
    }

    project.users.push(user._id);
    await project.save();

    res.status(200).json({ message: "User added to project successfully" });
  } catch (error) {
    next(error);
  }
};

const addTaskToProject = async (req, res, next) => {
  try {
    const { title, description, assignedTo } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const task = new Task({
      title,
      description,
      project: project._id,
      user: assignedTo,  // This is the assigned user ID
      creator: req.userId, // This is the creator (authenticated user)
    });

    await task.save();
    project.tasks.push(task._id);
    await project.save();

    // Now populate both the user (assignedTo) and creator fields
    const populatedTask = await Task.findById(task._id)
      .populate('user', 'name email')  // Populate assignedTo (user)
      .populate('creator', 'name email');  // Populate creator

    res.status(201).json({
      message: "Task added to project successfully",
      task: populatedTask,  // Send populated task
    });
  } catch (error) {
    console.error("Error adding task to project:", error);
    next(error);
  }
};

const getProjectsByUser = async (req, res, next) => {
  try {
    const userId = req.userId;  // Use the authenticated user's ID
    console.log("Fetching projects for authenticated user:", userId); // Debug log

    const projects = await Project.find({ users: userId }).populate('users');
    console.log("Fetched projects:", projects);  // Debug log

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    console.error("Error updating task status:", error);
    next(error);
  }
};
const deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    console.log("Request to delete project with ID:", projectId); // Debug log

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      console.log("Project not found:", projectId); // Debug log
      return res.status(404).json({ error: "Project not found" });
    }

    console.log("Found project:", project); // Debug log

    // Delete all tasks associated with the project
    const deletedTasks = await Task.deleteMany({ project: projectId });
    console.log("Deleted tasks:", deletedTasks); // Debug log

    // Delete the project
    const deletedProject = await Project.findByIdAndDelete(projectId);
    console.log("Deleted project:", deletedProject); // Debug log

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = {
  createProject,
  getProjectById,
  addUserToProject,
  addTaskToProject,
  getProjectsByUser,
  updateTaskStatus,
  deleteProject,
};
