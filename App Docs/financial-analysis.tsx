import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator } from 'lucide-react';

const defaultFundingGoals = {
  baseline: { name: 'Baseline', description: 'Minimum funding to keep reserve balance above zero' },
  threshold: { name: 'Threshold', description: 'Maintain 50% of fully funded balance' },
  fullyFunded: { name: 'Fully Funded', description: 'Maintain 100% of fully funded balance' }
};

const FinancialAnalysis = ({ 
  components = [], 
  startingBalance = 0,
  annualContribution = 0,
  projectionYears = 30,
  onUpdateFinancials = () => {} 
}) => {
  const [financialData, setFinancialData] = useState({
    startingBalance,
    annualContribution,
    selectedGoal: 'baseline',
    projectionYears
  });

  const [projections, setProjections] = useState({
    yearlyData: [],
    fundingGoals: {
      baseline: 0,
      threshold: 0,
      fullyFunded: 0
    }
  });

  useEffect(() => {
    calculateProjections();
  }, [components, financialData]);

  const calculateProjections = () => {
    // Initialize yearly expenditures
    const yearlyExpenditures = Array(projectionYears).fill(0);
    
    // Calculate when components will need replacement
    components.forEach(component => {
      const replacementYear = Math.floor(component.remainingLife);
      if (replacementYear < projectionYears) {
        yearlyExpenditures[replacementYear] += Number(component.replacementCost);
      }
    });

    // Calculate fully funded balance
    const fullyFundedBalance = components.reduce((sum, component) => {
      const effectiveAge = component.usefulLife - component.remainingLife;
      return sum + (component.replacementCost * (effectiveAge / component.usefulLife));
    }, 0);

    // Calculate different funding scenarios
    const baselineAnnual = calculateBaselineFunding(yearlyExpenditures);
    const thresholdAnnual = calculateThresholdFunding(yearlyExpenditures, fullyFundedBalance);
    const fullyFundedAnnual = calculateFullyFundedFunding(yearlyExpenditures, fullyFundedBalance);

    // Generate year-by-year projections
    const yearlyData = generateYearlyProjections(
      yearlyExpenditures,
      baselineAnnual,
      thresholdAnnual,
      fullyFundedAnnual
    );

    setProjections({
      yearlyData,
      fundingGoals: {
        baseline: baselineAnnual,
        threshold: thresholdAnnual,
        fullyFunded: fullyFundedAnnual
      }
    });
  };

  const calculateBaselineFunding = (expenditures) => {
    let minRequired = 0;
    let balance = financialData.startingBalance;
    
    expenditures.forEach(expense => {
      balance -= expense;
      if (balance < 0) {
        minRequired = Math.max(minRequired, -balance / projectionYears);
      }
    });

    return Math.ceil(minRequired);
  };

  const calculateThresholdFunding = (expenditures, fullyFundedBalance) => {
    const targetBalance = fullyFundedBalance * 0.5;
    return Math.ceil((targetBalance - financialData.startingBalance) / projectionYears);
  };

  const calculateFullyFundedFunding = (expenditures, fullyFundedBalance) => {
    return Math.ceil((fullyFundedBalance - financialData.startingBalance) / projectionYears);
  };

  const generateYearlyProjections = (expenditures, baseline, threshold, fullyFunded) => {
    const yearlyData = [];
    let baselineBalance = financialData.startingBalance;
    let thresholdBalance = financialData.startingBalance;
    let fullyFundedBalance = financialData.startingBalance;

    for (let year = 0; year < projectionYears; year++) {
      baselineBalance = baselineBalance + baseline - expenditures[year];
      thresholdBalance = thresholdBalance + threshold - expenditures[year];
      fullyFundedBalance = fullyFundedBalance + fullyFunded - expenditures[year];

      yearlyData.push({
        year: year + 1,
        expenditures: expenditures[year],
        baselineBalance,
        thresholdBalance,
        fullyFundedBalance
      });
    }

    return yearlyData;
  };

  const handleFundingGoalChange = (goal) => {
    setFinancialData(prev => ({
      ...prev,
      selectedGoal: goal,
      annualContribution: projections.fundingGoals[goal]
    }));
    onUpdateFinancials({
      ...financialData,
      selectedGoal: goal,
      annualContribution: projections.fundingGoals[goal]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Analysis</h2>
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          <span className="text-lg">30 Year Projection</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(defaultFundingGoals).map(([key, { name, description }]) => (
          <div 
            key={key}
            className={`p-4 rounded-lg border cursor-pointer ${
              financialData.selectedGoal === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => handleFundingGoalChange(key)}
          >
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="mt-2 text-lg">
              ${projections.fundingGoals[key]?.toLocaleString()} / year
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">30 Year Reserve Fund Projection</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projections.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'bottom' }} />
              <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'left' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="baselineBalance" 
                stroke="#4299e1" 
                name="Baseline"
              />
              <Line 
                type="monotone" 
                dataKey="thresholdBalance" 
                stroke="#48bb78" 
                name="Threshold"
              />
              <Line 
                type="monotone" 
                dataKey="fullyFundedBalance" 
                stroke="#ecc94b" 
                name="Fully Funded"
              />
              <Line 
                type="monotone" 
                dataKey="expenditures" 
                stroke="#f56565" 
                name="Expenditures"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Starting Balance</p>
            <p className="text-xl">${financialData.startingBalance.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Recommended Annual Contribution</p>
            <p className="text-xl">${financialData.annualContribution.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Selected Funding Strategy</p>
            <p className="text-xl">{defaultFundingGoals[financialData.selectedGoal].name}</p>
          </div>
          <div>
            <p className="text-gray-600">Projection Period</p>
            <p className="text-xl">{financialData.projectionYears} years</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;