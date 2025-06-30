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
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export type Business = 'Fish' | 'Honey' | 'Mushrooms' | 'All';
export type ViewType = 'dashboard' | 'transactions' | 'suppliers' | 'customers' | 'products' | 'events' | 'compliance' | 'employees';

export const AdminDashboard = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business>('Fish');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return selectedBusiness === 'All' ? 
          <DashboardOverview selectedBusiness={selectedBusiness} /> :
          <BusinessView business={selectedBusiness} />;
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
      default:
        return <DashboardOverview selectedBusiness={selectedBusiness} />;
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
          <Header 
            selectedBusiness={selectedBusiness}
            onBusinessChange={setSelectedBusiness}
            currentView={currentView}
          />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <User size={16} />
              <span>{user?.name} ({user?.role})</span>
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
