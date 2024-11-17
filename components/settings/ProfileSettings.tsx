'use client';  // Ensures this component is client-side

import React, { useState } from 'react';
import { Save, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
const ProfileSettings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe', // Initial profile data
    email: 'john.doe@example.com',
    password: '',
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (e.g., updating the profile)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Full Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-2 w-full"
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email Address
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-2 w-full"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <Input
            type="password"
            id="password"
            name="password"
            value={profileData.password}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-2 w-full"
          />
        </div>

        {/* Save/Cancel buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          {isEditing ? (
            <>
              <Button type="submit"  size="sm" className="bg-green-600">
                <Save className="mr-2" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-gray-300"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-gray-300"
            >
              <Edit className="mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
