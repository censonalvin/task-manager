const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  }],
}, {
  timestamps: true,
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
