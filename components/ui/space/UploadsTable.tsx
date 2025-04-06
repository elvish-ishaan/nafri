'use client';

import { EllipsisVertical, HardDrive, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteFileAws, fetchSignedUrl } from "@/app/actions/uploads";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { FileModal } from "./FileModal";
import { format } from "date-fns"; // date-fns for formatting
import { Tooltip, TooltipProvider, TooltipTrigger } from "../tooltip";
import { TooltipContent } from "../tooltip";
import { Separator } from "../separator";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export interface FileMetaData {
  id: string;
  fileKey: string;
  fileType: string;
  uploadDate: string;
  userEmail: string;
  starred: boolean | null;  // Allow null here
}

export function UploadsTable({ filesData }: { filesData: FileMetaData[] }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [uploadFiles, setUploadFiles] = useState<FileMetaData[] | []>([]);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileMetaData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (filesData.length > 0) {
      setUploadFiles(filesData);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [filesData]);

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
        setUploadFiles((prevFiles) => prevFiles?.filter((file) => file.id !== fileId));
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
  const filteredFiles = uploadFiles?.filter((file) =>
    file.fileKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton className="h-6 w-[250px]" /></TableCell>
      <TableCell className="hidden sm:table-cell"><Skeleton className="h-6 w-[180px]" /></TableCell>
      <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-[200px]" /></TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex gap-3">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-[40px]" />
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-6 w-6 ml-auto" /></TableCell>
    </TableRow>
  );

  // Card view for mobile
  const FileCard = ({ file }: { file: FileMetaData }) => (
    <Card 
      className="mb-3 cursor-pointer" 
      onClick={() => handleViewClk(file.fileKey)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="font-medium truncate">{file.fileKey}</p>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground">
                    <EllipsisVertical className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" align="center" className="p-2 w-48 shadow-lg rounded">
                  <div className="flex flex-col gap-2 p-3">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete(file.fileKey, file.id);
                      }}
                      className="flex items-center gap-2 cursor-pointer hover:text-muted"
                    >
                      <Trash2 className="text-red-600 h-5 w-5" />
                      <span className="text-red-600">Delete</span>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Star className="h-5 w-5" />
                      Add to starred
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Uploaded: {format(new Date(file.uploadDate), "MM/dd/yyyy")}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HardDrive className="h-4 w-4" />
            <span>Disk</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>      
      <div className="mb-4 mt-6 sm:mt-10">
        <Input
          className="w-full sm:w-1/2 mx-auto"
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

      {/* Mobile Card View */}
      <div className="sm:hidden mt-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full mb-3" />
            <Skeleton className="h-24 w-full mb-3" />
            <Skeleton className="h-24 w-full mb-3" />
          </>
        ) : filteredFiles?.length === 0 ? (
          <p className="text-center py-4">Sorry, no files found.</p>
        ) : (
          filteredFiles?.map((file) => (
            <FileCard key={file.id} file={file} />
          ))
        )}
      </div>

      {/* Table View (tablet and desktop) */}
      <div className="hidden sm:block mt-6 sm:mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Uploaded On</TableHead>
              <TableHead className="hidden md:table-cell">Owner</TableHead>
              <TableHead className="hidden lg:table-cell">Location</TableHead>
              <TableHead className="text-right w-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show skeleton rows while loading
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : filteredFiles?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Sorry, no files found.
                </TableCell>
              </TableRow>
            ) : (
              filteredFiles?.map((metaData) => (
                <TableRow
                  key={metaData.id}
                  onDoubleClick={() => handleViewClk(metaData.fileKey)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <div className="truncate max-w-[200px] sm:max-w-[250px] md:max-w-full">
                      {metaData.fileKey}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {format(new Date(metaData.uploadDate), "MM/dd/yyyy, hh:mm a")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{metaData.userEmail}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex gap-3">
                      <HardDrive className="h-5 w-5" />
                      <span>Disk</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-muted-foreground">
                            <EllipsisVertical className="h-5 w-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="left"
                          align="center"
                          className="p-2 w-48 shadow-lg rounded"
                        >
                          <div className="flex flex-col gap-2 p-3">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileDelete(metaData.fileKey, metaData.id);
                              }}
                              className="flex items-center gap-2 cursor-pointer hover:text-muted"
                            >
                              <Trash2 className="text-red-600 h-5 w-5" />
                              <span className="text-red-600">Delete</span>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-2 cursor-pointer">
                              <Star className="h-5 w-5" />
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
      </div>
    </>
  );
}
