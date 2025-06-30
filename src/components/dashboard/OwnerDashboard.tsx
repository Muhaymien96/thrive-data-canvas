
import React, { useState } from 'react';
import { OwnerLayout, OwnerViewType } from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getMonthlyRevenue, getBusinessMetrics } from '@/lib/mockData';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, AlertTriangle } from 'lucide-react';

export const OwnerDashboard = () => {
  const [currentView, setCurrentView] = useState<OwnerViewType>('portfolio');

  // Portfolio overview data
  const portfolioData = [
    { business: 'Fish', revenue: getMonthlyRevenue('Fish'), growth: 12.5, color: '#3B82F6' },
    { business: 'Honey', revenue: getMonthlyRevenue('Honey'), growth: 8.3, color: '#F59E0B' },
    { business: 'Mushrooms', revenue: getMonthlyRevenue('Mushrooms'), growth: -2.1, color: '#10B981' },
  ];

  const totalRevenue = portfolioData.reduce((sum, b) => sum + b.revenue, 0);
  const avgGrowth = portfolioData.reduce((sum, b) => sum + b.growth, 0) / portfolioData.length;

  // Monthly trend data
  const monthlyTrend = [
    { month: 'Jan', revenue: 85000 },
    { month: 'Feb', revenue: 92000 },
    { month: 'Mar', revenue: 88000 },
    { month: 'Apr', revenue: 95000 },
    { month: 'May', revenue: 101000 },
    { month: 'Jun', revenue: totalRevenue },
  ];

  // Key insights
  const insights = [
    {
      type: 'success',
      icon: TrendingUp,
      title: 'Strong Fish Business Performance',
      description: 'Fish business showing 12.5% growth, highest in portfolio',
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Mushroom Business Decline',
      description: 'Mushroom revenue down 2.1%, requires attention',
    },
    {
      type: 'info',
      icon: DollarSign,
      title: 'Revenue Milestone',
      description: `Portfolio crossed R${(totalRevenue/1000).toFixed(0)}K monthly revenue`,
    },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'portfolio':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                    <DollarSign size={16} className="mr-2" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">R{totalRevenue.toLocaleString()}</div>
                  <div className={`flex items-center text-sm mt-1 ${avgGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {avgGrowth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="ml-1">{avgGrowth.toFixed(1)}% avg growth</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                    <Package size={16} className="mr-2" />
                    Active Businesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">3</div>
                  <p className="text-xs text-slate-600 mt-1">All operational</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                    <TrendingUp size={16} className="mr-2" />
                    Best Performer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-slate-900">Fish Business</div>
                  <p className="text-xs text-slate-600 mt-1">+12.5% growth</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                    <AlertTriangle size={16} className="mr-2" />
                    Needs Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-slate-900">Mushrooms</div>
                  <p className="text-xs text-slate-600 mt-1">-2.1% decline</p>
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
                    <BarChart data={portfolioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="business" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R${value.toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6-Month Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R${value.toLocaleString()}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Business Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Business Portfolio Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {portfolioData.map((business) => (
                    <div key={business.business} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-900">{business.business}</h3>
                        <div className={`flex items-center text-sm ${business.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {business.growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span className="ml-1">{business.growth.toFixed(1)}%</span>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">R{business.revenue.toLocaleString()}</p>
                      <p className="text-sm text-slate-600">{((business.revenue / totalRevenue) * 100).toFixed(1)}% of portfolio</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights & Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      insight.type === 'success' ? 'border-l-green-500 bg-green-50' :
                      insight.type === 'warning' ? 'border-l-orange-500 bg-orange-50' :
                      'border-l-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <insight.icon size={20} className={
                          insight.type === 'success' ? 'text-green-600' :
                          insight.type === 'warning' ? 'text-orange-600' :
                          'text-blue-600'
                        } />
                        <div>
                          <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cross-Business Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Detailed analytics across all business units coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Executive Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Executive reporting dashboard coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'insights':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">AI-powered business insights coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <OwnerLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </OwnerLayout>
  );
};
