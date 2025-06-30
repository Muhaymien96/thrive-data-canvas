
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCustomerTransactions = (customerId?: string) => {
  return useQuery({
    queryKey: ['customer-transactions', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching customer transactions:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!customerId,
  });
};

export const useSupplierTransactions = (supplierId?: string) => {
  return useQuery({
    queryKey: ['supplier-transactions', supplierId],
    queryFn: async () => {
      if (!supplierId) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching supplier transactions:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!supplierId,
  });
};
