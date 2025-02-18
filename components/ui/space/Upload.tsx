'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { Modal } from './Modal';
import { uploadFileAws } from '@/app/actions/uploads';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../input';
import ProgressBar from './ProgressBar';
import { useRouter } from 'next/navigation';

const CHUNK_SIZE = 1024 * 1024; // 1 MB
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 100 MB

interface UploadProgress {
  fileName: string;
  progress: number;
  isCompleted?: boolean;
}

//function to estimate speed of client
const estimateUploadSpeed = async (): Promise<number> => {
  const testChunkSize = 256 * 1024; // 256 KB
  const testChunk = new Blob([new Uint8Array(testChunkSize)]);
  const formData = new FormData();
  formData.append('chunk', testChunk);
  formData.append('fileName', 'speed-test');
  formData.append('chunkNumber', '0');
  formData.append('totalChunks', '1');

  const startTime = performance.now();
  await uploadFileAws(formData); // Upload a small test chunk
  const endTime = performance.now();

  const duration = (endTime - startTime) / 1000; // Convert to seconds
  return testChunkSize / duration / 1024; // Speed in KB/s
};

const UploadBtn: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { toast } = useToast();
  const [uploadProgressList, setUploadProgressList] = useState<UploadProgress[]>([]);
  const [isContentUploading, setIsContentUploading] = useState<boolean>(false);
  const [stoppedFiles, setStoppedFiles] = useState<Set<string>>(new Set());
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      toast({ title: 'File size exceeds 100MB limit', variant: 'destructive' });
      return;
    }

    setFileUpload(selectedFile);
    setShowUploadModal(true);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!fileUpload) {
      toast({ title: 'No file selected', variant: 'destructive' });
      return;
    }
  
    setShowUploadModal(false);
    setIsContentUploading(true);
  
    // Estimate the upload speed
    const uploadSpeed = await estimateUploadSpeed();
      
    // Dynamically adjust chunk size based on speed
    let dynamicChunkSize = CHUNK_SIZE; // Default 1MB
    if (uploadSpeed < 500) {
      dynamicChunkSize = 256 * 1024; // 256 KB for slow connections
    } else if (uploadSpeed > 2000) {
      dynamicChunkSize = 4 * 1024 * 1024; // 4 MB for fast connections
    }
    
    const totalChunks = Math.ceil(fileUpload.size / dynamicChunkSize);
    let progress = 0;
  
    setUploadProgressList((prev) => [
      ...prev,
      { fileName: fileUpload.name, progress: 0, isCompleted: false },
    ]);
  
    for (let i = 0; i < totalChunks; i++) {
      if (stoppedFiles.has(fileUpload.name)) {
        break;
      }
  
      const chunk = fileUpload.slice(i * dynamicChunkSize, (i + 1) * dynamicChunkSize);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('fileName', fileUpload.name);
      formData.append('chunkNumber', i.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('contentType', fileUpload.type);
      formData.append('fileSize', fileUpload.size.toString());
  
      try {
        const response = await uploadFileAws(formData);
  
        if (!response.success) {
          toast({ title: response?.message, variant: 'destructive' });
          break;
        }
  
        if (response.isCompleted) {
          router.refresh();
        }
  
        progress = Math.round(((i + 1) / totalChunks) * 100);
        setUploadProgressList((prev) =>
          prev.map((item) => (item.fileName === fileUpload.name ? { ...item, progress } : item))
        );
      } catch (error) {
        console.error('Upload failed:', error);
        toast({ title: 'Upload failed. Resumable.', variant: 'destructive' });
        break;
      }
    }
  
    setIsContentUploading(false);
    setUploadProgressList((prev) =>
      prev.map((item) => (item.fileName === fileUpload.name ? { ...item, isCompleted: true } : item))
    );
    setFileUpload(null);
  };
  
  
  const cancelUpload = (fileName: string) => {
    setStoppedFiles((prev) => {
      if (!prev.has(fileName)) {
        return prev.add(fileName);
      }
      return prev;
    });    
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setShowUploadModal(true)} variant="secondary">
              <Plus className="text-green-600 text-xl" />
              <span className="text-xl">Upload</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="p-2 w-48 shadow-lg rounded">
            <ul className="text-sm text-gray-700">
              <li
                className="px-4 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setShowUploadModal(true)}
              >
                File Upload
              </li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isContentUploading && (
        <ProgressBar
          uploadProgressList={uploadProgressList}
          cancelUpload={cancelUpload}
        />
      )}
    </div>
  );
};

export default UploadBtn;
