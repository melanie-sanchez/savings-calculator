// import React, { useState } from 'react';
// import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Define types for a single goal
// interface Goal {
//   id: number;
//   type: string;
//   targetAmount: number;
//   initialDeposit: number;
//   interestRate: number;
//   timeframe: number; // in months
// }

// // Define types for goal results
// interface GoalResult {
//   id: number;
//   type: string;
//   monthlyContribution: number;
//   totalSavings: number;
// }

// const MultiGoalCalculator: React.FC = () => {
//   const [goals, setGoals] = useState<Goal[]>([
//     {
//       id: 1,
//       type: 'emergency',
//       targetAmount: 10000,
//       initialDeposit: 0,
//       interestRate: 0,
//       timeframe: 12, // Default to 12 months (1 year)
//     },
//   ]);

//   const [results, setResults] = useState<GoalResult[]>([]);
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

//   const goalTypes = [
//     { value: 'emergency', label: 'Emergency Fund' },
//     { value: 'car', label: 'Car' },
//     { value: 'home', label: 'Home/Down Payment' },
//     { value: 'travel', label: 'Travel' },
//     { value: 'education', label: 'Education' },
//     { value: 'wedding', label: 'Wedding' },
//     { value: 'retirement', label: 'Retirement' },
//     { value: 'other', label: 'Other' },
//   ];

//   // Handler for adding a new goal
//   const handleAddGoal = () => {
//     const newGoal: Goal = {
//       id: goals.length > 0 ? Math.max(...goals.map((g) => g.id)) + 1 : 1,
//       type: 'emergency',
//       targetAmount: 10000,
//       initialDeposit: 0,
//       interestRate: 0,
//       timeframe: 12,
//     };

//     setGoals([...goals, newGoal]);
//   };

//   // Handler for removing a goal
//   const handleRemoveGoal = (id: number) => {
//     if (goals.length === 1) {
//       alert('You must have at least one goal.');
//       return;
//     }

//     setGoals(goals.filter((goal) => goal.id !== id));
//   };

//   // Handler for input changes
//   const handleChange = (
//     id: number,
//     field: keyof Goal,
//     value: string | number
//   ) => {
//     setGoals(
//       goals.map((goal) => {
//         if (goal.id === id) {
//           return {
//             ...goal,
//             [field]:
//               field === 'type' ? value : parseFloat(value as string) || 0,
//           };
//         }
//         return goal;
//       })
//     );
//   };

//   // Calculate the monthly contribution needed to reach a goal
//   const calculateMonthlyContribution = (goal: Goal): number => {
//     const P = goal.initialDeposit; // Initial deposit
//     const FV = goal.targetAmount; // Target amount
//     const r = goal.interestRate / 100 / 12; // Monthly interest rate
//     const t = goal.timeframe; // Time in months

//     // If interest rate is 0, simple calculation
//     if (r === 0) {
//       return (FV - P) / t;
//     }

//     // For compound interest with regular contributions, the formula is:
//     // FV = P * (1 + r)^t + PMT * ((1 + r)^t - 1) / r
//     // We need to solve for PMT (monthly contribution)
//     // PMT = (FV - P * (1 + r)^t) * r / ((1 + r)^t - 1)

//     const numerator = FV - P * Math.pow(1 + r, t);
//     const denominator = (Math.pow(1 + r, t) - 1) / r;

//     return numerator / denominator;
//   };

//   // Handler for form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newResults = goals.map((goal) => {
//       const monthlyContribution = calculateMonthlyContribution(goal);
//       return {
//         id: goal.id,
//         type: goal.type,
//         monthlyContribution: parseFloat(monthlyContribution.toFixed(2)),
//         totalSavings: goal.targetAmount,
//       };
//     });

//     setResults(newResults);
//     setIsSubmitted(true);
//   };

//   // Format currency helper
//   const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount);
//   };

//   return (
//     <Container className="py-5">
//       <h1 className="mb-4">Multi-Goal Savings Calculator</h1>

//       <Card className="mb-4">
//         <Card.Body>
//           <Form onSubmit={handleSubmit}>
//             {goals.map((goal, index) => (
//               <div key={goal.id} className="border-bottom pb-4 mb-4">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h4>Goal #{index + 1}</h4>
//                   {goals.length > 1 && (
//                     <Button
//                       variant="outline-danger"
//                       size="sm"
//                       onClick={() => handleRemoveGoal(goal.id)}
//                     >
//                       Remove
//                     </Button>
//                   )}
//                 </div>

