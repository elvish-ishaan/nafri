import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full border-t-4 border-gray-400 border-opacity-50 border-t-gray-300 w-12 h-12" />
    </div>
  );
};

export default Loading;