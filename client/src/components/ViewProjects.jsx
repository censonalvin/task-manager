import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import './css/ViewProjects.css';

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token:", token); // Debug log

        const response = await fetch('https://task-manager-api-18no.onrender.com/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log("API Response:", data); // Debug log

        if (response.ok) {
          setProjects(data);
          console.log("Fetched projects:", data); // Debug log
        } else {
          setMessage(data.error || 'Failed to fetch projects');
        }
      } catch (error) {
        setMessage('Error fetching projects');
        console.error("Error fetching projects:", error); // Debug log
      }
    };

    fetchProjects();
  }, []);

  const deleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('User is not authenticated.');
        return;
      }
  
      const response = await fetch(`https://task-manager-api-18no.onrender.com/api/projects/deleteProject/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to delete project.');
        console.error('Delete Error:', errorData);
        return;
      }
  
      // Parse response only if it's okay
      const data = await response.json();
      console.log('Delete Response:', data);
  
      // Update the projects state
      setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
      setMessage('Project deleted successfully');
    } catch (error) {
      setMessage('Error deleting project.');
      console.error('Error:', error);
    }
  };
  
  
  if (!projects.length && !message) {
    return (
      <Container className="mt-5 view-projects-container">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-5 view-projects-container">
      <h2 className="view-projects-title">Projects</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Row>
        {projects.map((project) => (
          <Col md={4} key={project._id}>
            <Card className="mb-4 shadow-sm project-card">
              <Card.Body>
                <Card.Title>{project.name}</Card.Title>
                <Link to={`/project/${project._id}`} className="btn btn-primary">View Project</Link>
                <Button variant="danger" onClick={() => deleteProject(project._id)} className="ml-2">Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {projects.length === 0 && (
        <Alert variant="info">No projects found.</Alert>
      )}
    </Container>
  );
};

export default ViewProjects;
