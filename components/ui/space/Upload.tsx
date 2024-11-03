import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';

const UploadBtn: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      console.log('No file selected');  // Logs if no file is selected
      return;
    }

    setUploadStatus('Uploading...');
    console.log('File change detected:', file);

    try {
      await uploadFile(file);  // Simulate file upload
      setUploadStatus('Upload successful!');
    } catch (error) {
      setUploadStatus('Upload failed.');
      console.error('Upload failed', error);
    }
  };

  const uploadFile = async (file: File) => {
    // Simulate a delay for upload
    console.log('Uploading:', file.name);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`${file.name} uploaded successfully`);
  };

  return (
    <div className="relative inline-block">
      <TooltipProvider>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
          <TooltipTrigger asChild>
            <Button onClick={() => setShowTooltip(!showTooltip)} variant="secondary">
              <span className='text-green-600 text-xl'><Plus /></span>
              <span className='text-xl'>Upload</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="p-2 w-48 shadow-lg rounded">
            <ul className="text-sm text-gray-700">
              <li
                className="px-4 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowTooltip(false);
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                File Upload
              </li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {uploadStatus && <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>}
    </div>
  );
};

export default UploadBtn;
