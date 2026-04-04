import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type ReportReason = 'spam' | 'scam' | 'inappropriate' | 'other';

export function useReportListing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const submitReport = async (listingId: number, reason: ReportReason, description?: string) => {
    if (!user) {
      toast.error('Увійдіть, щоб повідомити про оголошення');
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('listing_reports').insert({
        listing_id: listingId,
        user_id: user.id,
        reason,
        description: description || null,
      });

      if (error) {
        if (error.code === '23505') {
          toast.warning('Ви вже повідомляли про це оголошення');
        } else {
          toast.error('Помилка при відправці скарги');
        }
        return false;
      }

      toast.success('Скаргу надіслано. Дякуємо!');
      return true;
    } finally {
      setLoading(false);
    }
  };

  return { submitReport, loading };
}
