import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import ReactPlayer from "react-player";
import FileModalNav from "../nav/FileModalNav";
import Loading from "@/app/(main)/dashboard/loading";
import PdfViewer from "../renders/PdfViewer";
import { FileIcon } from "lucide-react";

export function FileModal({
  open,
  onClose,
  fileDetails,
  fileUrl,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  loading?: boolean;
  fileDetails?: {
    fileKey: string;
    userEmail: string;
    fileType: string;
    id: string;
    uploadDate: string;
    starred: boolean | null;
    userId?: string;
    user?: {
      email: string;
    };
  } | undefined; // Make this optional (undefined)
}) {
  if (!fileDetails) {
    return null; // Handle the case when fileDetails is undefined
  }

  // Default the starred field to `false` if it is `null`
  const starred = fileDetails.starred ?? false;

  // Use userEmail from fileDetails or from the nested user object if available
  const userEmail = fileDetails.userEmail || (fileDetails.user?.email || "");

  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(fileDetails?.fileType || "");
  const isVideo = ["mp4", "webm", "ogg"].includes(fileDetails?.fileType || "");

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-full h-screen max-w-full mx-auto p-2 sm:p-4">
        {/* File Details at the Top */}
        <FileModalNav
          fileKey={fileDetails.fileKey}
          uploadDate={fileDetails.uploadDate}
          fileId={fileDetails.id}
          starred={starred} // Always passing a boolean
          fileOwner={userEmail}
          fileUrl={fileUrl}
        />

        {/* Media Container */}
        {loading ? (
          <Loading />
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center">
            {isImage && (
              <div className="w-full max-h-[80vh] overflow-auto">
                {/* Image shown on all screen sizes */}
                <div className="relative w-full">
                  <Image
                    src={fileUrl}
                    alt={fileDetails.fileKey}
                    width={1000}
                    height={1000}
                    className="object-contain w-full h-auto max-w-full mx-auto"
                    unoptimized // Needed for external URLs
                    loading="eager"
                    onError={(e) => {
                      // If image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      // Show fallback message
                      const fallback = document.getElementById('image-fallback');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  
                  {/* Fallback that shows only if image fails to load */}
                  <div 
                    id="image-fallback"
                    className="hidden flex-col items-center justify-center p-6 text-center"
                  >
                    <FileIcon className="w-12 h-12 mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Unable to preview this image
                    </p>
                    <a 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-4 text-primary underline"
                    >
                      Open image in new tab
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {isVideo && (
              <div className="w-full h-full max-h-[80vh] max-w-full">
                <ReactPlayer 
                  url={fileUrl} 
                  controls={true} 
                  width="100%" 
                  height="100%"
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload', // Prevent download option in video controls
                        style: {
                          maxHeight: '80vh',
                          maxWidth: '100%'
                        }
                      }
                    }
                  }}
                />
              </div>
            )}
            
            {fileDetails.fileType === "pdf" && (
              <div className="w-full h-full max-w-full">
                <PdfViewer fileUrl={fileUrl} />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
