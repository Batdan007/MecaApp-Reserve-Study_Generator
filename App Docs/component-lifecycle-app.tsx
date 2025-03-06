import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Papa from 'paraphrase';
import _ from 'lodash';

const ComponentLifecycleManager = () => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [financialData, setFinancialData] = useState({
    totalRequired: 0,
    monthlyContribution: 0,
    criticalComponents: []
  });

  useEffect(() => {
/*************  ✨ Codeium Command 🌟  *************/
    /**
     * Asynchronously loads component data from a PDF file,
     * parses it, and updates the component state and financials.
     */
    const loadComponentData = async () => {
      try {
        // Read the SIRS report PDF file
        const response = await window.fs.readFile('FL-69-705 - Golf View Manor II SIRS Report.pdf', { encoding: 'utf8' });

        // Parse the component data from the PDF response
        const parsed = parseComponentData(response);

        // Update state with parsed components
        setComponents(parsed);

        // Calculate and update financial data based on components
        calculateFinancials(parsed);
      } catch (error) {
        // Log any errors encountered during the file read or parsing process
        console.error('Error loading component data:', error);
      }
    };
/******  89749e1f-3359-4ed6-80ec-8db0ccd4fa90  *******/

    loadComponentData();
  }, []);

  const parseComponentData = (data) => {
    // Extract component data from SIRS report
    const componentData = [
      {
        name: 'Roof - Flat, TPO',
        installDate: '2006',
        lifespan: 25,
        replacementCost: 448800,
        nextReplacement: '2036',
        remainingLife: 11,
        status: 'fair'
      },
      // Add other components...
    ];
    return componentData;
  };

  const calculateFinancials = (components) => {
    const total = components.reduce((sum, comp) => sum + comp.replacementCost, 0);
    const critical = components.filter(comp => comp.remainingLife < 5);
    
    setFinancialData({
      totalRequired: total,
      monthlyContribution: total / (12 * 30), // 30-year planning period
      criticalComponents: critical
    });
  };

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Component Lifecycle Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold">Total Components</h3>
              <p className="text-2xl">{components.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold">Required Funding</h3>
              <p className="text-2xl">${financialData.totalRequired.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold">Critical Components</h3>
              <p className="text-2xl">{financialData.criticalComponents.length}</p>
            </div>
          </div>

          <div className="h-64 mb-6">
            <ResponsiveContainer>
              <LineChart data={components}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="remainingLife" stroke="#2196F3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {components.map((component, index) => (
              <div 
                key={index}
                className="border p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedComponent(component)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{component.name}</h3>
                    <p className="text-sm text-gray-600">
                      Installed: {component.installDate} | Lifespan: {component.lifespan} years
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${component.replacementCost.toLocaleString()}</p>
                    <p className={`text-sm ${
                      component.remainingLife < 5 ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {component.remainingLife} years remaining
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentLifecycleManager;