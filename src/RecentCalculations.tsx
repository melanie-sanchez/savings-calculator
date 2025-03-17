import React from 'react';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { useCalculations, Calculation } from './CalculationContext';

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

const getCalculatorName = (type: string): string => {
  switch (type) {
    case 'hysa':
      return 'HYSA Calculator';
    case 'savings-goal':
      return 'Savings Goal Calculator';
    case 'multi-goal':
      return 'Multi-Goal Calculator';
    default:
      return type;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const renderCalculationSummary = (calculation: Calculation) => {
  const { calculatorType, inputs, results } = calculation;

  switch (calculatorType) {
    case 'hysa':
      return (
        <>
          <p className="mb-0">
            <strong>Starting:</strong> {formatCurrency(inputs.startingAmount)}
          </p>
          <p className="mb-0">
            <strong>Rate:</strong> {inputs.interestRate}%
          </p>
          <p className="mb-0">
            <strong>1 Year:</strong> {formatCurrency(results.oneYear)}
          </p>
        </>
      );

    case 'savings-goal':
      return (
        <>
          <p className="mb-0">
            <strong>Target:</strong> {formatCurrency(inputs.targetAmount)}
          </p>
          <p className="mb-0">
            <strong>Time:</strong>{' '}
            {results.years > 0 ? `${results.years}y ` : ''}
            {results.months > 0 ? `${results.months}m ` : ''}
            {results.days > 0 ? `${results.days}d` : ''}
          </p>
        </>
      );
    case 'multi-goal':
      if (Array.isArray(results)) {
        return (
          <>
            <p className="mb-0">
              <strong>
                {results.length} goal{results.length !== 1 ? 's' : ''}
              </strong>
            </p>
            {results.map((goal, index) => (
              <div key={goal.id} className="mt-2">
                <p className="mb-0">
                  <strong>
                    Goal {index + 1} ({goal.type}):
                  </strong>
                </p>
                <p className="mb-0">
                  Target: {formatCurrency(goal.totalSavings)}
                </p>
                <p className="mb-0">
                  Monthly: {formatCurrency(goal.monthlyContribution)}
                </p>
              </div>
            ))}
          </>
        );
      } else {
        return <p>No goals available</p>;
      }

    default:
      return <p>Calculation details</p>;
  }
};

const RecentCalculations: React.FC = () => {
  const { recentCalculations, clearCalculations } = useCalculations();

  if (recentCalculations.length === 0) {
    return (
      <Card className="mb-4">
        <Card.Header>Recent Calculations</Card.Header>
        <Card.Body className="text-center py-4">
          <p className="text-muted mb-0">No recent calculations</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Recent Calculations</span>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={clearCalculations}
        >
          Clear All
        </Button>
      </Card.Header>
      <ListGroup variant="flush">
        {recentCalculations.map((calc) => (
          <ListGroup.Item key={calc.id} className="py-3">
            <div className="d-flex justify-content-between align-items-start">
              <div className="w-100">
                <h6 className="mb-2">
                  {getCalculatorName(calc.calculatorType)}{' '}
                  <Badge bg="secondary" className="ms-2">
                    {formatDate(calc.timestamp)}
                  </Badge>
                </h6>
                {renderCalculationSummary(calc)}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default RecentCalculations;
