
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useSupabaseData';
import { useProducts } from '@/hooks/useSupabaseData';
import { useCustomers } from '@/hooks/useCustomers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Package, CreditCard } from 'lucide-react';
import type { Business } from '@/types/database';

interface BusinessViewProps {
  business: Business;
}

export const BusinessView = ({ business }: BusinessViewProps) => {
  const { data: dashboardData, isLoading, error } = useDashboardData(business);
  
  // Get business ID for specific business queries
  const businessId = business.id;
  
  // Fetch products and customers data separately
  const { data: products = [] } = useProducts(businessId);
  const { data: customers = [] } = useCustomers(businessId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Loading business data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600">Error loading business data. Please try again later.</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <div className="text-slate-600">No data available for this business.</div>
      </div>
    );
  }

  const revenueChange = dashboardData.previousRevenue > 0 
    ? ((dashboardData.currentRevenue - dashboardData.previousRevenue) / dashboardData.previousRevenue) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Business Overview</h2>
        <p className="text-slate-600">Detailed view for selected business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{dashboardData.currentRevenue.toLocaleString()}</div>
            <p className={`text-xs ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.recentTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Products in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active customers
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dashboardData.businessData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium">{transaction.customer_name || 'Unknown Customer'}</div>
                    <div className="text-sm text-slate-500">{transaction.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">R{transaction.amount.toLocaleString()}</div>
                    <div className="text-sm text-slate-500 capitalize">{transaction.type}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No recent transactions found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
