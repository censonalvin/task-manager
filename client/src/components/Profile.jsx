import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, ListGroup, Alert, Row, Col, Spinner } from 'react-bootstrap';
import './css/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://task-manager-9a28.vercel.app/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
          // Fetch the user's projects
          fetchProjects(data._id);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Error fetching profile');
      }
    };

    const fetchProjects = async (userId) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://task-manager-9a28.vercel.app/api/projects?user=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setProjects(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Error fetching projects');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  if (!user) {
    return <Container className="mt-5"><Spinner animation="border" variant="primary" /></Container>;
  }

  return (
    <Container className="mt-5 profile-container">
      <h2 className="profile-title">Profile</h2>
      <Card className="mb-4">
        <Card.Header as="h5">User Information</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item><strong>Name:</strong> {user.name}</ListGroup.Item>
          <ListGroup.Item><strong>Email:</strong> {user.email}</ListGroup.Item>
          {/* Add more user fields here if needed */}
        </ListGroup>
      </Card>

      <h3 className="projects-title mt-4">Projects</h3>
      <Row>
        {projects.length > 0 ? (
          projects.map((project) => (
            <Col md={4} key={project._id}>
              <Card className="mb-4 shadow-sm project-card">
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Link to={`/project/${project._id}`} className="btn btn-primary">View Project</Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">No projects found.</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Profile;
