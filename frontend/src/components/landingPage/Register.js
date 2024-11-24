import React, { useState } from 'react';
import { Form, Button, Container, Row, Col,Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/Api';  // Axios instance
import "../../assets/styles/LandingPage.css";

const Register = () => {
  const [name, setName] = useState('');  // Added name field
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Pass name along with email and password to backend
      const response = await api.post('/auth/register', { name, email, password });
      setSuccess('Registration successful! Redirecting to login page...');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to register');
      setSuccess('');
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={6} className="mx-auto">
          <h2>Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" style={{ background: "#ff6b6b", border: "none", marginTop: "10px" }}>
              Register
            </Button>
          </Form>
          <Link to="/login">Already have an account? Login here</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
