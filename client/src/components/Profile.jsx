import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, ListGroup, Alert, Row, Col, Spinner, Button, Modal, Form } from 'react-bootstrap';
import './css/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://task-manager-api-18no.onrender.com/api/users/profile-with-password', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
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
        const response = await fetch(`https://task-manager-api-18no.onrender.com/api/projects?user=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
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

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://task-manager-api-18no.onrender.com/api/users/update-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setPasswordMessage('Password updated successfully');
        setError('');
      } else {
        setPasswordMessage('');
        setError(data.error);
      }
    } catch (error) {
      setPasswordMessage('');
      setError('Error updating password');
    }
  };

  const handleChangeEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://task-manager-api-18no.onrender.com/api/users/update-email', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newEmail })
      });

      const data = await response.json();
      if (response.ok) {
        setEmailMessage('Email updated successfully');
        setError('');
        setUser({ ...user, email: newEmail }); // Update the email in the user state
      } else {
        setEmailMessage('');
        setError(data.error);
      }
    } catch (error) {
      setEmailMessage('');
      setError('Error updating email');
    }
  };

  const formatPassword = (password) => {
    if (!password || password.length <= 3) {
      return password; // Return the password as is if it's too short or undefined
    }
    return `${password.slice(0, 2)}**${password.slice(-1)}`;
  };

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
          <ListGroup.Item><strong>Password:</strong> {formatPassword(user.password)}</ListGroup.Item>
          <ListGroup.Item>
            <Button variant="secondary" onClick={() => setShowEmailModal(true)}>Change Email</Button>
          </ListGroup.Item>
          <ListGroup.Item>
            <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
          </ListGroup.Item>
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

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordMessage && <Alert variant="success">{passwordMessage}</Alert>}
          <Form>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleChangePassword}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Change Email Modal */}
      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {emailMessage && <Alert variant="success">{emailMessage}</Alert>}
          <Form>
            <Form.Group controlId="formNewEmail">
              <Form.Label>New Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmailModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleChangeEmail}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
