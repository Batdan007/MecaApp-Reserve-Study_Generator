import React, { useState } from 'react';
import _ from 'lodash';

// Component categories
const componentCategories = [
  'Roof',
  'Structure',
  'Fireproofing',
  'Plumbing',
  'Electrical',
  'Waterproofing',
  'Mechanical',
  'Exteriors'
];

// Units of measurement
const units = [
  { label: 'Square Feet', value: 'SF' },
  { label: 'Square', value: 'SQ' },
  { label: 'Each', value: 'EA' },
  { label: 'Linear Feet', value: 'LF' },
  { label: 'Lump Sum', value: 'LS' }
];

const ReserveStudyGenerator = () => {
  // State
  const [activeTab, setActiveTab] = useState('property');
  const [propertyData, setPropertyData] = useState({
    name: '',
    address: '',
    city: '',
    state: 'FL',
    zip: '',
    reference_id: '',
    construction_date: '',
    building_count: '',
    stories: '',
    unit_count: '',
    building_area: '',
    inspection_date: new Date().toISOString().slice(0, 10)
  });
  
  const [componentData, setComponentData] = useState([]);
  const [newComponent, setNewComponent] = useState({
    name: '',
    quantity: '',
    unit: 'SF',
    useful_life: '',
    remaining_life: '',
    replacement_cost: '',
    description: '',
    category: 'Roof'
  });
  
  const [financialData, setFinancialData] = useState({
    starting_reserve_balance: '',
    annual_contribution: '',
    interest_rate: '3.0',
    accounting_method: 'Pooled'
  });
  
  const [generating, setGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Functions for property data
  const handlePropertyChange = (e) => {
    setPropertyData({
      ...propertyData,
      [e.target.name]: e.target.value
    });
  };
  
  // Functions for component data
  const handleComponentChange = (e) => {
    setNewComponent({
      ...newComponent,
      [e.target.name]: e.target.value
    });
  };
  
  const addComponent = () => {
    // Validate component data
    if (!newComponent.name || !newComponent.quantity || !newComponent.useful_life || 
        !newComponent.remaining_life || !newComponent.replacement_cost) {
      setErrorMsg('Please fill in all required component fields');
      return;
    }
    
    const updatedComponents = [
      ...componentData,
      {
        ...newComponent,
        id: Date.now(),  // Add unique ID
        quantity: parseFloat(newComponent.quantity),
        useful_life: parseInt(newComponent.useful_life),
        remaining_life: parseInt(newComponent.remaining_life),
        replacement_cost: parseFloat(newComponent.replacement_cost)
      }
    ];
    
    setComponentData(updatedComponents);
    setNewComponent({
      name: '',
      quantity: '',
      unit: 'SF',
      useful_life: '',
      remaining_life: '',
      replacement_cost: '',
      description: '',
      category: 'Roof'
    });
    setErrorMsg('');
  };
  
  const removeComponent = (id) => {
    setComponentData(componentData.filter(comp => comp.id !== id));
  };
  
  // Functions for financial data
  const handleFinancialChange = (e) => {
    setFinancialData({
      ...financialData,
      [e.target.name]: e.target.value
    });
  };
  
  // Generate report function
  const generateReport = async () => {
    // Validate data
    if (!propertyData.name || !propertyData.address) {
      setErrorMsg('Please provide property information');
      setActiveTab('property');
      return;
    }
    
    if (componentData.length === 0) {
      setErrorMsg('Please add at least one component');
      setActiveTab('components');
      return;
    }
    
    if (!financialData.starting_reserve_balance || !financialData.annual_contribution) {
      setErrorMsg('Please provide financial information');
      setActiveTab('financial');
      return;
    }
    
    setGenerating(true);
    setErrorMsg('');
    
    try {
      // In a real application, this would be an API call to your backend
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_data: propertyData,
          component_data: componentData,
          financial_data: {
            starting_reserve_balance: parseFloat(financialData.starting_reserve_balance),
            annual_contribution: parseFloat(financialData.annual_contribution),
            interest_rate: parseFloat(financialData.interest_rate),
            accounting_method: financialData.accounting_method
          },
          output_filename: `${propertyData.name.replace(/\s+/g, '_')}_SIRS_Report.docx`
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      // For demo purposes, we'll just use a placeholder
      setReportUrl('/sample_report.docx');
      
      // In reality, you would handle the file download
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // setReportUrl(url);
    } catch (error) {
      setErrorMsg(`Failed to generate report: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };
  
  // Calculate funding projections
  const calculateFunding = async () => {
    if (componentData.length === 0 || !financialData.starting_reserve_balance) {
      setErrorMsg('Please add components and financial information first');
      return;
    }
    
    try {
      // This would be an API call in a real app
      const response = await fetch('/api/calculate-funding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component_data: componentData,
          financial_data: {
            starting_reserve_balance: parseFloat(financialData.starting_reserve_balance),
            annual_contribution: parseFloat(financialData.annual_contribution),
            interest_rate: parseFloat(financialData.interest_rate)
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      // In a real app, we would display the funding projection results
      alert('Funding calculations completed successfully');
    } catch (error) {
      setErrorMsg(`Failed to calculate funding: ${error.message}`);
    }
  };
  
  // Tab navigation
  const renderTabContent = () => {
    switch(activeTab) {
      case 'property':
        return renderPropertyTab();
      case 'components':
        return renderComponentsTab();
      case 'financial':
        return renderFinancialTab();
      case 'generate':
        return renderGenerateTab();
      default:
        return renderPropertyTab();
    }
  };
  
  // Property tab content
  const renderPropertyTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Property Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Property Name</label>
          <input
            type="text"
            name="name"
            value={propertyData.name}
            onChange={handlePropertyChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="Golf View Manor II"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Reference ID</label>
          <input
            type="text"
            name="reference_id"
            value={propertyData.reference_id}
            onChange={handlePropertyChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="FL-69-705"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={propertyData.address}
            onChange={handlePropertyChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="5635, 5651, 5667, 5683 Rattlesnake Hammock Rd"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={propertyData.city}
            onChange={handlePropertyChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="Naples"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={propertyData.state}
              onChange={handlePropertyChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="FL"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP</label>
            <input
              type="text"
              name="zip"
              value={propertyData.zip}
              onChange={handlePropertyChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="34113"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Construction Date</label>
          <input
            type="text"
            name="construction_date"
            value={propertyData.construction_date}
            onChange={handlePropertyChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="1980"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Inspection Date</label>
          <input
            type="date"
            name="inspection_date"
            value={propertyData.inspection_date}
            onChange={handlePropertyChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Buildings</label>
          <input
            type="text"
            name="building_count"
            value={propertyData.building_count}
            onChange={handlePropertyChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="4"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Units</label>
          <input
            type="text"
            name="unit_count"
            value={propertyData.unit_count}
            onChange={handlePropertyChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="75"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Stories</label>
          <input
            type="text"
            name="stories"
            value={propertyData.stories}
            onChange={handlePropertyChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Building Area</label>
          <input
            type="text"
            name="building_area"
            value={propertyData.building_area}
            onChange={handlePropertyChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="33,000 sq. ft."
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={() => setActiveTab('components')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next: Components
        </button>
      </div>
    </div>
  );
  
  // Components tab content
  const renderComponentsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Component Inventory</h2>
      
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <h3 className="text-lg font-medium mb-3">Add New Component</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Component Name</label>
            <input
              type="text"
              name="name"
              value={newComponent.name}
              onChange={handleComponentChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="Roof - Flat, TPO"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={newComponent.category}
              onChange={handleComponentChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              {componentCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={newComponent.quantity}
              onChange={handleComponentChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="330"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <select
              name="unit"
              value={newComponent.unit}
              onChange={handleComponentChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              {units.map(unit => (
                <option key={unit.value} value={unit.value}>{unit.label} ({unit.value})</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Useful Life (years)</label>
            <input
              type="number"
              name="useful_life"
              value={newComponent.useful_life}
              onChange={handleComponentChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="25"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Remaining Life (years)</label>
            <input
              type="number"
              name="remaining_life"
              value={newComponent.remaining_life}
              onChange={handleComponentChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="11"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Replacement Cost ($)</label>
            <input
              type="number"
              name="replacement_cost"
              value={newComponent.replacement_cost}
              onChange={handleComponentChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="448800"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={addComponent}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
            >
              Add Component
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Component Description</label>
          <textarea
            name="description"
            value={newComponent.description}
            onChange={handleComponentChange}
            rows="3"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="Describe the component's condition, history, and any relevant details..."
          ></textarea>
        </div>
      </div>
      
      {/* Component List */}
      <div>
        <h3 className="text-lg font-medium mb-3">Component List ({componentData.length} items)</h3>
        
        {componentData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Useful Life</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {componentData.map(component => (
                  <tr key={component.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{component.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{component.category}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{component.quantity}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{component.unit}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{component.useful_life} years</td>
                    <td className="px-4 py-2 whitespace-nowrap">{component.remaining_life} years</td>
                    <td className="px-4 py-2 whitespace-nowrap">${component.replacement_cost.toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">
                      <button
                        onClick={() => removeComponent(component.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-md">
            No components added yet. Use the form above to add components.
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => setActiveTab('property')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back: Property
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next: Financial
        </button>
      </div>
    </div>
  );
  
  // Financial tab content
  const renderFinancialTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Financial Information</h2>
      
      <div className="bg-white p-6 rounded-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Starting Reserve Fund Balance ($)</label>
            <input
              type="number"
              name="starting_reserve_balance"
              value={financialData.starting_reserve_balance}
              onChange={handleFinancialChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="143858.40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Annual Contribution ($)</label>
            <input
              type="number"
              name="annual_contribution"
              value={financialData.annual_contribution}
              onChange={handleFinancialChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="42600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              name="interest_rate"
              value={financialData.interest_rate}
              onChange={handleFinancialChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="3.0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Accounting Method</label>
            <select
              name="accounting_method"
              value={financialData.accounting_method}
              onChange={handleFinancialChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="Pooled">Pooled (Cash Flow)</option>
              <option value="Straight-Line">Straight-Line (Component)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={calculateFunding}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
          >
            Calculate Funding Projections
          </button>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => setActiveTab('components')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back: Components
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next: Generate Report
        </button>
      </div>
    </div>
  );
  
  // Generate tab content
  const renderGenerateTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Generate Report</h2>
      
      <div className="bg-white p-6 rounded-md border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Report Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700">Property</h4>
            <p className="mt-1">{propertyData.name || 'Not specified'}</p>
            <p className="text-sm text-gray-500">{propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700">Components</h4>
            <p className="mt-1">{componentData.length} items</p>
            <p className="text-sm text-gray-500">
              Total replacement cost: ${_.sumBy(componentData, 'replacement_cost').toLocaleString()}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700">Financial</h4>
            <p className="mt-1">Starting Balance: ${parseFloat(financialData.starting_reserve_balance || 0).toLocaleString()}</p>
            <p className="text-sm text-gray-500">
              Annual Contribution: ${parseFloat(financialData.annual_contribution || 0).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          {errorMsg && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {errorMsg}
            </div>
          )}
          
          <button
            onClick={generateReport}
            disabled={generating}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {generating ? 'Generating...' : 'Generate Reserve Study Report'}
            {!generating && <span className="ml-2">📄</span>}
          </button>
          
          {reportUrl && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium">Report Generated Successfully!</p>
              <a
                href={reportUrl}
                download
                className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download Report
              </a>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => setActiveTab('financial')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back: Financial
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Reserve Study Generator</h1>
        <p className="text-gray-500">MECA Engineering Corporation</p>
      </div>
      
      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'property', label: '1. Property Information' },
            { id: 'components', label: '2. Component Inventory' },
            { id: 'financial', label: '3. Financial Data' },
            { id: 'generate', label: '4. Generate Report' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Content Area */}
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ReserveStudyGenerator;
