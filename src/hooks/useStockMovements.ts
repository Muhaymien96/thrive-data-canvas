
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { StockMovement } from '@/types/database';

export const useStockMovements = (businessId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('stock-movements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_movements'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['stock-movements', businessId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, businessId]);

  return useQuery({
    queryKey: ['stock-movements', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('stock_movements')
        .select(`
          *,
          products(name),
          businesses!inner(owner_id)
        `)
        .eq('businesses.owner_id', user.id)
        .order('date', { ascending: false });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching stock movements:', error);
        throw error;
      }
      
      return data as (StockMovement & { products: { name: string } })[];
    },
    enabled: true,
  });
};

export const useCreateStockMovement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (movementData: Omit<StockMovement, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('stock_movements')
        .insert([movementData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating stock movement:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Stock Movement Recorded",
        description: "Stock movement has been successfully recorded.",
      });
    },
    onError: (error) => {
      console.error('Error creating stock movement:', error);
      toast({
        title: "Error",
        description: "Failed to record stock movement. Please try again.",
        variant: "destructive",
      });
    },
  });
};
