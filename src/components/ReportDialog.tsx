import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useReportListing, type ReportReason } from '@/hooks/useReportListing';

const REASONS: { value: ReportReason; label: string }[] = [
  { value: 'spam', label: 'Спам' },
  { value: 'scam', label: 'Шахрайство' },
  { value: 'inappropriate', label: 'Неприйнятний вміст' },
  { value: 'other', label: 'Інше' },
];

interface ReportDialogProps {
  listingId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportDialog({ listingId, open, onOpenChange }: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason>('spam');
  const [description, setDescription] = useState('');
  const { submitReport, loading } = useReportListing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingId) return;
    const ok = await submitReport(listingId, reason, description);
    if (ok) {
      setReason('spam');
      setDescription('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Повідомити про оголошення</DialogTitle>
          <DialogDescription>Вкажіть причину скарги на це оголошення.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <RadioGroup value={reason} onValueChange={(v) => setReason(v as ReportReason)}>
            {REASONS.map((r) => (
              <div key={r.value} className="flex items-center gap-2">
                <RadioGroupItem value={r.value} id={`reason-${r.value}`} />
                <Label htmlFor={`reason-${r.value}`} className="cursor-pointer">{r.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <div>
            <Label htmlFor="report-desc" className="text-sm text-muted-foreground mb-1 block">
              Опис (необов'язково)
            </Label>
            <Textarea
              id="report-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Додаткові деталі..."
              maxLength={1000}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Надсилаємо...' : 'Надіслати скаргу'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
