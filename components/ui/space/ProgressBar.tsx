"use client" 

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Upload {
  fileName: string;
  progress: number;
  isPaused?: boolean;
  isCompleted?: boolean;
}

interface UploadProgressProps {
  uploadProgressList: Upload[];
  cancelUpload: (fileName: string) => void;
}

const ProgressBar: React.FC<UploadProgressProps> = ({
  uploadProgressList,
  cancelUpload,
}) => {
  return (
    <div className="fixed z-50 bottom-4 right-4 space-y-2 mr-5 w-auto p-4 bg-muted text-white rounded shadow-lg">
      {uploadProgressList.map((upload) => (
        <div key={upload.fileName} className="p-3 bg-background rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-medium">{upload.fileName}</p>
              <Progress value={upload.progress} className="w-56 h-2 mt-1 bg-gray-700" />
              <p className="text-xs text-gray-300 mt-1">{upload.progress}%</p>
            </div>
            <div className="flex space-x-4 ml-4">
              <Button variant="destructive" onClick={() => cancelUpload(upload.fileName)}>
                <X size={16} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
