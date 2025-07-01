import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { BusinessView } from '@/components/dashboard/BusinessView';
import { TransactionsView } from '@/components/transactions/TransactionsView';
import { SuppliersView } from '@/components/crm/SuppliersView';
import { CustomersView } from '@/components/crm/CustomersView';
import { ProductsView } from '@/components/products/ProductsView';
import { EventsView } from '@/components/events/EventsView';
import { ComplianceView } from '@/components/compliance/ComplianceView';
import { EmployeesView } from '@/components/employees/EmployeesView';
import { BusinessManagementView } from '@/components/business/BusinessManagementView';
import { AccessRequestsView } from '@/components/business/AccessRequestsView';
import { WelcomeDashboard } from '@/components/dashboard/WelcomeDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Building2, ArrowLeftRight } from 'lucide-react';
import type { Business } from '@/types/database';

export type ViewType = 'dashboard' | 'transactions' | 'suppliers' | 'customers' | 'products' | 'events' | 'compliance' | 'employees' | 'business' | 'access-requests';

interface AdminDashboardProps {
  selectedBusiness?: Business;
  onBusinessCreated?: (business: Business) => void;
}

export const AdminDashboard = ({ selectedBusiness, onBusinessCreated }: AdminDashboardProps) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout, accessibleBusinesses, currentBusinessUser } = useAuth();

  // If no business is selected, show the welcome dashboard
  if (!selectedBusiness) {
    return <WelcomeDashboard onBusinessCreated={onBusinessCreated} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <BusinessView business={selectedBusiness} />;
      case 'transactions':
        return <TransactionsView selectedBusiness={selectedBusiness} />;
      case 'suppliers':
        return <SuppliersView selectedBusiness={selectedBusiness} />;
      case 'customers':
        return <CustomersView selectedBusiness={selectedBusiness} />;
      case 'products':
        return <ProductsView selectedBusiness={selectedBusiness} />;
      case 'events':
        return <EventsView selectedBusiness={selectedBusiness} />;
      case 'compliance':
        return <ComplianceView selectedBusiness={selectedBusiness} />;
      case 'employees':
        return <EmployeesView selectedBusiness={selectedBusiness} />;
      case 'business':
        return <BusinessManagementView selectedBusiness={selectedBusiness} />;
      case 'access-requests':
        return <AccessRequestsView businessId={selectedBusiness.id} />;
      default:
        return <BusinessView business={selectedBusiness} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      <Sidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{selectedBusiness.name}</h1>
              <p className="text-sm text-slate-600">{selectedBusiness.type}</p>
            </div>
            {accessibleBusinesses.length > 1 && (
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeftRight className="h-4 w-4" />
                <span>Switch Business</span>
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <User size={16} />
              <span>{currentBusinessUser?.email || user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-2">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
        <main className="flex-1 p-6">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};
