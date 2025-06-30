
import { useQuery } from '@tanstack/react-query';
import { mockTransactions, mockSuppliers, mockCustomers, getMonthlyRevenue, getBusinessMetrics } from '@/lib/mockData';
import type { Business, BusinessWithAll } from '@/types/transaction';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useTransactions = (business?: string) => {
  return useQuery({
    queryKey: ['transactions', business],
    queryFn: async () => {
      await delay(800);
      if (business && business !== 'All') {
        return mockTransactions.filter(t => t.business === business);
      }
      return mockTransactions;
    },
  });
};

export const useSuppliers = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      await delay(600);
      return mockSuppliers;
    },
  });
};

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      await delay(700);
      return mockCustomers;
    },
  });
};

export const useBusinessMetrics = (business: Business) => {
  return useQuery({
    queryKey: ['business-metrics', business],
    queryFn: async () => {
      await delay(500);
      return getBusinessMetrics(business);
    },
  });
};

export const useDashboardData = (selectedBusiness: BusinessWithAll) => {
  return useQuery({
    queryKey: ['dashboard', selectedBusiness],
    queryFn: async () => {
      await delay(900);
      const currentRevenue = getMonthlyRevenue(selectedBusiness);
      const businessData = [
        { name: 'Fish', revenue: getMonthlyRevenue('Fish'), transactions: getBusinessMetrics('Fish').transactionCount },
        { name: 'Honey', revenue: getMonthlyRevenue('Honey'), transactions: getBusinessMetrics('Honey').transactionCount },
        { name: 'Mushrooms', revenue: getMonthlyRevenue('Mushrooms'), transactions: getBusinessMetrics('Mushrooms').transactionCount },
      ];
      
      return {
        currentRevenue,
        previousRevenue: currentRevenue * 0.85,
        businessData,
        topBusiness: businessData.reduce((prev, current) => prev.revenue > current.revenue ? prev : current),
        recentTransactions: mockTransactions.slice(0, 5),
      };
    },
  });
};
