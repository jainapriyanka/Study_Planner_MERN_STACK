// import React, { useState } from 'react';
// import { Form, Button, Container, Row, Col,Alert  } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import api from '../../services/Api';  // Axios instance

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await api.post('/auth/login', { email, password });
//       console.log("Response",response)
//       localStorage.setItem('authtoken', response.data.userData.authtoken);
//       localStorage.setItem('userName',response.data.userData.name)
//       setSuccess('Login successful! Redirecting to dashboard...');
//       setError('');
//       setTimeout(() => navigate('/dashboard'), 2000);  // Redirect after 2 seconds
//     } catch (error) {
//       setError('Invalid credentials');
//       setSuccess('');
//     }
//   };

//   return (
//     <Container className="my-5">
//       <Row>
//         <Col md={6} className="mx-auto">
//           <h2>Login</h2>
//           {error && <div className="alert alert-danger">{error}</div>}
//            {success && <Alert variant="success">{success}</Alert>}
//           <Form onSubmit={handleSubmit}>
//             <Form.Group controlId="formEmail">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group controlId="formPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Button type="submit" style={{ background: "#ff6b6b", border: "none", marginTop: "10px" }}>
//               Login
//             </Button>
//           </Form>
//           <Link to="/forgot-pass">Forgot Password</Link>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/Api';  // Axios instance

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log("Response", response);
      localStorage.setItem('token', response.data.userData.token);
      localStorage.setItem('userName', response.data.userData.name);
      setSuccess('Login successful! Redirecting to dashboard...');
      setError('');
      setTimeout(() => navigate('/dashboard'), 2000);  // Redirect after 2 seconds
    } catch (error) {
      setError('Invalid credentials');
      setSuccess('');
    }
  };

  return (
    <Row justify="center" className="my-5">
      <Col md={8}>
        <h2>Login</h2>
        {error && <Alert message={error} type="error" />}
        {success && <Alert message={success} type="success" />}
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          style={{ maxWidth: '100%' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Invalid email format!' }]}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ background: "#ff6b6b", borderColor: "#ff6b6b" }}
            >
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Link to="/forgot-pass" style={{ display: 'block', textAlign: 'center' }}>
              Forgot Password?
            </Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