//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Goal Type</Form.Label>
//                       <Form.Select
//                         value={goal.type}
//                         onChange={(e) =>
//                           handleChange(goal.id, 'type', e.target.value)
//                         }
//                         required
//                       >
//                         {goalTypes.map((type) => (
//                           <option key={type.value} value={type.value}>
//                             {type.label}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Target Amount ($)</Form.Label>
//                       <Form.Control
//                         type="number"
//                         value={goal.targetAmount || ''}
//                         onChange={(e) =>
//                           handleChange(goal.id, 'targetAmount', e.target.value)
//                         }
//                         min="0"
//                         step="0.01"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row>
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Initial Deposit ($)</Form.Label>
//                       <Form.Control
//                         type="number"
//                         // Fix: Use goal.initialDeposit directly without || ''
//                         // This ensures 0 displays properly and isn't converted to empty string
//                         value={goal.initialDeposit}
//                         onChange={(e) =>
//                           handleChange(
//                             goal.id,
//                             'initialDeposit',
//                             e.target.value
//                           )
//                         }
//                         min="0"
//                         step="0.01"
//                         required
//                       />
//                       <Form.Text className="text-muted">
//                         Can be 0 if starting from scratch
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Interest Rate (%)</Form.Label>
//                       <Form.Control
//                         type="number"
//                         value={goal.interestRate || ''}
//                         onChange={(e) =>
//                           handleChange(goal.id, 'interestRate', e.target.value)
//                         }
//                         min="0"
//                         step="0.01"
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={4}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Time to Reach Goal (Months)</Form.Label>
//                       <Form.Control
//                         type="number"
//                         value={goal.timeframe || ''}
//                         onChange={(e) =>
//                           handleChange(goal.id, 'timeframe', e.target.value)
//                         }
//                         min="1"
//                         max="60"
//                         required
//                       />
//                       <Form.Text className="text-muted">
//                         1-60 months (up to 5 years)
//                       </Form.Text>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </div>
//             ))}

//             <div className="d-flex gap-2 mb-4">
//               <Button
//                 variant="outline-primary"
//                 type="button"
//                 onClick={handleAddGoal}
//                 className="d-flex align-items-center"
//               >
//                 <span className="me-1">+</span> Add Another Goal
//               </Button>
//               <Button variant="primary" type="submit">
//                 Calculate
//               </Button>
//             </div>
//           </Form>
//         </Card.Body>
//       </Card>

//       {isSubmitted && results.length > 0 && (
//         <Card>
//           <Card.Header as="h5">Results</Card.Header>
//           <Card.Body>
//             {results.map((result) => {
//               const goalType =
//                 goalTypes.find((t) => t.value === result.type)?.label ||
//                 result.type;

//               return (
//                 <Card key={result.id} className="mb-3">
//                   <Card.Body>
//                     <Row>
//                       <Col md={6}>
//                         <h5>{goalType} Goal</h5>
//                         <p className="mb-0">
//                           Target Amount: {formatCurrency(result.totalSavings)}
//                         </p>
//                       </Col>
//                       <Col md={6} className="text-center">
//                         <div className="h4 text-primary">
//                           {formatCurrency(result.monthlyContribution)}
//                         </div>
//                         <div className="text-muted">
//                           Monthly Contribution Needed
//                         </div>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               );
//             })}
//           </Card.Body>
//         </Card>
//       )}
//     </Container>
//   );
// };

// export default MultiGoalCalculator;

import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useCalculations } from './CalculationContext';

// Define types for a single goal
interface Goal {
  id: number;
  type: string;
  targetAmount: number;
  initialDeposit: number;
  interestRate: number;
  timeframe: number; // in months
}

// Define types for goal results
interface GoalResult {
  id: number;
  type: string;
  monthlyContribution: number;
  totalSavings: number;
}

