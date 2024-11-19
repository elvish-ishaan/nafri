'use client'; // Ensures this component is client-side

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you're using ShadCN UI
import { Key, PlusCircle, Trash2 } from 'lucide-react';
import { deleteApiKeyById, generateApiKey, getDevApiKeys } from '@/app/actions/dev';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  genDate: Date;
  key: string;
  userEmail: string;
}

// Format the date into a simple format: 'MMM dd, yyyy HH:mm'
const formatDate = (date: Date): string => format(date, 'MMM dd, yyyy HH:mm');

const Page: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[] | []>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all API keys on component mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      const res = await getDevApiKeys();
      setApiKeys(res.data || []);
    };
    fetchApiKeys();
  }, []);

  // Generate a new API key
  const handleGenerateApiKey = async () => {
    setLoading(true);
    try {
      const resKey = await generateApiKey();
      if (resKey?.success) {
        setApiKeys((prevKeys) => [...prevKeys, resKey?.data]);
        toast({ title: 'Success', description: 'API key generated successfully.' });
      } else {
        toast({ title: 'Error', description: 'Failed to generate API key.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      toast({ title: 'Unexpected Error', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Delete an API key
  const handleDeleteApiKey = async (id: string) => {
    try {
      const res = await deleteApiKeyById(id);
      if (res.success) {
        setApiKeys((prev) => prev.filter((key) => key.id !== id));
        toast({ title: 'Success', description: 'API key deleted successfully.' });
      } else {
        toast({ title: 'Error', description: 'Failed to delete API key.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({ title: 'Unexpected Error', description: 'Please try again later.', variant: 'destructive' });
    }
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
            onClick={handleGenerateApiKey}
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
                  <span className="text-sm">{apiKey?.key}</span>
                </div>
                <div className="flex space-x-4">
                  <span className="text-xs text-gray-400">{formatDate(new Date(apiKey.genDate))}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleDeleteApiKey(apiKey.id)}
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
    </div>
  );
};

export default Page;
