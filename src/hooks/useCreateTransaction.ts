
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { TransactionInsert } from '@/types/database';

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactionData: TransactionInsert) => {
      // Ensure required fields are present and valid payment_status
      const completeTransactionData = {
        ...transactionData,
        amount: transactionData.amount || 0,
        date: transactionData.date || new Date().toISOString().split('T')[0],
        type: transactionData.type || 'sale',
        business_id: transactionData.business_id,
        // Ensure payment_status is one of the allowed values
        payment_status: ['paid', 'pending', 'overdue', 'partial'].includes(transactionData.payment_status || 'pending') 
          ? (transactionData.payment_status || 'pending')
          : 'pending'
      };

      console.log('Creating transaction with data:', completeTransactionData);

      const { data, error } = await supabase
        .from('transactions')
        .insert(completeTransactionData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['customer-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-transactions'] });
      console.log('Transaction created successfully:', data);
      toast({
        title: "Transaction Created",
        description: `Successfully created ${data.type} transaction for R${data.amount.toLocaleString()}`,
      });
    },
    onError: (error) => {
      console.error('Error creating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to create transaction. Please check your inputs and try again.",
        variant: "destructive",
      });
    },
  });
};
