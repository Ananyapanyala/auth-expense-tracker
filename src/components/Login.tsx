import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authcontext'; 
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token } = response.data;
      setToken(token);
      navigate('/expenses');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="text-center">Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
