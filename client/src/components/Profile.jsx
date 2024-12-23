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
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://task-manager-api-18no.onrender.com/api/users/profile', {
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
    if (newPassword !== confirmPassword) {
      setPasswordMessage('');
      setError('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://task-manager-api-18no.onrender.com/api/users/update-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, password: newPassword })
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
    if (newEmail !== confirmEmail) {
      setEmailMessage('');
      setError('Emails do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://task-manager-api-18no.onrender.com/api/users/update-email', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldEmail, email: newEmail })
      });

      const data = await response.json();
      if (response.ok) {
        setEmailMessage('Email updated successfully');
        setError('');
        setUser({ ...user, email: newEmail });
      } else {
        setEmailMessage('');
        setError(data.error);
      }
    } catch (error) {
      setEmailMessage('');
      setError('Error updating email');
    }
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
            <Form.Group controlId="formOldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}                 onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <Alert variant="danger" className="mt-2">Passwords do not match</Alert>
              )}
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
            <Form.Group controlId="formOldEmail">
              <Form.Label>Old Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter old email"
                value={oldEmail}
                onChange={(e) => setOldEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewEmail">
              <Form.Label>New Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmEmail">
              <Form.Label>Confirm New Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Confirm new email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
              {newEmail && confirmEmail && newEmail !== confirmEmail && (
                <Alert variant="danger" className="mt-2">Emails do not match</Alert>
              )}
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

