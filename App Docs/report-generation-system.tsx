import React, { useState, useEffect } from 'react';
import { Download, FileText, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import _ from 'lodash';
import ReportProgressTracker from './ReportProgressTracker';

const ReportGenerationSystem = () => {
  const [projectData, setProjectData] = useState({
    questionnaire: null,
    propertyInfo: null,
    components: [],
    photos: [],
    financials: null,
    recommendations: [],
    compliance: { verified: false }
  });

  const [reportFormat, setReportFormat] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const reportFormats = {
    word: {
      icon: FileText,
      label: 'SIRS Report (Word)',
      requiredSections: ['all']
    },
    excel: {
      icon: FileText,
      label: 'Financial Analysis (Excel)',
      requiredSections: ['financials', 'components']
    },
    photos: {
      icon: FileText,
      label: 'Photo Documentation',
      requiredSections: ['photos']
    }
  };

  const validateDataCompleteness = () => {
    // Validation logic matching SIRS report requirements
    const requiredFields = {
      propertyInfo: ['name', 'address', 'constructionDate', 'buildingCount'],
      components: ['name', 'category', 'quantity', 'usefulLife', 'remainingLife', 'replacementCost', 'condition'],
      financials: ['startingBalance', 'annualContribution', 'projectionYears']
    };

    let missingFields = [];

    for (const [section, fields] of Object.entries(requiredFields)) {
      if (!projectData[section]) {
        missingFields.push(`${section} section is missing`);
        continue;
      }

      if (Array.isArray(projectData[section])) {
        projectData[section].forEach((item, index) => {
          fields.forEach(field => {
            if (!item[field]) {
              missingFields.push(`${field} is missing in ${section} item ${index + 1}`);
            }
          });
        });
      } else {
        fields.forEach(field => {
          if (!projectData[section][field]) {
            missingFields.push(`${field} is missing in ${section}`);
          }
        });
      }
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields
    };
  };

  const generateReport = async () => {
    const validation = validateDataCompleteness();
    if (!validation.isComplete) {
      setError(`Cannot generate report. Missing required information: \n${validation.missingFields.join('\n')}`);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate Word SIRS Report
      if (reportFormat.includes('word')) {
        await generateSIRSReport(projectData);
      }

      // Generate Excel Financial Analysis
      if (reportFormat.includes('excel')) {
        await generateFinancialReport(projectData);
      }

      // Generate Photo Documentation
      if (reportFormat.includes('photos')) {
        await generatePhotoReport(projectData);
      }

      setIsGenerating(false);
    } catch (err) {
      setError(`Error generating report: ${err.message}`);
      setIsGenerating(false);
    }
  };

  const generateSIRSReport = async (data) => {
    // Word report generation logic following SIRS template
    const sections = [
      {
        title: 'Project Overview and Compliance',
        content: generateProjectOverview(data)
      },
      {
        title: 'Component Inventory',
        content: generateComponentInventory(data)
      },
      {
        title: 'Component Assessment',
        content: generateComponentAssessment(data)
      },
      {
        title: 'Financial Analysis',
        content: generateFinancialAnalysis(data)
      },
      {
        title: 'Future Guidelines',
        content: generateGuidelines(data)
      }
    ];

    // Report assembly and download logic here
  };

  const generateFinancialReport = async (data) => {
    const workbook = XLSX.utils.book_new();
    
    // Component Inventory Sheet
    const componentSheet = XLSX.utils.json_to_sheet(data.components);
    XLSX.utils.book_append_sheet(workbook, componentSheet, 'Components');
    
    // Financial Analysis Sheet
    const financialSheet = XLSX.utils.json_to_sheet(data.financials.yearlyData);
    XLSX.utils.book_append_sheet(workbook, financialSheet, 'Financial Analysis');
    
    // Funding Projections Sheet
    const projectionSheet = generateFundingProjections(data);
    XLSX.utils.book_append_sheet(workbook, projectionSheet, 'Funding Projections');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    downloadFile(buffer, 'financial_analysis.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };

  const generatePhotoReport = async (data) => {
    // Photo documentation compilation logic
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <ReportProgressTracker projectData={projectData} />

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Report Generation</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(reportFormats).map(([key, format]) => (
            <div
              key={key}
              onClick={() => setReportFormat(prev => 
                prev.includes(key) 
                  ? prev.filter(f => f !== key)
                  : [...prev, key]
              )}
              className={`p-4 rounded-lg border cursor-pointer ${
                reportFormat.includes(key) 
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <format.icon className="w-5 h-5" />
                <span className="font-medium">{format.label}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={generateReport}
          disabled={isGenerating || reportFormat.length === 0}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Generate Reports'}
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error Generating Reports</h3>
              <p className="text-red-600 mt-1 whitespace-pre-line">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGenerationSystem;