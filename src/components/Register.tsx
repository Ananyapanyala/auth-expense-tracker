import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    console.log('Sending registration data:', { username, email, password });
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
  
      console.log('Server response:', response);
  
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        setSuccessMessage(data.message || 'User registered successfully');
        setErrorMessage(null);
      } else {
        const error = await response.json();
        console.error('Registration failed:', error);
        setErrorMessage(error.message || 'Registration failed');
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setErrorMessage('An unexpected error occurred');
    }
  };
  

  return (
    <Container>
      <Row>
        <Col md={6} className="offset-md-3">
          <h2>Register</h2>
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <Button variant="primary" onClick={handleRegister}>
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
