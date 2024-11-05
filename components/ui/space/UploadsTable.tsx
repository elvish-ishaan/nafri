"use client"
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
import { HardDrive } from "lucide-react";
import { useState } from "react";
import { FileModal } from "./FileModal";
  
  interface FileMetaData {
    id: string;
    fileKey: string; // Name of the file (can be derived from fileKey)
    uploadDate: string; // Date of upload (mapped from uploadDate)
    userEmail: string; // Owner's email (mapped from userEmail)
  }
  
  export function UploadsTable({ filesData }: any) {
    const { toast} = useToast()       //fix this type
    const [showModal, setShowModal] = useState<boolean>(false)
    let fileUrl: any;
    const handleViewClk = async(fileUrl: string) => {
      try {
        fileUrl = await fetchSignedUrl(fileUrl) || null
        setShowModal(true)
      } catch (error) {
        console.log(error,'error in fetching signed url')
        toast({
          title: 'Cant load file',
          variant: 'destructive'
        })
      }
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead >Name</TableHead>
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
            filesData?.map((metaData: FileMetaData) => (
              <div key={metaData.id}>
                showModal && <FileModal open={showModal} fileDetails={metaData} fileUrl={fileUrl}/>
              <TableRow key={metaData.id} onDoubleClick={() => handleViewClk(metaData.fileKey)}>
                <TableCell className="font-medium">{metaData.fileKey}</TableCell>
                <TableCell>{new Date(metaData.uploadDate).toLocaleString()}</TableCell>
                <TableCell>{metaData.userEmail}</TableCell>
                <TableCell className=" text-right">
                  <div className=" flex gap-3">
                    <span><HardDrive/></span>Disk
                  </div>
                </TableCell>
              </TableRow>
              </div>
            ))
          )}
        </TableBody>
      </Table>
    );
  }
  