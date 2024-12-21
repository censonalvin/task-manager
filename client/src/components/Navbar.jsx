import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Navbar.css';  // Import the CSS file

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await fetch('https://task-manager-api-18no.onrender.com//api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Access-Control-Allow-Headers':
              'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
              'Access-Control-Allow-Methods': 'OPTIONS,POST',
              'Access-Control-Allow-Credentials': false,
              'Access-Control-Allow-Origin': '*',
              'X-Requested-With': '*'
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUserName(data.name);
          } else {
            console.error(data.error);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/images/Task.png" alt="Task Manager Logo" className="logo-image" /> {/* Updated path */}
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto pe-3">
            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item d-lg-none">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item d-lg-none">
                  <Link className="nav-link" to="/create-project">Create Project</Link>
                </li>
                <li className="nav-item d-lg-none">
                  <Link className="nav-link" to="/view-projects">View Projects</Link>
                </li>
                <li className="nav-item d-lg-none">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                </li>
                <li className="nav-item dropdown d-none d-lg-block">
                  <a className="nav-link dropdown-toggle border border-success rounded-pill" href="#!" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {userName}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><Link className="dropdown-item" to="/create-project">Create Project</Link></li>
                    <li><Link className="dropdown-item" to="/view-projects">View Projects</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
