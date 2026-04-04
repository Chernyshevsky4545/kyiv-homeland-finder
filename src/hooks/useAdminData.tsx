import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useDeletedListings() {
  const { data: deletedIds = [], isLoading } = useQuery({
    queryKey: ['deleted-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deleted_listings')
        .select('listing_id');
      if (error) throw error;
      return data.map((d) => d.listing_id);
    },
  });

  return { deletedIds, isLoading };
}

export function useUserRole() {
  const { user } = useAuth();

  const { data: isAdmin = false, isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');
      if (error) return false;
      return (data?.length ?? 0) > 0;
    },
    enabled: !!user,
  });

  return { isAdmin, isLoading };
}
