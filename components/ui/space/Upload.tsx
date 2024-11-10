"use client"
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { Modal } from './Modal';
import { uploadFileAws } from '@/app/actions/uploads';
import { useToast } from '@/hooks/use-toast';

const UploadBtn: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  const { toast } = useToast()

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
    const formData = new FormData()
    formData.append('file', fileUpload)        //fix this 
    try {
      setUploadLoading(true)
      const upload = await uploadFileAws(formData)
      setUploadLoading(false)
      if(upload?.success){
        toast({
          title: 'uploaded successfully',
        })
      }else{
        toast({
          title: upload?.message
        })
      }
    } catch (error) {
      console.log(error,'error in uploading')
      toast({
        title:'sorry cant upload file',
        variant: 'destructive'
      })
    }
    setShowUploadModal(false);
  };

  return (
    <div className="relative inline-block">
      {showUploadModal && (
        <Modal
          title="Choose File To Upload"
          description="choose file you want to upload to the cloud"
          open={showUploadModal}
          onClickFn={ uploadLoading ? ()=>{} : handleUpload}
          footerBtn={ uploadLoading ? 'Loading' : 'Upload'}
        >
          <div>
            <input type="file" onChange={handleFileChange} />
          </div>
        </Modal>
      )}
      <TooltipProvider>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
          <TooltipTrigger asChild>
            <Button onClick={() => setShowTooltip(!showTooltip)} variant="secondary">
              <span className="text-green-600 text-xl"><Plus /></span>
              <span className="text-xl">Upload</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="p-2 w-48 shadow-lg rounded">
            <ul className="text-sm text-gray-700">
              <li
                className="px-4 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => {
                  setShowUploadModal(true)
                  setShowTooltip(false);
                }}
              >
                File Upload
              </li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* {uploadStatus && <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>} */}
    </div>
  );
};

export default UploadBtn;
