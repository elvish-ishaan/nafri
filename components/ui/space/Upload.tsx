'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { Modal } from './Modal';
import { uploadFileAws } from '@/app/actions/uploads';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../input';

const UploadBtn: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFileUpload(selectedFile);
    setShowUploadModal(true);

    // Reset file input so onChange triggers on selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!fileUpload) {
      toast({
        title: 'No file selected',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', fileUpload);

    try {
      setUploadLoading(true);
      const upload = await uploadFileAws(formData);
      setUploadLoading(false);

      if (upload?.success) {
        toast({
          title: 'Uploaded successfully',
        });
        //update the media list by refreshing the page
        location.reload()
        
      } else {
        toast({
          title: upload?.message || 'Upload failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error in uploading', error);
      toast({
        title: 'Sorry, can’t upload the file',
        variant: 'destructive',
      });
    }
    setShowUploadModal(false);
    setFileUpload(null); // Reset file state after upload
  };

  return (
    <div className="relative inline-block">
      {showUploadModal && (
        <Modal
          onClose={() => setShowUploadModal(false)}
          title="Choose File to Upload"
          description="Choose the file you want to upload to the cloud"
          open={showUploadModal}
          footerBtn={uploadLoading ? 'Loading...' : 'Upload'}
          onAction={uploadLoading ? () => {} : handleUpload}
        >
          <div>
            <Input ref={fileInputRef} type="file" onChange={handleFileChange} />
          </div>
        </Modal>
      )}
      <TooltipProvider>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
          <TooltipTrigger asChild>
            <Button onClick={() => setShowTooltip(!showTooltip)} variant="secondary">
              <span className="text-green-600 text-xl">
                <Plus />
              </span>
              <span className="text-xl">Upload</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="p-2 w-48 shadow-lg rounded">
            <ul className="text-sm text-gray-700">
              <li
                className="px-4 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => {
                  setShowUploadModal(true);
                  setShowTooltip(false);
                }}
              >
                File Upload
              </li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default UploadBtn;
