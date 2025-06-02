
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBusinessMetrics } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Business } from '@/components/AdminDashboard';

interface BusinessViewProps {
  business: Business;
}

export const BusinessView = ({ business }: BusinessViewProps) => {
  const metrics = getBusinessMetrics(business);
  
  // Mock weekly data
  const weeklyData = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 800 },
    { day: 'Wed', amount: 1500 },
    { day: 'Thu', amount: 950 },
    { day: 'Fri', amount: 1800 },
    { day: 'Sat', amount: 2200 },
    { day: 'Sun', amount: 1600 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-3xl font-bold text-slate-900">{business} Business</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          business === 'Fish' ? 'bg-blue-100 text-blue-800' :
          business === 'Honey' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          Active
        </span>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              R{metrics.totalSales.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {metrics.transactionCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              R{Math.round(metrics.averageTransaction).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`R${value}`, 'Sales']} />
              <Bar dataKey="amount" fill={
                business === 'Fish' ? '#3B82F6' :
                business === 'Honey' ? '#F59E0B' :
                '#10B981'
              } />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Transactions</CardTitle>
        </CardHeader>
        <CardContent>
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
                {metrics.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-100">
                    <td className="py-2 px-4 text-sm">{transaction.date}</td>
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
