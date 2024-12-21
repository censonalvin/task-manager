import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Home.css';  // Import a CSS file for styling

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/create-project');
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section vh-100">
        <div
          className="hero-image"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/undraw_content-team_i066.png)`
          }}
        ></div> {/* Image container */}
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Task Man</h1>
          <p className="hero-subtitle">Organize your projects, collaborate with your team, and get things done efficiently.</p>
          <button className="btn btn-primary hero-button" onClick={handleGetStarted}>Get Started</button>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-cards">
          <div className="card feature-card">
            <img src="images/undraw_project-complete_1zw5.png" alt="Project Management" className="feature-image" /> {/* Dummy image */}
            <div className="card-body">
              <h3 className="card-title">Project Management</h3>
              <p className="card-text">Easily create and manage your projects with an intuitive interface.</p>
            </div>
          </div>
          <div className="card feature-card">
            <img src="images/undraw_creative-team_wfty.png" alt="Collaboration" className="feature-image" /> {/* Dummy image */}
            <div className="card-body">
              <h3 className="card-title">Collaboration</h3>
              <p className="card-text">Collaborate with your team in real-time and stay on the same page.</p>
            </div>
          </div>
          <div className="card feature-card">
            <img src="images/undraw_slider_8svk.png" alt="Task Assignment" className="feature-image" /> {/* Dummy image */}
            <div className="card-body">
              <h3 className="card-title">Task Assignment</h3>
              <p className="card-text">Assign tasks to team members and track progress effortlessly.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2 className="section-title">Ready to Boost Your Productivity?</h2>
        <Link to="/register" className="btn btn-secondary cta-button">Join Now</Link>
      </div>
    </div>
  );
};

export default Home;
