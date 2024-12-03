import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/Api'; // Axios instance
import './LandingPage.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.userData.token);
      localStorage.setItem('userName', response.data.userData.name);
      localStorage.setItem('userId', response.data.userData.id);
      setSuccess('Login successful! Redirecting to dashboard...');
      setError('');
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setError('Invalid credentials');
      setSuccess('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-auth">Login</button>
          <div className="forgot-link">
            <Link to="/register">New Here? Register Now</Link>
          </div>
          <div className="forgot-link">
            <Link to="/forgot-pass">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
