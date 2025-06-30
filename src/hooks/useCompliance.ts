
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { ComplianceItem } from '@/types/database';

export const useComplianceItems = (businessId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('compliance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'compliance_items'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['compliance', businessId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, businessId]);

  return useQuery({
    queryKey: ['compliance', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('compliance_items')
        .select(`
          *,
          businesses!inner(owner_id)
        `)
        .eq('businesses.owner_id', user.id)
        .order('due_date', { ascending: true });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching compliance items:', error);
        throw error;
      }
      
      return data as ComplianceItem[];
    },
    enabled: true,
  });
};

export const useCreateComplianceItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemData: Omit<ComplianceItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('compliance_items')
        .insert([itemData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating compliance item:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['compliance'] });
      toast({
        title: "Compliance Item Added",
        description: `Successfully added ${data.title}`,
      });
    },
    onError: (error) => {
      console.error('Error creating compliance item:', error);
      toast({
        title: "Error",
        description: "Failed to add compliance item. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateComplianceItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<ComplianceItem>) => {
      const { data, error } = await supabase
        .from('compliance_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating compliance item:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['compliance'] });
      toast({
        title: "Compliance Item Updated",
        description: `Successfully updated ${data.title}`,
      });
    },
    onError: (error) => {
      console.error('Error updating compliance item:', error);
      toast({
        title: "Error",
        description: "Failed to update compliance item. Please try again.",
        variant: "destructive",
      });
    },
  });
};
