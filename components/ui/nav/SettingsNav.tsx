'use client';  // Ensures this component is client-side

import React from 'react';
import { User, Box, Code, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';  // Import usePathname for App Directory

// Array of navbar links with title, path, and icon
const navLinks = [
  { title: 'Account', path: '/settings', icon: <User size={24} /> },
//   { title: 'Storage', path: '/settings/storage', icon: <Box size={24} /> },
  { title: 'Developer(beta)', path: '/settings/developer', icon: <Code size={24} /> },
//   { title: 'Security', path: '/settings/security', icon: <Shield size={24} /> },
];

const SettingsNav: React.FC = () => {
  const pathname = usePathname();  // Get the current pathname

  return (
    <nav className=" bg-muted rounded-md text-white shadow-md w-full flex justify-center mb-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;  // Check if the link is active
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center space-x-2 ${isActive ? 'bg-gray-700' : 'hover:text-gray-400'} py-2 px-4 rounded-md`}
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            );
          })}
        </div>
        
      </div>
    </nav>
  );
};

export default SettingsNav;
