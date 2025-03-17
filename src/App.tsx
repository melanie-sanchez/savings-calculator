import React, { useState } from 'react';
import './App.css';
import HysaCalculator from './HysaCalculator';
import SavingsGoalCalculator from './SavingsGoalCalculator';
import MultiGoalCalculator from './MultiGoalCalculator';
import RecentCalculations from './RecentCalculations';
import { Container, Nav, Navbar, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CalculationProvider } from './CalculationContext';

function App() {
  const [activeTab, setActiveTab] = useState<
    'hysa' | 'savings-goal' | 'multi-goal'
  >('hysa');

  return (
    <CalculationProvider>
      <div className="App">
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#home">Savings Calculator</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link
                  href="#hysa"
                  active={activeTab === 'hysa'}
                  onClick={() => setActiveTab('hysa')}
                >
                  HYSA Calculator
                </Nav.Link>
                <Nav.Link
                  href="#savings-goal"
                  active={activeTab === 'savings-goal'}
                  onClick={() => setActiveTab('savings-goal')}
                >
                  Savings Goal Calculator
                </Nav.Link>
                <Nav.Link
                  href="#multi-goal"
                  active={activeTab === 'multi-goal'}
                  onClick={() => setActiveTab('multi-goal')}
                >
                  Multi-Goal Calculator
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Row>
            <Col lg={8}>
              {activeTab === 'hysa' && <HysaCalculator />}
              {activeTab === 'savings-goal' && <SavingsGoalCalculator />}
              {activeTab === 'multi-goal' && <MultiGoalCalculator />}
            </Col>
            <Col lg={4}>
              <RecentCalculations />
            </Col>
          </Row>
        </Container>
      </div>
    </CalculationProvider>
  );
}

export default App;
