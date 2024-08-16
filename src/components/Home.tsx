import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Home: React.FC = () => {
  return (
    <Container className="home-container text-center mt-5">
      <Row>
        <Col>
          <h2 className="display-4">Welcome to the Expense Tracker</h2>
          <p className="lead">Track your expenses here.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
