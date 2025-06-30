
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Invoice, InvoiceItem } from '@/types/database';

export const useInvoices = (businessId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('invoices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['invoices', businessId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, businessId]);

  return useQuery({
    queryKey: ['invoices', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('invoices')
        .select(`
          *,
          businesses!inner(owner_id)
        `)
        .eq('businesses.owner_id', user.id)
        .order('issue_date', { ascending: false });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
      }
      
      return data as Invoice[];
    },
    enabled: true,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating invoice:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Invoice Created",
        description: `Successfully created invoice ${data.invoice_number}`,
      });
    },
    onError: (error) => {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    },
  });
};
