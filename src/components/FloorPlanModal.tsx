import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface FloorPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title: string;
}

export function FloorPlanModal({ open, onOpenChange, imageUrl, title }: FloorPlanModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-2">
        <DialogHeader className="px-4 pt-2">
          <DialogTitle>Планування — {title}</DialogTitle>
        </DialogHeader>
        <img
          src={imageUrl}
          alt={`Планування ${title}`}
          className="w-full max-h-[75vh] object-contain rounded-lg"
          loading="lazy"
        />
      </DialogContent>
    </Dialog>
  );
}
