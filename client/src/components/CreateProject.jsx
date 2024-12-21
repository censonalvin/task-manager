import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import './css/CreateProject.css';

const CreateProject = () => {
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Add state for success message
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in');
          return;
        }

        // Fetch logged-in user profile
        const responseProfile = await fetch('https://task-manager-9a28.vercel.app/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const dataProfile = await responseProfile.json();
        if (responseProfile.ok) {
          setEmail(dataProfile.email); // Set the email of the logged-in user

          // Set the default value of the select input
          const userOption = {
            label: `${dataProfile.email} (${dataProfile.name})`, // Display email and name in the select dropdown
            value: dataProfile.email, // Value should be the email as well
            isFixed: true // Prevent this option from being removed
          };
          setSelectedUsers([userOption]); // Default selection
        } else {
          setError(dataProfile.error || 'Failed to fetch user profile');
        }

        // Fetch all registered users except the logged-in user
        const responseUsers = await fetch('https://task-manager-9a28.vercel.app/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const dataUsers = await responseUsers.json();
        if (responseUsers.ok) {
          // Filter out the logged-in user from the options list
          const users = dataUsers
            .filter(user => user.email !== dataProfile.email) // Exclude the logged-in user
            .map(user => ({
              label: `${user.email} (${user.name})`, // Display email and name in the select dropdown
              value: user.email  // Assuming 'email' is the unique identifier
            }));
          setUserOptions(users); // Set the user options for the select dropdown
        } else {
          setError(dataUsers.error || 'Failed to fetch users');
        }
      } catch (error) {
        setError('Error fetching data');
      }
    };

    fetchUserData();
  }, []);

  const handleUserSelection = (selected) => {
    // Include the logged-in user in the selection and mark them as fixed
    const loggedInUserOption = selectedUsers.find(user => user.value === email);
    if (loggedInUserOption) {
      selected = [loggedInUserOption, ...selected.filter(user => user.value !== email)];
    }
    setSelectedUsers(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in');
        setLoading(false);
        return;
      }

      // Extract only the email values
      const users = selectedUsers.map(user => user.value);
      const newProject = { name: projectName, users };

      const response = await fetch('https://task-manager-9a28.vercel.app/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Successfully created the project'); // Set success message
        setProjectName(''); // Clear the form
        setSelectedUsers([selectedUsers[0]]); // Reset to default logged-in user

        // Reload the page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (error) {
      setError('Error creating project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container className="mt-5"><Spinner animation="border" variant="primary" /></Container>;
  }

  return (
    <Container className="mt-5 create-project-container">
      <h2 className="create-project-title">Create New Project</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <div className="form-wrapper">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formProjectName" className="mb-3">
            <Form.Label className="create-project-label">Project Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formUserSelection" className="mb-3">
            <Form.Label className="create-project-label">Select Users</Form.Label>
            <Select
              isMulti
              name="users"
              options={userOptions} // Pass other users here if needed
              className="basic-multi-select create-project-select"
              classNamePrefix="select"
              value={selectedUsers} // Default value is set to logged-in user
              onChange={handleUserSelection}
              closeMenuOnSelect={false}
              isClearable={false} // Prevent clearing the selection
              components={{
                MultiValueRemove: ({ innerProps }) => selectedUsers.length > 1 && <div {...innerProps}>×</div>
              }}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="create-project-button">
            Create Project
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default CreateProject;
