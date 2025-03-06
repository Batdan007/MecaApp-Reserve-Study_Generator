import React, { useState } from 'react';
import { Download, FileText, Video, Presentation, File, Mic } from 'lucide-react';
import * as XLSX from 'xlsx';

const ReportController = ({
  projectData = {},
  componentData = [],
  financialData = {},
  mediaFiles = []
}) => {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [voicePreference, setVoicePreference] = useState('en-US-JennyNeural');

  const reportFormats = {
    excel: {
      icon: FileText,
      label: 'Excel Report',
      description: 'Financial analysis and component data'
    },
    word: {
      icon: File,
      label: 'Word Report',
      description: 'Detailed written report with analysis'
    },
    powerpoint: {
      icon: Presentation,
      label: 'PowerPoint',
      description: 'Visual presentation with key findings'
    },
    pdf: {
      icon: File,
      label: 'PDF Report',
      description: 'Complete report in PDF format'
    },
    video: {
      icon: Video,
      label: 'Video Presentation',
      description: 'Narrated overview with visuals'
    }
  };

  const voiceOptions = [
    { id: 'en-US-JennyNeural', name: 'Jenny (US)' },
    { id: 'en-US-AriaNeural', name: 'Aria (US)' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia (UK)' }
  ];

  const toggleFormat = (format) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const generateReport = async () => {
    try {
      setStatus('generating');
      setProgress(0);
      setError(null);

      for (const format of selectedFormats) {
        switch (format) {
          case 'excel':
            await generateExcelReport();
            break;
          case 'word':
            await generateWordReport();
            break;
          case 'powerpoint':
            await generatePowerPointReport();
            break;
          case 'pdf':
            await generatePDFReport();
            break;
          case 'video':
            await generateVideoPresentation();
            break;
        }
        updateProgress((selectedFormats.indexOf(format) + 1) * (100 / selectedFormats.length));
      }

      setStatus('complete');
      setProgress(100);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const generateExcelReport = async () => {
    const workbook = XLSX.utils.book_new();
    
    // Add sheets
    if (componentData.length > 0) {
      const componentSheet = XLSX.utils.json_to_sheet(componentData);
      XLSX.utils.book_append_sheet(workbook, componentSheet, 'Components');
    }

    if (financialData.yearlyData) {
      const financialSheet = XLSX.utils.json_to_sheet(financialData.yearlyData);
      XLSX.utils.book_append_sheet(workbook, financialSheet, 'Financial Analysis');
    }

    const summaryData = [{
      'Property Name': projectData.name,
      'Address': projectData.address,
      'Construction Date': projectData.constructionDate,
      'Building Count': projectData.buildingCount,
      'Total Components': componentData.length,
      'Starting Balance': financialData.startingBalance,
      'Annual Contribution': financialData.annualContribution
    }];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    downloadFile(buffer, 'reserve_study.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Report Generation</h2>
        <button
          onClick={generateReport}
          disabled={status === 'generating' || selectedFormats.length === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {status === 'generating' ? 'Generating...' : 'Generate Selected Reports'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Select Report Formats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(reportFormats).map(([key, format]) => (
            <div
              key={key}
              onClick={() => toggleFormat(key)}
              className={`p-4 rounded-lg border cursor-pointer ${
                selectedFormats.includes(key)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <format.icon className="w-5 h-5" />
                <span className="font-medium">{format.label}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{format.description}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedFormats.includes('video') && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Video Narration Options</h3>
          <div className="flex items-center gap-4">
            <Mic className="w-5 h-5 text-gray-500" />
            <select
              value={voicePreference}
              onChange={(e) => setVoicePreference(e.target.value)}
              className="border rounded-md p-2"
            >
              {voiceOptions.map(voice => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {status === 'generating' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Generating Reports...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Error Generating Reports</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportController;