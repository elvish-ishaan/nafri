"use client"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { Separator } from "../separator";
import ReactPlayer from 'react-player'


export function FileModal({ open,fileDetails,fileUrl }: {open: boolean, fileUrl: string, fileDetails:{
  fileKey: string,
  userEmail: string,
  fileType: string,
  id: string,
  uploadDate: string
}}) {
  return (
    // fix diolog not closing
    <Dialog open={open} onOpenChange={(open) => !open} >     
      <DialogContent className=" min-h-screen min-w-full">
        <DialogHeader className=" mt-5">
          <div className=" flex justify-between">
            <div className=" flex flex-col gap-1">
            <DialogTitle>{ fileDetails.fileKey }</DialogTitle>
            <DialogDescription>{new Date(fileDetails.uploadDate).toLocaleString()}</DialogDescription>
            </div>
            
            <div>
              <DialogClose>close</DialogClose>
            </div>
          </div>
        </DialogHeader>
        <Separator/>
        <div className=" w-full flex justify-center items-center">
        {
          fileDetails?.fileType === 'jpg' && (
            <Image src={fileUrl} height={200} width={200} alt="hello" />
          )
        }
        {
          fileDetails?.fileType === 'mp4' && (
            <ReactPlayer url={fileUrl} controls={true}/>
          )
        }
        </div>
      </DialogContent>
    </Dialog>
  );
}
