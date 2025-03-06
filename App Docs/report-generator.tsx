import React, { useState } from 'react';
import { FileText, Video, Image, Presentation, Download } from 'lucide-react';

const ReportGenerator = ({ 
  projectData = {},
  componentData = [], 
  financialData = {},
  mediaFiles = []
}) => {
  const [reportFormat, setReportFormat] = useState('full');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const reportTypes = {
    full: {
      icon: FileText,
      title: 'Full Report',
      description: 'Complete report with all sections and multimedia elements'
    },
    presentation: {
      icon: Presentation,
      title: 'PowerPoint Presentation',
      description: 'Slide deck with key findings and visual elements'
    },
    summary: {
      icon: FileText,
      title: 'Executive Summary',
      description: 'Condensed overview of key findings'
    },
    video: {
      icon: Video,
      title: 'Video Presentation',
      description: 'Narrated presentation of the report findings'
    }
  };

  const handleGenerateReport = async (type) => {
    setIsGenerating(true);
    try {
      // Here we would integrate with backend services for actual report generation
      console.log(`Generating ${type} report...`);
    } catch (error) {
      console.error('Report generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Report Generator</h2>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(reportTypes).map(([type, info]) => (
          <div
            key={type}
            className={`p-4 rounded-lg border cursor-pointer hover:border-blue-500 hover:bg-blue-50
              ${reportFormat === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            onClick={() => setReportFormat(type)}
          >
            <div className="flex items-center gap-2 mb-2">
              <info.icon className="w-5 h-5" />
              <h3 className="font-semibold">{info.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{info.description}</p>
          </div>
        ))}
      </div>

      {/* Report Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Report Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Media Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include Media
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="ml-2">Site Photos</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="ml-2">Location Maps</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="ml-2">Component Photos</span>
              </label>
            </div>
          </div>

          {/* Voice Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Narration Voice
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="en-US-JennyNeural">Jenny (US English)</option>
              <option value="en-US-AriaNeural">Aria (US English)</option>
              <option value="en-GB-SoniaNeural">Sonia (British English)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Report Preview</h3>
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-2">Report Contents:</h4>
          <ul className="space-y-1 text-sm">
            <li>• Project Overview and Property Information</li>
            <li>• Component Inventory Analysis</li>
            <li>• Financial Projections and Funding Recommendations</li>
            <li>• Site Documentation and Photos</li>
            <li>• Maintenance Schedule and Guidelines</li>
            {reportFormat === 'video' && (
              <li>• Narrated Video Presentation</li>
            )}
          </ul>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          onClick={() => handleGenerateReport(reportFormat)}
          disabled={isGenerating}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
};

export default ReportGenerator;