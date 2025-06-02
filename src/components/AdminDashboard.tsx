
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

export type Business = 'Fish' | 'Honey' | 'Mushrooms' | 'All';
export type ViewType = 'dashboard' | 'transactions' | 'suppliers' | 'customers' | 'products' | 'events' | 'compliance';

export const AdminDashboard = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business>('Fish');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        <Header 
          selectedBusiness={selectedBusiness}
          onBusinessChange={setSelectedBusiness}
          currentView={currentView}
        />
        <main className="flex-1 p-6">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};
