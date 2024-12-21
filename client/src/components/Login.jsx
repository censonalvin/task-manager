import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './css/Login.css';  // Import a CSS file for custom styles

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://task-manager-api-18no.onrender.com//api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
          'Access-Control-Allow-Credentials': false,
          'Access-Control-Allow-Origin': '*',
          'X-Requested-With': '*',
      },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Login successful! Redirecting to home page...');
        localStorage.setItem('token', data.token); // Save the token
        setTimeout(() => {
          navigate('/');
        }, 3000); // 3 seconds delay before navigating to home page
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm" style={{ width: '30rem' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Login</h2>
          {message && <p className="alert alert-info">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <div className="text-center mt-3">
            <div className="long-dash">or</div>
            <Link to="/register" className="register-link">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
