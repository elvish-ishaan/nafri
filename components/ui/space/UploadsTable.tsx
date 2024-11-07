"use client"
import { HardDrive } from "lucide-react";
import { useState } from "react";
import { fetchSignedUrl } from "@/app/actions/uploads";
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

interface FileMetaData {
  id: string;
  fileKey: string;
  uploadDate: string;
  userEmail: string;
}

export function UploadsTable({ filesData }: { filesData: FileMetaData[] }) {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileMetaData | null>(null);

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

  return (
    <>
      {showModal && selectedFile && (
        <FileModal open={showModal} onClose={() => setShowModal(false)} fileDetails={selectedFile} fileUrl={fileUrl || ""} />
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
