"use client";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import ReactPlayer from "react-player";
import FileModalNav from "../nav/FileModalNav";

export function FileModal({
  open,
  onClose,
  fileDetails,
  fileUrl,
}: {
  open: boolean;
  onClose: () => void
  fileUrl: string;
  fileDetails: {
    fileKey: string;
    userEmail: string;
    fileType: string;
    id: string;
    uploadDate: string;
    starred: boolean;
  };
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-full h-screen max-w-full mx-auto p-4">
        {/* File Details at the Top */}
        <FileModalNav fileKey={fileDetails?.fileKey} 
        uploadDate={fileDetails?.uploadDate} fileId={fileDetails?.id}
        starred={fileDetails?.starred}
        fileOwner={fileDetails.userEmail}
        />

        {/* Media Container */}
        <div className="flex-grow flex items-center justify-center">
          {fileDetails?.fileType === "jpg" && (
            <Image
              src={fileUrl}
              alt={fileDetails.fileKey}
              layout="responsive"
              width={1000} // Set a large width for better scaling
              height={1000} // Set a large height for better scaling
              className="object-contain w-full h-auto max-h-[80vh]"
            />
          )}
          {fileDetails?.fileType === "mp4" && (
            <div className="w-full h-full max-h-[80vh] max-w-full">
              <ReactPlayer url={fileUrl} controls={true} width="100%" height="100%" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
