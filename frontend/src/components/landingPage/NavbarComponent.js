import React, { useState } from 'react';
import '../../assets/styles/LandingPage.css';
import { Link } from 'react-router-dom';

const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="brand">
        <button className="toggle-btn" onClick={toggleMenu}>
          ☰
        </button>
        <span>StudyPlanner</span>
      </div>
      <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#feature">Feature</a>
        <a href="#pricing">Pricing</a>
        <a href="#review">Review</a>
        <a href="#contact">Contact</a>
      </div>
      <Link to="/login">
        <button className="free-trial-btn">Start Now</button>
      </Link>
    </div>
  );
};

export default NavbarComponent;
