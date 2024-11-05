"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";

export function FileModal({ open,fileDetails,fileUrl }: any) {
    console.log(fileDetails,'getting file details')
  return (
    <Dialog  open={open} onOpenChange={(isOpen) => !isOpen}>
      <DialogContent className="sm:max-w-[425px] min-h-screen min-w-full">
        <DialogHeader className=" mt-5">
          <div className=" flex justify-between">
            <div className=" flex flex-col gap-1">
            <DialogTitle>{ fileDetails.fileKey }</DialogTitle>
            <DialogDescription>{new Date(fileDetails.uploadDate).toLocaleString()}</DialogDescription>
            </div>
          <div>
            actions
          </div>
          </div>
        </DialogHeader>
        <Image src={fileUrl} height={200} width={200} alt="helo"/>
      </DialogContent>
    </Dialog>
  );
}
