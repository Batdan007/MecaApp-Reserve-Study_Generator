// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import ProjectInfo from './components/ProjectInfo';
import ComponentInventory from './components/ComponentInventory';
import FinancialAnalysis from './components/FinancialAnalysis';
import ReportGeneration from './components/ReportGeneration';

// Data Models
const initialProjectState = {
  propertyName: '',
  propertyAddress: '',
  constructionDate: '',
  buildingCount: 0,
  totalUnits: 0,
  buildingArea: 0,
  constructionType: '',
  lastInspectionDate: '',
};

const initialComponentState = {
  components: [],
  categories: [
    'Roof',
    'Structure',
    'Fireproofing',
    'Plumbing',
    'Electrical',
    'Waterproofing',
    'Windows and Doors',
    'Other'
  ]
};

const App = () => {
  const [projectData, setProjectData] = useState(initialProjectState);
  const [componentData, setComponentData] = useState(initialComponentState);
  const [financialData, setFinancialData] = useState({
    startingBalance: 0,
    annualContribution: 0,
    fundingGoal: 'baseline',
    projectionYears: 30
  });

  const handleFileUpload = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Handle Excel/CSV file parsing here
          const workbook = XLSX.read(e.target.result, {
            type: 'array',
            cellDates: true,
            cellStyles: true
          });
          
          // Process the data
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          
          // Update component inventory
          setComponentData(prevState => ({
            ...prevState,
            components: processComponentData(data)
          }));
        } catch (error) {
          console.error('Error processing file:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const processComponentData = (rawData) => {
    return rawData.map(row => ({
      id: generateUniqueId(),
      name: row.ComponentName,
      category: row.Category,
      quantity: row.Quantity,
      unit: row.Unit,
      usefulLife: row.UsefulLife,
      remainingLife: row.RemainingLife,
      replacementCost: row.ReplacementCost,
      lastReplacementDate: row.LastReplacementDate,
      nextReplacementDate: calculateNextReplacementDate(
        row.LastReplacementDate,
        row.RemainingLife
      )
    }));
  };

  const calculateNextReplacementDate = (lastDate, remainingLife) => {
    if (!lastDate || !remainingLife) return null;
    const date = new Date(lastDate);
    date.setFullYear(date.getFullYear() + parseInt(remainingLife));
    return date;
  };

  const generateReport = () => {
    // Compile all data
    const reportData = {
      project: projectData,
      components: componentData.components,
      financials: calculateFinancialProjections(
        financialData,
        componentData.components
      )
    };

    // Generate report using template
    return generateReportDocument(reportData);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          {/* Navigation Component */}
        </nav>
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProjectInfo 
                  data={projectData}
                  onUpdate={setProjectData}
                />
              } 
            />
            <Route 
              path="/components" 
              element={
                <ComponentInventory 
                  data={componentData}
                  onUpdate={setComponentData}
                  onFileUpload={handleFileUpload}
                />
              } 
            />
            <Route 
              path="/financial" 
              element={
                <FinancialAnalysis 
                  data={financialData}
                  components={componentData.components}
                  onUpdate={setFinancialData}
                />
              } 
            />
            <Route 
              path="/report" 
              element={
                <ReportGeneration 
                  projectData={projectData}
                  componentData={componentData}
                  financialData={financialData}
                  onGenerateReport={generateReport}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