const MultiGoalCalculator: React.FC = () => {
  const { addCalculation } = useCalculations();

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      type: 'emergency',
      targetAmount: 10000,
      initialDeposit: 0,
      interestRate: 0,
      timeframe: 12, // Default to 12 months (1 year)
    },
  ]);

  const [results, setResults] = useState<GoalResult[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const goalTypes = [
    { value: 'emergency', label: 'Emergency Fund' },
    { value: 'car', label: 'Car' },
    { value: 'home', label: 'Home/Down Payment' },
    { value: 'travel', label: 'Travel' },
    { value: 'education', label: 'Education' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'other', label: 'Other' },
  ];

  // Handler for adding a new goal
  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: goals.length > 0 ? Math.max(...goals.map((g) => g.id)) + 1 : 1,
      type: 'emergency',
      targetAmount: 10000,
      initialDeposit: 0,
      interestRate: 0,
      timeframe: 12,
    };

    setGoals([...goals, newGoal]);
  };

  // Handler for removing a goal
  const handleRemoveGoal = (id: number) => {
    if (goals.length === 1) {
      alert('You must have at least one goal.');
      return;
    }

    setGoals(goals.filter((goal) => goal.id !== id));
  };

  // Handler for input changes
  const handleChange = (
    id: number,
    field: keyof Goal,
    value: string | number
  ) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          return {
            ...goal,
            [field]:
              field === 'type' ? value : parseFloat(value as string) || 0,
          };
        }
        return goal;
      })
    );
  };

  // Calculate the monthly contribution needed to reach a goal
  const calculateMonthlyContribution = (goal: Goal): number => {
    const P = goal.initialDeposit; // Initial deposit
    const FV = goal.targetAmount; // Target amount
    const r = goal.interestRate / 100 / 12; // Monthly interest rate
    const t = goal.timeframe; // Time in months

    // If interest rate is 0, simple calculation
    if (r === 0) {
      return (FV - P) / t;
    }

    // For compound interest with regular contributions, the formula is:
    // FV = P * (1 + r)^t + PMT * ((1 + r)^t - 1) / r
    // We need to solve for PMT (monthly contribution)
    // PMT = (FV - P * (1 + r)^t) * r / ((1 + r)^t - 1)

    const numerator = FV - P * Math.pow(1 + r, t);
    const denominator = (Math.pow(1 + r, t) - 1) / r;

    return numerator / denominator;
  };

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newResults = goals.map((goal) => {
      const monthlyContribution = calculateMonthlyContribution(goal);
      return {
        id: goal.id,
        type: goal.type,
        monthlyContribution: parseFloat(monthlyContribution.toFixed(2)),
        totalSavings: goal.targetAmount,
      };
    });

    setResults(newResults);
    setIsSubmitted(true);

    // Add this calculation to recent calculations
    addCalculation({
      calculatorType: 'multi-goal',
      inputs: { goals },
      results: newResults,
    });
  };

  // Format currency helper
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Multi-Goal Savings Calculator</h1>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {goals.map((goal, index) => (
              <div key={goal.id} className="border-bottom pb-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4>Goal #{index + 1}</h4>
                  {goals.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveGoal(goal.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Goal Type</Form.Label>
                      <Form.Select
                        value={goal.type}
                        onChange={(e) =>
                          handleChange(goal.id, 'type', e.target.value)
                        }
                        required
                      >
                        {goalTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Target Amount ($)</Form.Label>
                      <Form.Control
                        type="number"
                        value={goal.targetAmount || ''}
                        onChange={(e) =>
                          handleChange(goal.id, 'targetAmount', e.target.value)
                        }
                        min="0"
                        step="0.01"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Initial Deposit ($)</Form.Label>
                      <Form.Control
                        type="number"
                        // Fix: Use goal.initialDeposit directly without || ''
                        // This ensures 0 displays properly and isn't converted to empty string
                        value={goal.initialDeposit}
                        onChange={(e) =>
                          handleChange(
                            goal.id,
                            'initialDeposit',
                            e.target.value
                          )
                        }
                        min="0"
                        step="0.01"
                        required
                      />
                      <Form.Text className="text-muted">
                        Can be 0 if starting from scratch
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Interest Rate (%)</Form.Label>
                      <Form.Control
                        type="number"
                        value={goal.interestRate || ''}
                        onChange={(e) =>
                          handleChange(goal.id, 'interestRate', e.target.value)
                        }
                        min="0"
                        step="0.01"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Time to Reach Goal (Months)</Form.Label>
                      <Form.Control
                        type="number"
                        value={goal.timeframe || ''}
                        onChange={(e) =>
                          handleChange(goal.id, 'timeframe', e.target.value)
                        }
                        min="1"
                        max="60"
                        required
                      />
                      <Form.Text className="text-muted">
                        1-60 months (up to 5 years)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}

            <div className="d-flex gap-2 mb-4">
              <Button
                variant="outline-primary"
                type="button"
                onClick={handleAddGoal}
                className="d-flex align-items-center"
              >
                <span className="me-1">+</span> Add Another Goal
              </Button>
              <Button variant="primary" type="submit">
                Calculate
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {isSubmitted && results.length > 0 && (
        <Card>
          <Card.Header as="h5">Results</Card.Header>
          <Card.Body>
            {results.map((result) => {
              const goalType =
                goalTypes.find((t) => t.value === result.type)?.label ||
                result.type;

              return (
                <Card key={result.id} className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h5>{goalType} Goal</h5>
                        <p className="mb-0">
                          Target Amount: {formatCurrency(result.totalSavings)}
                        </p>
                      </Col>
                      <Col md={6} className="text-center">
                        <div className="h4 text-primary">
                          {formatCurrency(result.monthlyContribution)}
                        </div>
                        <div className="text-muted">
                          Monthly Contribution Needed
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              );
            })}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MultiGoalCalculator;
