'use client';

import { EllipsisVertical, HardDrive, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteFileAws, fetchSignedUrl } from "@/app/actions/uploads";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { FileModal } from "./FileModal";
import { format } from "date-fns"; // date-fns for formatting
import { Tooltip, TooltipProvider, TooltipTrigger } from "../tooltip";
import { TooltipContent } from "../tooltip";
import { Separator } from "../separator";
import { Input } from "@/components/ui/input";

interface FileMetaData {
  id: string;
  fileKey: string;
  uploadDate: string;
  userEmail: string;
  fileType: string,
  starred: boolean,
}

export function UploadsTable({ filesData }: { filesData: FileMetaData[] }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [uploadFiles, setUploadFiles] = useState<FileMetaData[]>(filesData);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileMetaData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { toast } = useToast();

  const handleViewClk = async (fileKey: string) => {
    try {
      const res = await fetchSignedUrl(fileKey);
      setFileUrl(res.signedUrl || null);
      setSelectedFile(uploadFiles.find((file) => file.fileKey === fileKey) || null);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      toast({
        title: "Can't load file",
        variant: "destructive",
      });
    }
  };

  const handleFileDelete = async (fileKey: string, fileId: string) => {
    try {
      const res = await deleteFileAws(fileKey, fileId);
      if (res.success) {
        setUploadFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
        toast({
          title: "File Deleted",
        });
      } else {
        toast({
          title: "Unable to delete file",
        });
      }
    } catch (error) {
      console.log("Error deleting file:", error);
      toast({
        title: "Error deleting file",
      });
    }
  };

  // Filter files based on the search query
  const filteredFiles = uploadFiles.filter((file) =>
    file.fileKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>      
        <div className="mb-4 mt-10">
          <Input
            className=" w-1/2 mx-auto"
            placeholder="Search files by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      {showModal && selectedFile && (
        <FileModal
          open={showModal}
          onClose={() => setShowModal(false)}
          fileDetails={selectedFile}
          fileUrl={fileUrl || ""}
        />
      )}

      <Table className=" mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Uploaded On</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Sorry, no files found.
              </TableCell>
            </TableRow>
          ) : (
            filteredFiles.map((metaData) => (
              <TableRow
                key={metaData.id}
                onDoubleClick={() => handleViewClk(metaData.fileKey)}
              >
                <TableCell className="font-medium">{metaData.fileKey}</TableCell>
                <TableCell>
                  {format(new Date(metaData.uploadDate), "MM/dd/yyyy, hh:mm:ss a")}
                </TableCell>
                <TableCell>{metaData.userEmail}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-3">
                    <HardDrive />
                    <span>Disk</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-green-600">
                          <EllipsisVertical />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="center"
                        className="p-2 w-48 shadow-lg rounded"
                      >
                        <div className="flex flex-col gap-2 p-3">
                          <div
                            onClick={() =>
                              handleFileDelete(metaData?.fileKey, metaData?.id)
                            }
                            className="flex items-center gap-2 cursor-pointer hover:text-muted"
                          >
                            <Trash2 className="text-red-600" />
                            <span className="text-red-600">Delete</span>
                          </div>
                          <Separator />
                          <div className="flex items-center gap-2 cursor-pointer">
                            <Star />
                            Add to starred
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
