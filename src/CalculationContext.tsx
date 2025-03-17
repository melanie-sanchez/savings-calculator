import React, { createContext, useState, useContext, useEffect } from 'react';

export interface Calculation {
  id: string;
  calculatorType: 'hysa' | 'savings-goal' | 'multi-goal';
  inputs: Record<string, any>;
  results: Record<string, any>;
  timestamp: number;
}

interface CalculationContextType {
  recentCalculations: Calculation[];
  addCalculation: (calculation: Omit<Calculation, 'id' | 'timestamp'>) => void;
  clearCalculations: () => void;
}

const CalculationContext = createContext<CalculationContextType | undefined>(
  undefined
);

export const CalculationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recentCalculations, setRecentCalculations] = useState<Calculation[]>(
    []
  );

  // Load saved calculations from localStorage on initial render
  useEffect(() => {
    const savedCalculations = localStorage.getItem('recentCalculations');
    if (savedCalculations) {
      setRecentCalculations(JSON.parse(savedCalculations));
    }
  }, []);

  // Save calculations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'recentCalculations',
      JSON.stringify(recentCalculations)
    );
  }, [recentCalculations]);

  const addCalculation = (
    calculation: Omit<Calculation, 'id' | 'timestamp'>
  ) => {
    const newCalculation: Calculation = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setRecentCalculations((prev) => {
      // Keep only the 10 most recent calculations
      const updated = [newCalculation, ...prev].slice(0, 10);
      return updated;
    });
  };

  const clearCalculations = () => {
    setRecentCalculations([]);
  };

  return (
    <CalculationContext.Provider
      value={{ recentCalculations, addCalculation, clearCalculations }}
    >
      {children}
    </CalculationContext.Provider>
  );
};

export const useCalculations = () => {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error(
      'useCalculations must be used within a CalculationProvider'
    );
  }
  return context;
};
