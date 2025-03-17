// import React, { useState } from 'react';
// import { Container, Form, Button, Card } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Define types for our form data
// interface FormData {
//   targetAmount: number;
//   depositAmount: number;
//   interestRate: number;
//   depositFrequency: string;
// }

// // Define types for our calculation results
// interface CalculationResults {
//   totalPeriods: number;
//   years: number;
//   months: number;
//   days: number;
//   targetDate: string;
// }

// const SavingsGoalCalculator: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     targetAmount: 0,
//     depositAmount: 0,
//     interestRate: 0,
//     depositFrequency: 'monthly',
//   });

//   const [results, setResults] = useState<CalculationResults | null>(null);
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

//   const frequencies = {
//     weekly: {
//       periodsPerYear: 52,
//       daysPerPeriod: 7,
//     },
//     biweekly: {
//       periodsPerYear: 26,
//       daysPerPeriod: 14,
//     },
//     monthly: {
//       periodsPerYear: 12,
//       daysPerPeriod: 30.44, // average days in a month
//     },
//     quarterly: {
//       periodsPerYear: 4,
//       daysPerPeriod: 91.31, // average days in a quarter
//     },
//     annually: {
//       periodsPerYear: 1,
//       daysPerPeriod: 365.25, // average days in a year accounting for leap years
//     },
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'depositFrequency' ? value : parseFloat(value) || 0,
//     }));
//   };

//   const calculateTimeToGoal = (): CalculationResults => {
//     const { targetAmount, depositAmount, interestRate, depositFrequency } =
//       formData;

//     // Get frequency data
//     const frequency = frequencies[depositFrequency as keyof typeof frequencies];

//     // Convert annual interest rate to per period
//     const ratePerPeriod = interestRate / 100 / frequency.periodsPerYear;

//     // Calculate number of periods required to reach goal
//     // Formula: n = log(FV/PMT * r + 1) / log(1 + r) when r > 0
//     // or n = FV/PMT when r = 0

//     let periodsToGoal: number;

//     if (interestRate === 0) {
//       // Simple division if no interest
//       periodsToGoal = targetAmount / depositAmount;
//     } else {
//       periodsToGoal =
//         Math.log((targetAmount / depositAmount) * ratePerPeriod + 1) /
//         Math.log(1 + ratePerPeriod);
//     }

//     // Calculate total time in years, months, days
//     const totalDays = periodsToGoal * frequency.daysPerPeriod;
//     const years = Math.floor(totalDays / 365.25);
//     const months = Math.floor((totalDays % 365.25) / 30.44);
//     const days = Math.floor((totalDays % 365.25) % 30.44);

//     // Calculate target date
//     const today = new Date();
//     const targetDate = new Date(today);
//     targetDate.setDate(today.getDate() + Math.ceil(totalDays));

//     return {
//       totalPeriods: Math.ceil(periodsToGoal),
//       years,
//       months,
//       days,
//       targetDate: targetDate.toLocaleDateString(),
//     };
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (formData.depositAmount <= 0 || formData.targetAmount <= 0) {
//       alert('Please enter valid amounts greater than zero.');
//       return;
//     }

//     const results = calculateTimeToGoal();
//     setResults(results);
//     setIsSubmitted(true);
//   };

//   const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount);
//   };

//   return (
//     <Container className="py-5">
//       <h1 className="mb-4">Savings Goal Calculator</h1>

//       <Card className="mb-4">
//         <Card.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Target Savings Goal ($)</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="targetAmount"
//                 value={formData.targetAmount || ''}
//                 onChange={handleChange}
//                 min="0"
//                 step="0.01"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Regular Deposit Amount ($)</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="depositAmount"
//                 value={formData.depositAmount || ''}
//                 onChange={handleChange}
//                 min="0"
//                 step="0.01"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Annual Interest Rate (%)</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="interestRate"
//                 value={formData.interestRate || ''}
//                 onChange={handleChange}
//                 min="0"
//                 step="0.01"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Deposit Frequency</Form.Label>
//               <Form.Select
//                 name="depositFrequency"
//                 value={formData.depositFrequency}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="weekly">Weekly</option>
//                 <option value="biweekly">Bi-weekly</option>
//                 <option value="monthly">Monthly</option>
//                 <option value="quarterly">Quarterly</option>
//                 <option value="annually">Annually</option>
//               </Form.Select>
//             </Form.Group>

//             <Button variant="primary" type="submit">
//               Calculate
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>

//       {isSubmitted && results && (
//         <Card>
//           <Card.Header as="h5">Results</Card.Header>
//           <Card.Body>
//             <p className="lead">
//               To save {formatCurrency(formData.targetAmount)} with{' '}
//               {formatCurrency(formData.depositAmount)}{' '}
//               {formData.depositFrequency} deposits at {formData.interestRate}%
//               APY:
//             </p>

//             <div className="row mt-4">
//               <div className="col-md-6 mb-3">
//                 <Card>
//                   <Card.Body className="text-center">
//                     <Card.Title>Time to Reach Goal</Card.Title>
//                     <Card.Text className="h3 text-primary">
//                       {results.years > 0 &&
//                         `${results.years} year${
//                           results.years !== 1 ? 's' : ''
//                         }`}
//                       {results.years > 0 && results.months > 0 && ', '}
//                       {results.months > 0 &&
//                         `${results.months} month${
//                           results.months !== 1 ? 's' : ''
//                         }`}
//                       {(results.years > 0 || results.months > 0) &&
//                         results.days > 0 &&
//                         ', '}
//                       {results.days > 0 &&
//                         `${results.days} day${results.days !== 1 ? 's' : ''}`}
//                     </Card.Text>
//                     <Card.Text>
//                       ({results.totalPeriods}{' '}
//                       {formData.depositFrequency.slice(0, -2)} deposits)
//                     </Card.Text>
//                   </Card.Body>
//                 </Card>
//               </div>
//               <div className="col-md-6 mb-3">
//                 <Card>
//                   <Card.Body className="text-center">
//                     <Card.Title>Estimated Completion Date</Card.Title>
//                     <Card.Text className="h3 text-primary">
//                       {results.targetDate}
//                     </Card.Text>
//                   </Card.Body>
//                 </Card>
//               </div>
//             </div>
//           </Card.Body>
//         </Card>
//       )}
//     </Container>
//   );
// };

// export default SavingsGoalCalculator;

import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useCalculations } from './CalculationContext';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define types for our form data
interface FormData {
  targetAmount: number;
  depositAmount: number;
  interestRate: number;
  depositFrequency: string;
}

// Define types for our calculation results
interface CalculationResults {
  totalPeriods: number;
  years: number;
  months: number;
  days: number;
  targetDate: string;
}

const SavingsGoalCalculator: React.FC = () => {
  const { addCalculation } = useCalculations();

  const [formData, setFormData] = useState<FormData>({
    targetAmount: 0,
    depositAmount: 0,
    interestRate: 0,
    depositFrequency: 'monthly',
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const frequencies = {
    weekly: {
      periodsPerYear: 52,
      daysPerPeriod: 7,
    },
    biweekly: {
      periodsPerYear: 26,
      daysPerPeriod: 14,
    },
    monthly: {
      periodsPerYear: 12,
      daysPerPeriod: 30.44, // average days in a month
    },
    quarterly: {
      periodsPerYear: 4,
      daysPerPeriod: 91.31, // average days in a quarter
    },
    annually: {
      periodsPerYear: 1,
      daysPerPeriod: 365.25, // average days in a year accounting for leap years
    },
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'depositFrequency' ? value : parseFloat(value) || 0,
    }));
  };

  const calculateTimeToGoal = (): CalculationResults => {
    const { targetAmount, depositAmount, interestRate, depositFrequency } =
      formData;

    // Get frequency data
    const frequency = frequencies[depositFrequency as keyof typeof frequencies];

    // Convert annual interest rate to per period
    const ratePerPeriod = interestRate / 100 / frequency.periodsPerYear;

    // Calculate number of periods required to reach goal
    // Formula: n = log(FV/PMT * r + 1) / log(1 + r) when r > 0
    // or n = FV/PMT when r = 0

    let periodsToGoal: number;

    if (interestRate === 0) {
      // Simple division if no interest
      periodsToGoal = targetAmount / depositAmount;
    } else {
      periodsToGoal =
        Math.log((targetAmount / depositAmount) * ratePerPeriod + 1) /
        Math.log(1 + ratePerPeriod);
    }

    // Calculate total time in years, months, days
    const totalDays = periodsToGoal * frequency.daysPerPeriod;
    const years = Math.floor(totalDays / 365.25);
    const months = Math.floor((totalDays % 365.25) / 30.44);
    const days = Math.floor((totalDays % 365.25) % 30.44);

    // Calculate target date
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + Math.ceil(totalDays));

    return {
      totalPeriods: Math.ceil(periodsToGoal),
      years,
      months,
      days,
      targetDate: targetDate.toLocaleDateString(),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.depositAmount <= 0 || formData.targetAmount <= 0) {
      alert('Please enter valid amounts greater than zero.');
      return;
    }

    const results = calculateTimeToGoal();
    setResults(results);
    setIsSubmitted(true);

    // Add this calculation to recent calculations
    addCalculation({
      calculatorType: 'savings-goal',
      inputs: { ...formData },
      results: results,
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
      <h1 className="mb-4">Savings Goal Calculator</h1>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Target Savings Goal ($)</Form.Label>
              <Form.Control
                type="number"
                name="targetAmount"
                value={formData.targetAmount || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Regular Deposit Amount ($)</Form.Label>
              <Form.Control
                type="number"
                name="depositAmount"
                value={formData.depositAmount || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
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
              <Form.Label>Deposit Frequency</Form.Label>
              <Form.Select
                name="depositFrequency"
                value={formData.depositFrequency}
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
            <p className="lead">
              To save {formatCurrency(formData.targetAmount)} with{' '}
              {formatCurrency(formData.depositAmount)}{' '}
              {formData.depositFrequency} deposits at {formData.interestRate}%
              APY:
            </p>

            <div className="row mt-4">
              <div className="col-md-6 mb-3">
                <Card>
                  <Card.Body className="text-center">
                    <Card.Title>Time to Reach Goal</Card.Title>
                    <Card.Text className="h3 text-primary">
                      {results.years > 0 &&
                        `${results.years} year${
                          results.years !== 1 ? 's' : ''
                        }`}
                      {results.years > 0 && results.months > 0 && ', '}
                      {results.months > 0 &&
                        `${results.months} month${
                          results.months !== 1 ? 's' : ''
                        }`}
                      {(results.years > 0 || results.months > 0) &&
                        results.days > 0 &&
                        ', '}
                      {results.days > 0 &&
                        `${results.days} day${results.days !== 1 ? 's' : ''}`}
                    </Card.Text>
                    <Card.Text>
                      ({results.totalPeriods}{' '}
                      {formData.depositFrequency.slice(0, -2)} deposits)
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-6 mb-3">
                <Card>
                  <Card.Body className="text-center">
                    <Card.Title>Estimated Completion Date</Card.Title>
                    <Card.Text className="h3 text-primary">
                      {results.targetDate}
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

export default SavingsGoalCalculator;
