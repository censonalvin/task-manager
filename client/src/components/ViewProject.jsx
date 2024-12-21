import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  Card,
  Badge,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import "./css/ViewProject.css";

const ViewProject = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState("");
  const [userMessage, setUserMessage] = useState(""); // State for user modal message
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://task-manager-9a28.vercel.app/api/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setProject(data);
        } else {
          setMessage(data.error || "Failed to fetch project");
        }
      } catch (error) {
        setMessage("Error fetching project");
      }
    };

    fetchProject();
  }, [projectId]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://task-manager-9a28.vercel.app/api/projects/${projectId}/add-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: newUserEmail }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUserMessage("User added successfully");
        setProject({
          ...project,
          users: [
            ...project.users,
            { _id: data.userId, email: newUserEmail, name: data.name },
          ],
        });
        setNewUserEmail("");
        setShowUserModal(false);

        // Reload the page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setUserMessage(data.error || "Failed to add user");
      }
    } catch (error) {
      setUserMessage("Error adding user");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo, // Make sure this is set correctly
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://task-manager-9a28.vercel.app/api/projects/${projectId}/add-task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        const newTask = data.task;

        // Ensure that the creator and assignedTo are set properly
        const taskWithPopulatedUser = {
          ...newTask,
          assignedTo: newTask.user, // This should be populated with the assigned user
          creator: newTask.creator, // This should be the creator of the task
        };

        // Log to confirm the mapping
        console.log("Assigned To:", taskWithPopulatedUser.assignedTo);
        console.log("Creator:", taskWithPopulatedUser.creator);

        // Update the selected task state for immediate rendering
        setSelectedTask(taskWithPopulatedUser);

        // Update the project tasks
        setProject({
          ...project,
          tasks: [...project.tasks, taskWithPopulatedUser],
        });

        // Clear form fields
        setNewTask({ title: "", description: "", assignedTo: "" });

        // Close the modal
        setShowTaskModal(false);

        // Optional: Avoid full reload unless necessary
        // window.location.reload();
      } else {
        setMessage(data.error || "Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setMessage("Error adding task");
    }
  };

  const handleChangeTaskStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://task-manager-9a28.vercel.app/api/projects/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        const updatedTasks = project.tasks.map((task) =>
          task._id === taskId ? { ...task, status: data.task.status } : task
        );
        setProject({ ...project, tasks: updatedTasks });
        setMessage("Task status updated successfully");
        window.location.reload(); // Reload the page after marking a task as complete
      } else {
        setMessage(data.error || "Failed to update task status");
      }
    } catch (error) {
      setMessage("Error updating task status");
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
  };

  const handleTaskDetailModalClose = () => {
    setSelectedTask(null);
    setShowTaskDetailModal(false);
  };

  if (!project) {
    return (
      <Container className="mt-5">
        <p>Loading...</p>
      </Container>
    );
  }

  const pendingTasks = project.tasks.filter(
    (task) => task.status !== "completed"
  );
  const completedTasks = project.tasks.filter(
    (task) => task.status === "completed"
  );

  return (
    <Container className="main-content mt-5">
      <h2>{project.name}</h2>
      {message && <Alert variant="info">{message}</Alert>}

      <div className="fixed-top-bar d-flex p-3">
        <Button
          variant="primary"
          className="me-2"
          onClick={() => setShowTaskModal(true)}
        >
          <PlusCircle /> Add Task
        </Button>
        <Button variant="primary" onClick={() => setShowUserModal(true)}>
          Add User
        </Button>
      </div>

      <div className="users-list mt-5">
        <h3>Users</h3>
        <Row>
          {project.users.map((user) => (
            <Col key={user._id} md={3} className="mb-3">
              <Card className="user-card">
                <Card.Body className="d-flex align-items-center">
                  <div className="user-avatar">
                    <img
                      src={`https://avatars.dicebear.com/api/human/${user._id}.svg`}
                      alt="User Avatar"
                    />
                  </div>
                  <div className="user-info ms-3">
                    <Card.Title>{user.name}</Card.Title>
                    <Card.Text>{user.email}</Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Container className="mt-3">
        <Row>
          <Col className="task-column">
            <h3 className="bg-primary text-white p-2">Pending Tasks</h3>
            <div className="task-list">
              {pendingTasks.map((task, index) => (
                <Card
                  key={index}
                  className="task-card mb-3"
                  onClick={() => handleTaskClick(task)}
                >
                  <Card.Body>
                    <Card.Title>{task.title}</Card.Title>
                    <Card.Text>{task.description}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
          <Col className="task-column">
            <h3 className="bg-success text-white p-2">Completed Tasks</h3>
            <div className="task-list">
              {completedTasks.map((task, index) => (
                <Card
                  key={index}
                  className="task-card mb-3"
                  onClick={() => handleTaskClick(task)}
                >
                  <Card.Body>
                    <Card.Title>{task.title}</Card.Title>
                    <Card.Text>{task.description}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
                </Row>
      </Container>

      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task to {project.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTask}>
            <Form.Group controlId="taskTitle" className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="taskDescription" className="mb-3">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                type="text"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="taskAssignedTo" className="mb-3">
              <Form.Label>Assign To</Form.Label>
              <Form.Select
                value={newTask.assignedTo}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignedTo: e.target.value })
                }
                required
              >
                <option value="">Select User</option>
                {project.users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email} ({user.name})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary">
              Add Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {selectedTask && (
        <Modal show={showTaskDetailModal} onHide={handleTaskDetailModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedTask.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              <Card.Body>
                <Card.Text>Description: {selectedTask.description}</Card.Text>
                <Card.Text>
                  Assigned to:{" "}
                  {selectedTask?.assignedTo
                    ? `${selectedTask.assignedTo.name} (${selectedTask.assignedTo.email})`
                    : "Unknown"}
                </Card.Text>

                <Card.Text>
                  Created by:{" "}
                  {selectedTask?.creator
                    ? `${selectedTask.creator.name} (${selectedTask.creator.email})`
                    : "Unknown"}
                </Card.Text>

                <Card.Text>
                  Date Added:{" "}
                  {new Date(selectedTask.createdAt).toLocaleDateString()}
                </Card.Text>
                <Card.Text>
                  Status:{" "}
                  <Badge
                    bg={
                      selectedTask.status === "completed"
                        ? "success"
                        : "secondary"
                    }
                  >
                    {selectedTask.status}
                  </Badge>
                </Card.Text>
                {selectedTask.status !== "completed" && (
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleChangeTaskStatus(selectedTask._id, "completed")
                    }
                  >
                    Mark as Complete
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      )}

      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add User to {project.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userMessage && <Alert variant="info">{userMessage}</Alert>}
          <Form onSubmit={handleAddUser}>
            <Form.Group controlId="userEmail" className="mb-3">
              <Form.Label>User Email</Form.Label>
              <Form.Control
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Add User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ViewProject;
