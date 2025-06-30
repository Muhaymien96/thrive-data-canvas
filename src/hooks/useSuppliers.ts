
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Supplier, SupplierInsert } from '@/types/database';

export const useSuppliers = (businessId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('suppliers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'suppliers'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['suppliers', businessId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, businessId]);

  return useQuery({
    queryKey: ['suppliers', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('suppliers')
        .select(`
          *,
          businesses!inner(owner_id)
        `)
        .eq('businesses.owner_id', user.id)
        .order('name', { ascending: true });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
      }
      
      return data as Supplier[];
    },
    enabled: true,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (supplierData: SupplierInsert) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating supplier:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Supplier Added",
        description: `Successfully added supplier ${data.name}`,
      });
    },
    onError: (error) => {
      console.error('Error creating supplier:', error);
      toast({
        title: "Error",
        description: "Failed to add supplier. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...supplierData }: Partial<Supplier> & { id: string }) => {
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplierData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating supplier:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Supplier Updated",
        description: `Successfully updated supplier ${data.name}`,
      });
    },
    onError: (error) => {
      console.error('Error updating supplier:', error);
      toast({
        title: "Error",
        description: "Failed to update supplier. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting supplier:', error);
        throw error;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Supplier Deleted",
        description: "Successfully deleted supplier",
      });
    },
    onError: (error) => {
      console.error('Error deleting supplier:', error);
      toast({
        title: "Error",
        description: "Failed to delete supplier. Please try again.",
        variant: "destructive",
      });
    },
  });
};
