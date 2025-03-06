import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';import { Calendar, Clock, Camera, Check } from 'lucide-react';

const defaultClient = {
  name: 'No Client Selected',
  address: 'No Address Available',
  completion: 0,
  daysLeft: 0
};

const ClientProgress = ({ client = defaultClient }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Ensure we have valid client data
  const safeClient = {
    ...defaultClient,
    ...client
  };

  const progressHistory = [
    { date: '2024-01-01', completion: 20 },
    { date: '2024-02-01', completion: 45 },
    { date: '2024-03-01', completion: 75 },
    { date: '2024-04-01', completion: 90 }
  ];

  const tasks = [
    {
      id: 1,
      title: 'Site Visit',
      assignee: 'John Engineer',
      status: 'completed',
      date: '2024-02-15'
    },
    {
      id: 2,
      title: 'Financial Analysis',
      assignee: 'Sarah Analyst',
      status: 'in_progress',
      date: '2024-04-20'
    },
    {
      id: 3,
      title: 'Component Photos',
      assignee: 'Mike Inspector',
      status: 'pending',
      date: '2024-04-25'
    }
  ];

  if (!client) {
    return (
      <div className="p-6 text-center text-gray-500">
        Please select a client to view progress
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{safeClient.name}</h2>
            <p className="text-gray-600">{safeClient.address}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {safeClient.completion || 0}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {safeClient.daysLeft || 0}
              </div>
              <div className="text-sm text-gray-600">Days Left</div>
            </div>
          </div>
        </div>

        <div className="border-b mb-6">
          <nav className="flex gap-4">
            {['Overview', 'Tasks', 'Documents', 'Team'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab.toLowerCase()
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="completion" 
                    stroke="#2196F3" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium mb-2">Next Steps</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Complete financial analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-500" />
                    <span>Take component photos</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium mb-2">Completed Items</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Site inspection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Initial questionnaire</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {tasks.map(task => (
              <div 
                key={task.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                  />
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-600">
                      Assigned to {task.assignee}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{task.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProgress;

The compiler option "forceConsistentCasingInFileNames" should be enabled to reduce issues when working with different OSes.

The compiler option "strict" should be enabled to reduce type errors.

{
  "compilerOptions": {
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    // other options...
  }
}
