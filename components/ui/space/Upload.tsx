import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';

const UploadBtn: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="relative inline-block">
      <TooltipProvider>
      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <Button onClick={handleToggleTooltip} variant="secondary">
          <span className=' text-green-600 text-xl'><Plus/></span> <span className=' text-xl'>Upload</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent side="right" align="center" className="p-2 w-48  shadow-lg rounded">
          <ul className="text-sm text-gray-700">
            <li
              className="px-4 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => {
                console.log('Upload New Folder');
                setShowTooltip(false);
              }}
            >
               Upload New Folder
            </li>
            <li
              className="px-4 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => {
                console.log('File Upload');
                setShowTooltip(false);
              }}
            >
              File Upload
            </li>
            <li
              className="px-4 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => {
                console.log('Folder Upload');
                setShowTooltip(false);
              }}
            >
              Folder Upload
            </li>
          </ul>
        </TooltipContent>
      </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default UploadBtn;
