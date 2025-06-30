
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboardData } from '@/hooks/useSupabaseData';
import { ArrowUp, ArrowDown, TrendingUp, BarChart3 } from 'lucide-react';
import type { BusinessWithAll } from '@/types/database';

interface DashboardOverviewProps {
  selectedBusiness: BusinessWithAll;
}

export const DashboardOverview = ({ selectedBusiness }: DashboardOverviewProps) => {
  const { data: dashboardData, isLoading, error } = useDashboardData(selectedBusiness);

  // Expense breakdown (mock data for now)
  const expenseData = [
    { name: 'Supplies', value: 40, color: '#8B5CF6' },
    { name: 'Labor', value: 30, color: '#06B6D4' },
    { name: 'Marketing', value: 15, color: '#10B981' },
    { name: 'Operations', value: 15, color: '#F59E0B' },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading dashboard data. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No data available</h3>
              <p className="text-slate-500">
                Start by adding transactions to see your business insights.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const revenueChange = dashboardData.previousRevenue > 0 
    ? ((dashboardData.currentRevenue - dashboardData.previousRevenue) / dashboardData.previousRevenue * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              R{dashboardData.currentRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 mt-1">This period</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Net Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-slate-900">
                R{dashboardData.currentRevenue.toLocaleString()}
              </div>
              {revenueChange !== 0 && (
                <div className={`flex items-center text-sm ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span>{Math.abs(revenueChange).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1">vs previous period</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Top Performing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-purple-600" size={20} />
              <div>
                <div className="text-lg font-bold text-slate-900">
                  {dashboardData.topBusiness.name || 'N/A'}
                </div>
                <p className="text-xs text-slate-600">
                  R{dashboardData.topBusiness.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.businessData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.businessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? `R${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Transactions'
                  ]} />
                  <Bar dataKey="revenue" fill="#3B82F6" name="revenue" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-500">
                No business data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-4 font-medium text-slate-600">Date</th>
                    <th className="text-left py-2 px-4 font-medium text-slate-600">Type</th>
                    <th className="text-left py-2 px-4 font-medium text-slate-600">Amount</th>
                    <th className="text-left py-2 px-4 font-medium text-slate-600">Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-100">
                      <td className="py-2 px-4 text-sm">{transaction.date}</td>
                      <td className="py-2 px-4 text-sm capitalize">{transaction.type}</td>
                      <td className="py-2 px-4 text-sm font-medium">
                        R{transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {transaction.customer_name || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No recent transactions found. Start by adding your first transaction.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
