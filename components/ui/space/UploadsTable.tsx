"use client"
import { Delete, EllipsisVertical, HardDrive, Star, Trash2 } from "lucide-react";
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

interface FileMetaData {
  id: string;
  fileKey: string;
  uploadDate: string;
  userEmail: string;
}

export function UploadsTable({ filesData }: { filesData: FileMetaData[] }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileMetaData | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const { toast } = useToast()


  const handleViewClk = async (fileKey: string) => {
    try {
      const url = await fetchSignedUrl(fileKey);
      setFileUrl(url || null);
      setSelectedFile(filesData.find((file) => file.fileKey === fileKey) || null);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      toast({
        title: "Can't load file",
        variant: "destructive",
      });
    }
  };

  //hanlde file deletion
  const hanldeFileDelete = async (fileKey: string, fileId: string) => {
    try {
      const res = await deleteFileAws(fileKey, fileId)
      if(res.success){
        toast({
          title: "File Deleted"
        })
      }
    } catch (error) {
      console.log(error,'error in deleting file')
      toast({
        title: 'error in deleting file'
      })
    }
  } 

  return (
    <>
      {showModal && selectedFile && (
        <FileModal open={showModal} onClose={() => setShowModal(false)} 
        fileDetails={selectedFile} fileUrl={fileUrl || ""} />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Uploaded On</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filesData?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Sorry, no files found.
              </TableCell>
            </TableRow>
          ) : (
            filesData?.map((metaData) => (
              <TableRow key={metaData.id} onDoubleClick={() => handleViewClk(metaData.fileKey)}>
                <TableCell className="font-medium">{metaData.fileKey}</TableCell>
                <TableCell>{format(new Date(metaData.uploadDate), "MM/dd/yyyy, hh:mm:ss a")}</TableCell>
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
                        <span  onClick={() => setShowTooltip(!showTooltip)} className="text-green-600">
                          <EllipsisVertical/></span>
                     </TooltipTrigger>
                     <TooltipContent side="top" align="center" className="p-2 w-48 shadow-lg rounded">
                       <div className=" flex flex-col gap-2 p-3 ">
                         <div onClick={() => hanldeFileDelete(metaData?.fileKey, metaData?.id)}
                          className=" flex items-center gap-2 cursor-pointer hover:text-muted">
                            <Trash2 className=" text-red-600 "/><span className=" text-red-600">Delete</span></div>
                         <Separator/>
                         <div className=" flex items-center gap-2 cursor-pointer"><Star/>Add to starred</div>
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
