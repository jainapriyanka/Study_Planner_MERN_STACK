// src/components/NavbarComponent.js
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

const NavbarComponent = () => {
  return (
    <Navbar expand="lg" className="navbar-custom">
      <Navbar.Brand href="/" className="brand-logo">Study Planner</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/login" className="btn-auth">Login</Nav.Link>
          <Nav.Link as={Link} to="/register" className="btn-auth">Register</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
