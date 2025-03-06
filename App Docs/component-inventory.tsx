import React, { useState } from 'react';
import { PlusCircle, Upload, Save } from 'lucide-react';

const defaultCategories = [
  'Roof',
  'Structure',
  'Fireproofing',
  'Plumbing',
  'Electrical',
  'Waterproofing',
  'Windows and Doors',
  'Other'
];

const defaultData = {
  components: [],
  categories: defaultCategories
};

const ComponentInventory = ({ data = defaultData, onUpdate = () => {}, onFileUpload = () => {} }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newComponent, setNewComponent] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    usefulLife: '',
    remainingLife: '',
    replacementCost: ''
  });

  // Ensure we have valid data object with required properties
  const safeData = {
    ...defaultData,
    ...data,
    categories: data?.categories || defaultCategories,
    components: data?.components || []
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    onFileUpload(file);
  };

  const handleAddComponent = () => {
    onUpdate({
      ...safeData,
      components: [...safeData.components, { ...newComponent, id: Date.now() }]
    });
    setNewComponent({
      name: '',
      category: '',
      quantity: '',
      unit: '',
      usefulLife: '',
      remainingLife: '',
      replacementCost: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Component Inventory</h2>
        <div className="flex gap-4">
          <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 hover:bg-blue-600">
            <Upload className="w-4 h-4" />
            Import Excel
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
            />
          </label>
          <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Add New Component</h3>
        <div className="grid grid-cols-4 gap-4">
          <input
            className="border rounded p-2"
            placeholder="Component Name"
            value={newComponent.name}
            onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
          />
          <select 
            className="border rounded p-2"
            value={newComponent.category}
            onChange={(e) => setNewComponent({...newComponent, category: e.target.value})}
          >
            <option value="">Select Category</option>
            {safeData.categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            className="border rounded p-2"
            type="number"
            placeholder="Quantity"
            value={newComponent.quantity}
            onChange={(e) => setNewComponent({...newComponent, quantity: e.target.value})}
          />
          <input
            className="border rounded p-2"
            placeholder="Unit (SF, EA, etc.)"
            value={newComponent.unit}
            onChange={(e) => setNewComponent({...newComponent, unit: e.target.value})}
          />
          <input
            className="border rounded p-2"
            type="number"
            placeholder="Useful Life (years)"
            value={newComponent.usefulLife}
            onChange={(e) => setNewComponent({...newComponent, usefulLife: e.target.value})}
          />
          <input
            className="border rounded p-2"
            type="number"
            placeholder="Remaining Life (years)"
            value={newComponent.remainingLife}
            onChange={(e) => setNewComponent({...newComponent, remainingLife: e.target.value})}
          />
          <input
            className="border rounded p-2"
            type="number"
            placeholder="Replacement Cost ($)"
            value={newComponent.replacementCost}
            onChange={(e) => setNewComponent({...newComponent, replacementCost: e.target.value})}
          />
          <button 
            onClick={handleAddComponent} 
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
          >
            <PlusCircle className="w-4 h-4" />
            Add Component
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Component List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Unit</th>
                <th className="p-3 text-left">Useful Life</th>
                <th className="p-3 text-left">Remaining Life</th>
                <th className="p-3 text-left">Replacement Cost</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeData.components.map((component) => (
                <tr key={component.id} className="border-t">
                  <td className="p-3">{component.name}</td>
                  <td className="p-3">{component.category}</td>
                  <td className="p-3">{component.quantity}</td>
                  <td className="p-3">{component.unit}</td>
                  <td className="p-3">{component.usefulLife}</td>
                  <td className="p-3">{component.remainingLife}</td>
                  <td className="p-3">${component.replacementCost}</td>
                  <td className="p-3">
                    <button className="text-blue-500 px-2 py-1 mx-1 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-500 px-2 py-1 mx-1 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComponentInventory;