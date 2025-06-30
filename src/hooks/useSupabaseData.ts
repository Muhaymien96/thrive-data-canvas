
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import type { BusinessWithAll, DashboardData } from '@/types/database';

export const useBusinesses = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('businesses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'businesses'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['businesses'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching businesses:', error);
        throw error;
      }
      return data || [];
    },
  });
};

export const useTransactions = (businessId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['transactions', businessId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, businessId]);

  return useQuery({
    queryKey: ['transactions', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('transactions')
        .select(`
          *,
          businesses!inner(owner_id)
        `)
        .eq('businesses.owner_id', user.id)
        .order('date', { ascending: false });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      return data || [];
    },
  });
};

export const useProducts = (businessId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['products', businessId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, businessId]);

  return useQuery({
    queryKey: ['products', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('products')
        .select(`
          *,
          businesses!inner(owner_id)
        `)
        .eq('businesses.owner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      return data || [];
    },
  });
};

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
        .order('created_at', { ascending: false });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
      }
      return data || [];
    },
  });
};

export const useEmployees = (businessId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('employees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['employees', businessId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, businessId]);

  return useQuery({
    queryKey: ['employees', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('employees')
        .select(`
          *,
          businesses!inner(owner_id)
        `)
        .eq('businesses.owner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (businessId && businessId !== 'All') {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
      return data || [];
    },
  });
};

export const useDashboardData = (selectedBusiness: BusinessWithAll) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channels = [
      supabase
        .channel('dashboard-transactions')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions'
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard', selectedBusiness] });
          }
        ),
      supabase
        .channel('dashboard-businesses')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'businesses'
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard', selectedBusiness] });
          }
        )
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [queryClient, selectedBusiness]);

  return useQuery({
    queryKey: ['dashboard', selectedBusiness],
    queryFn: async (): Promise<DashboardData> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let transactionQuery = supabase
        .from('transactions')
        .select(`
          *,
          businesses!inner(owner_id)
        `)
        .eq('businesses.owner_id', user.id)
        .eq('type', 'sale');
      
      if (selectedBusiness !== 'All') {
        transactionQuery = transactionQuery.eq('business_id', selectedBusiness.id);
      }
      
      const { data: transactions, error: transactionError } = await transactionQuery;
      
      if (transactionError) {
        console.error('Error fetching transactions:', transactionError);
        throw transactionError;
      }
      
      const currentRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const previousRevenue = currentRevenue * 0.85;
      
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id);
      
      if (businessError) {
        console.error('Error fetching businesses:', businessError);
        throw businessError;
      }
      
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
          name: businessData.name,
          type: businessData.type,
          description: businessData.description || '',
          owner_id: user.id
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating business:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
