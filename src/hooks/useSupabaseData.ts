
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BusinessWithAll, DashboardData } from '@/types/database';

export const useBusinesses = () => {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useTransactions = (businessId?: string) => {
  return useQuery({
    queryKey: ['transactions', businessId],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useProducts = (businessId?: string) => {
  return useQuery({
    queryKey: ['products', businessId],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useSuppliers = (businessId?: string) => {
  return useQuery({
    queryKey: ['suppliers', businessId],
    queryFn: async () => {
      let query = supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useEmployees = (businessId?: string) => {
  return useQuery({
    queryKey: ['employees', businessId],
    queryFn: async () => {
      let query = supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useDashboardData = (selectedBusiness: BusinessWithAll) => {
  return useQuery({
    queryKey: ['dashboard', selectedBusiness],
    queryFn: async (): Promise<DashboardData> => {
      let transactionQuery = supabase
        .from('transactions')
        .select('*')
        .eq('type', 'sale');
      
      if (selectedBusiness !== 'All') {
        const businessId = typeof selectedBusiness === 'string' ? selectedBusiness : selectedBusiness.id;
        transactionQuery = transactionQuery.eq('business_id', businessId);
      }
      
      const { data: transactions, error: transactionError } = await transactionQuery;
      
      if (transactionError) throw transactionError;
      
      const currentRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const previousRevenue = currentRevenue * 0.85;
      
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('*');
      
      if (businessError) throw businessError;
      
      const businessData = await Promise.all(
        (businesses || []).map(async (business) => {
          const { data: businessTransactions } = await supabase
            .from('transactions')
            .select('*')
            .eq('business_id', business.id)
            .eq('type', 'sale');
          
          const revenue = businessTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
          const transactionCount = businessTransactions?.length || 0;
          
          return {
            name: business.name,
            revenue,
            transactions: transactionCount
          };
        })
      );
      
      const topBusiness = businessData.reduce((prev, current) => 
        prev.revenue > current.revenue ? prev : current, 
        businessData[0] || { name: '', revenue: 0, transactions: 0 }
      );
      
      return {
        currentRevenue,
        previousRevenue,
        businessData,
        topBusiness,
        recentTransactions: transactions?.slice(0, 5) || [],
      };
    },
  });
};

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (businessData: { name: string; type: string; description?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('businesses')
        .insert([{
          ...businessData,
          owner_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
};
