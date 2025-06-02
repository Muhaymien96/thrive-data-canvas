
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getMonthlyRevenue, getBusinessMetrics, mockTransactions } from '@/lib/mockData';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

interface DashboardOverviewProps {
  selectedBusiness: string;
}

export const DashboardOverview = ({ selectedBusiness }: DashboardOverviewProps) => {
  const currentRevenue = getMonthlyRevenue(selectedBusiness);
  const previousRevenue = currentRevenue * 0.85; // Mock previous month data
  const revenueChange = ((currentRevenue - previousRevenue) / previousRevenue * 100);
  
  // Business comparison data
  const businessData = [
    { name: 'Fish', revenue: getMonthlyRevenue('Fish'), transactions: getBusinessMetrics('Fish').transactionCount },
    { name: 'Honey', revenue: getMonthlyRevenue('Honey'), transactions: getBusinessMetrics('Honey').transactionCount },
    { name: 'Mushrooms', revenue: getMonthlyRevenue('Mushrooms'), transactions: getBusinessMetrics('Mushrooms').transactionCount },
  ];

  // Top performing business
  const topBusiness = businessData.reduce((prev, current) => 
    prev.revenue > current.revenue ? prev : current
  );

  // Expense breakdown (mock data)
  const expenseData = [
    { name: 'Supplies', value: 40, color: '#8B5CF6' },
    { name: 'Labor', value: 30, color: '#06B6D4' },
    { name: 'Marketing', value: 15, color: '#10B981' },
    { name: 'Operations', value: 15, color: '#F59E0B' },
  ];

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
              R{currentRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Net Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-slate-900">
                R{currentRevenue.toLocaleString()}
              </div>
              <div className={`flex items-center text-sm ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span>{Math.abs(revenueChange).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-1">vs previous month</p>
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
                <div className="text-lg font-bold text-slate-900">{topBusiness.name}</div>
                <p className="text-xs text-slate-600">R{topBusiness.revenue.toLocaleString()}</p>
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={businessData}>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Date</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Business</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Type</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Amount</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Customer</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-100">
                    <td className="py-2 px-4 text-sm">{transaction.date}</td>
                    <td className="py-2 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.business === 'Fish' ? 'bg-blue-100 text-blue-800' :
                        transaction.business === 'Honey' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {transaction.business}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm capitalize">{transaction.type}</td>
                    <td className="py-2 px-4 text-sm font-medium">R{transaction.amount.toLocaleString()}</td>
                    <td className="py-2 px-4 text-sm">{transaction.customer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
