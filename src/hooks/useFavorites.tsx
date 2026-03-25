import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favoriteIds = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map((f) => f.listing_id);
    },
    enabled: !!user,
  });

  const addFavorite = useMutation({
    mutationFn: async (listingId: number) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, listing_id: listingId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Додано до обраного');
    },
    onError: () => toast.error('Помилка додавання'),
  });

  const removeFavorite = useMutation({
    mutationFn: async (listingId: number) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Видалено з обраного');
    },
    onError: () => toast.error('Помилка видалення'),
  });

  const toggleFavorite = (listingId: number) => {
    if (favoriteIds.includes(listingId)) {
      removeFavorite.mutate(listingId);
    } else {
      addFavorite.mutate(listingId);
    }
  };

  const isFavorite = (listingId: number) => favoriteIds.includes(listingId);

  return { favoriteIds, isLoading, toggleFavorite, isFavorite };
}
