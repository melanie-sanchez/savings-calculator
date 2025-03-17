import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useCalculations } from './CalculationContext';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define types for our form data
interface FormData {
  startingAmount: number;
  interestRate: number;
  contributionAmount: number;
  contributionFrequency: string;
}

// Define types for our calculation results
interface CalculationResults {
  sixMonths: number;
  oneYear: number;
  twoYears: number;
}

const HysaCalculator: React.FC = () => {
  const { addCalculation } = useCalculations(); // Add this line

  const [formData, setFormData] = useState<FormData>({
    startingAmount: 0,
    interestRate: 0,
    contributionAmount: 0,
    contributionFrequency: 'monthly',
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const frequencies = {
    weekly: 52,
    biweekly: 26,
    monthly: 12,
    quarterly: 4,
    annually: 1,
  };

  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'contributionFrequency' ? value : parseFloat(value) || 0,
    }));
  };

  const calculateBalance = (
    principal: number,
    annualRate: number,
    contributionAmount: number,
    contributionsPerYear: number,
    years: number
  ): number => {
    // Convert annual rate to decimal
    const r = annualRate / 100;

    // Calculate rate per period
    const ratePerPeriod = r / contributionsPerYear;

    // Calculate total number of periods
    const periods = contributionsPerYear * years;

    // Calculate final balance using compound interest formula with regular contributions
    // A = P(1 + r)^n + PMT * ((1 + r)^n - 1) / r
    const result =
      principal * Math.pow(1 + ratePerPeriod, periods) +
      (contributionAmount * (Math.pow(1 + ratePerPeriod, periods) - 1)) /
        ratePerPeriod;

    return parseFloat(result.toFixed(2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const {
      startingAmount,
      interestRate,
      contributionAmount,
      contributionFrequency,
    } = formData;
    const contributionsPerYear =
      frequencies[contributionFrequency as keyof typeof frequencies];

    const sixMonths = calculateBalance(
      startingAmount,
      interestRate,
      contributionAmount,
      contributionsPerYear,
      0.5
    );

    const oneYear = calculateBalance(
      startingAmount,
      interestRate,
      contributionAmount,
      contributionsPerYear,
      1
    );

    const twoYears = calculateBalance(
      startingAmount,
      interestRate,
      contributionAmount,
      contributionsPerYear,
      2
    );

    setResults({
      sixMonths,
      oneYear,
      twoYears,
    });

    setIsSubmitted(true);

    // Add this at the end of handleSubmit:
    addCalculation({
      calculatorType: 'hysa',
      inputs: { ...formData },
      results: { sixMonths, oneYear, twoYears },
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">High Yield Savings Account Calculator</h1>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Starting Amount ($)</Form.Label>
              <Form.Control
                type="number"
                name="startingAmount"
                value={formData.startingAmount} // Changed from formData.startingAmount || ''
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
              <Form.Text className="text-muted">
                Can be 0 if starting from scratch
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Annual Interest Rate (%)</Form.Label>
              <Form.Control
                type="number"
                name="interestRate"
                value={formData.interestRate || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contribution Amount ($)</Form.Label>
              <Form.Control
                type="number"
                name="contributionAmount"
                value={formData.contributionAmount || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contribution Frequency</Form.Label>
              <Form.Select
                name="contributionFrequency"
                value={formData.contributionFrequency}
                onChange={handleChange}
                required
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Calculate
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {isSubmitted && results && (
        <Card>
          <Card.Header as="h5">Results</Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-md-4 mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>6 Months</Card.Title>
                    <Card.Text className="h3 text-primary">
                      {formatCurrency(results.sixMonths)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4 mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>1 Year</Card.Title>
                    <Card.Text className="h3 text-primary">
                      {formatCurrency(results.oneYear)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4 mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>2 Years</Card.Title>
                    <Card.Text className="h3 text-primary">
                      {formatCurrency(results.twoYears)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default HysaCalculator;
