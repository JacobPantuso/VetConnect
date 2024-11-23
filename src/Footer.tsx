import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <nav className="footer-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/appointments">Appointments</Link>
          <Link to="/pet-profiles">Pet Profiles</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/about">About</Link>
          <Link to="/profile">My Profile</Link>
        </nav>
      </div>
      <p className="footer-rights">© 2024 VetConnect - All Rights Reserved</p>
    </div>
  );
};

export default Footer;
