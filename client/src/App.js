import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import CreateProject from './components/CreateProject';
import ViewProject from './components/ViewProject';
import ViewProjects from './components/ViewProjects';
import Home from './components/Home'; // Import Home component

const App = () => (
  <Router>
    <Navbar />
    <div>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Set Home as the default route */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/view-projects" element={<ViewProjects />} />
        <Route path="/project/:projectId" element={<ViewProject />} />
      </Routes>
    </div>
  </Router>
);

export default App;
