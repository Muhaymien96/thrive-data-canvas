
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { TransactionInsert } from '@/types/database';

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactionData: TransactionInsert) => {
      console.log('Creating transaction with data:', transactionData);

      // Validate required fields
      if (!transactionData.business_id) {
        throw new Error('Business ID is required');
      }

      if (!transactionData.type) {
        throw new Error('Transaction type is required');
      }

      if (transactionData.amount === null || transactionData.amount === undefined) {
        throw new Error('Transaction amount is required');
      }

      // Ensure required fields are present and valid payment_status
      const completeTransactionData = {
        ...transactionData,
        amount: transactionData.amount || 0,
        date: transactionData.date || new Date().toISOString().split('T')[0],
        type: transactionData.type,
        business_id: transactionData.business_id,
        // Ensure payment_status is one of the allowed values
        payment_status: ['paid', 'pending', 'overdue', 'partial'].includes(transactionData.payment_status || 'pending') 
          ? (transactionData.payment_status || 'pending')
          : 'pending',
        // Handle employee fields for salary transactions
        employee_id: transactionData.employee_id || null,
        employee_name: transactionData.employee_name || null,
        hourly_rate: transactionData.hourly_rate || null,
        hours_worked: transactionData.hours_worked || null,
        cost_type: transactionData.cost_type || null
      };

      console.log('Final transaction data being sent:', completeTransactionData);

      const { data, error } = await supabase
        .from('transactions')
        .insert(completeTransactionData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating transaction:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['customer-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-transactions'] });
      console.log('Transaction created successfully:', data);
      
      const transactionType = data.type === 'salary' ? 'employee cost' : data.type;
      toast({
        title: "Transaction Created",
        description: `Successfully created ${transactionType} transaction for R${data.amount.toLocaleString()}`,
      });
    },
    onError: (error: any) => {
      console.error('Error creating transaction:', error);
      
      let errorMessage = "Failed to create transaction. Please check your inputs and try again.";
      
      // Handle specific error cases
      if (error.message?.includes('violates check constraint')) {
        if (error.message.includes('transactions_type_check')) {
          errorMessage = "Invalid transaction type. Please select a valid type (sale, expense, salary, refund).";
        }
      } else if (error.message?.includes('not-null constraint')) {
        errorMessage = "Missing required information. Please fill in all required fields.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
