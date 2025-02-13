'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Plus, Play, Pause, X } from 'lucide-react';
import { Modal } from './Modal';
import { uploadFileAws } from '@/app/actions/uploads';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../input';

const CHUNK_SIZE = 1024 * 1024; // 1 MB

interface UploadProgress {
  fileName: string;
  progress: number;
  isPaused: boolean;
  isCompleted: boolean;
}

const UploadBtn: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { toast } = useToast();
  const [uploadProgressList, setUploadProgressList] = useState<UploadProgress[]>([]);
  const [isContentUploading, setIsContentUploading] = useState<boolean>(false)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFileUpload(selectedFile);
    setShowUploadModal(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
   
    if (!fileUpload) {
      toast({ title: 'No file selected', variant: 'destructive' });
      return;
    }
     //close upload modal
     setShowUploadModal(false)
    
    //show uplaod progress modal
    setIsContentUploading(true)

    const totalChunks = Math.ceil(fileUpload.size / CHUNK_SIZE);
    const uploadProgress: UploadProgress = {
      fileName: fileUpload.name,
      progress: 0,
      isPaused: false,
      isCompleted: false,
    };
    setUploadProgressList((prev) => [...prev, uploadProgress]);
    
    for (let i = 0; i < totalChunks; i++) {
      if (uploadProgress.isPaused) break;

      const chunk = fileUpload.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('fileName', fileUpload.name);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', totalChunks.toString());

      try {
        const response = await uploadFileAws(formData);
        if (!response.success) {
          toast({ title: 'Something went wrong', variant: 'destructive' });
        }
        setUploadProgressList((prev) =>
          prev.map((item) =>
            item.fileName === fileUpload.name
              ? { ...item, progress: Math.round(((i + 1) / totalChunks) * 100) }
              : item
          )
        );
        //close upload progress modal
        setIsContentUploading(false)
        //show success taost
        // toast({ title: 'File Uploaded', variant: 'default' });
      } catch (error) {
        console.error('Upload failed:', error);
        toast({ title: 'Upload failed. Resumable.', variant: 'destructive' });
        break;
      }
    }

    setUploadProgressList((prev) =>
      prev.map((item) =>
        item.fileName === fileUpload.name ? { ...item, isCompleted: true } : item
      )
    );
    setShowUploadModal(false);
    setFileUpload(null);
  };

  const togglePause = (fileName: string) => {
    setUploadProgressList((prev) =>
      prev.map((item) =>
        item.fileName === fileName ? { ...item, isPaused: !item.isPaused } : item
      )
    );
  };

  const cancelUpload = (fileName: string) => {
    setUploadProgressList((prev) => prev.filter((item) => item.fileName !== fileName));
    toast({ title: `${fileName} upload canceled`, variant: 'destructive' });
  };

  return (
    <div className="relative inline-block">
      {showUploadModal && (
        <Modal
          onClose={() => setShowUploadModal(false)}
          title="Choose File to Upload"
          description="Choose the file you want to upload to the cloud"
          open={showUploadModal}
          footerBtn="Upload"
          onAction={handleUpload}
        >
          <div>
            {fileUpload && <span>{fileUpload.name}</span>}
            <Input ref={fileInputRef} type="file" onChange={handleFileChange} />
          </div>
        </Modal>
      )}
      <TooltipProvider>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
          <TooltipTrigger asChild>
            <Button onClick={() => setShowTooltip(!showTooltip)} variant="secondary">
              <Plus className="text-green-600 text-xl" />
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
      {
        isContentUploading && <div className="fixed bottom-4 right-4 space-y-2 w-auto p-4 bg-muted text-white rounded shadow-lg">
        {uploadProgressList.map((upload) => (
          <div key={upload.fileName} className="flex justify-between items-center">
            <div>
              <p>{upload.fileName}</p>
              <p>{upload.progress}%</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={() => togglePause(upload.fileName)} disabled={upload.isCompleted}>
                {upload.isPaused ? <Play /> : <Pause />}
              </Button>
              <Button variant="destructive" onClick={() => cancelUpload(upload.fileName)}>
                <X />
              </Button>
            </div>
          </div>
        ))}
      </div>
      }
    </div>
  );
};

export default UploadBtn;
