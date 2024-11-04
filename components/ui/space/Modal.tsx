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
import React from "react";

interface ModalProps {
  open: boolean;
  onClickFn: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
  footerBtn: string;
}

export function Modal({ open, onClickFn, title, description, children, footerBtn }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClickFn()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button type="button" onClick={onClickFn}>{footerBtn}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
