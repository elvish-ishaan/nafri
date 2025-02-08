'use client'

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void; // Separate function for handling modal close
  onAction?: () => void; // Optional action for button click
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footerBtn?: string;
}

export function PricingModal({
  open,
  onClose,
 
  children,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className=" min-w-fit">
        {children}
      </DialogContent>
    </Dialog>
  );
}
