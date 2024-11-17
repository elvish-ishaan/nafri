'use client';  // Ensures this component is client-side

import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you're using ShadCN UI
import { Key, PlusCircle, Trash2 } from 'lucide-react';

// Mock data for generated API keys
const mockApiKeys = [
  { id: 1, key: 'abc123xyz', createdAt: '2024-11-17' },
  { id: 2, key: 'def456uvw', createdAt: '2024-11-16' },
];

const Page: React.FC = () => {
//   const [apiKey, setApiKey] = useState('');
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [loading, setLoading] = useState(false);

  // Generate a new API key (mock implementation)
  const generateApiKey = () => {
    setLoading(true);
    // Mock delay to simulate key generation
    setTimeout(() => {
      const newKey = {
        id: apiKeys.length + 1,
        key: Math.random().toString(36).substring(2, 15), // Random key generation
        createdAt: new Date().toLocaleDateString(),
      };
      setApiKeys((prevKeys) => [...prevKeys, newKey]);
      setLoading(false);
    }, 1000);
  };

  // Delete an API key
  const deleteApiKey = (id: number) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Developer Settings</h2>

      {/* API Key Generation Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Generate API Key</h3>
        <p className="text-sm text-gray-400 mb-4">Generate a new API key to access your application programmatically.</p>
        <div className="flex space-x-4">
          <Button
            size="sm"
            onClick={generateApiKey}
            disabled={loading}
            className="bg-green-600"
          >
            {loading ? 'Generating...' : 'Generate New Key'}
            <PlusCircle className="ml-2" />
          </Button>
        </div>
      </div>

      {/* API Key List Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Your API Keys</h3>
        {apiKeys.length > 0 ? (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Key size={20} className="text-gray-300" />
                  <span className="text-sm">{apiKey.key}</span>
                </div>
                <div className="flex space-x-4">
                  <span className="text-xs text-gray-400">{apiKey.createdAt}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => deleteApiKey(apiKey.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No API keys generated yet.</p>
        )}
      </div>

      {/* Additional settings can be added here */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Other Settings</h3>
        <p className="text-sm text-gray-400">Manage additional settings for your developer account.</p>
        <div className="flex space-x-4 mt-4">
          {/* Example additional button */}
          <Button variant="outline" size="sm" className="text-gray-300">
            Reset API Limits
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
