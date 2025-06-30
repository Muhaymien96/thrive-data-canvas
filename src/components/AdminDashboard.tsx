
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
import { BusinessOnboarding } from '@/components/business/BusinessOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinesses } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Building2, Plus } from 'lucide-react';
import type { BusinessWithAll } from '@/types/database';

export type ViewType = 'dashboard' | 'transactions' | 'suppliers' | 'customers' | 'products' | 'events' | 'compliance' | 'employees' | 'business';

export const AdminDashboard = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithAll>('All');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showBusinessOnboarding, setShowBusinessOnboarding] = useState(false);
  const { user, logout } = useAuth();
  const { data: businesses = [], isLoading, refetch } = useBusinesses();

  // Show loading state while fetching businesses
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your businesses...</p>
        </div>
      </div>
    );
  }

  // Show onboarding modal if user has no businesses and they want to create one
  if (showBusinessOnboarding) {
    return (
      <BusinessOnboarding 
        onBusinessCreated={() => {
          setShowBusinessOnboarding(false);
          refetch();
        }}
      />
    );
  }

  // Business selection logic
  React.useEffect(() => {
    if (businesses.length === 1 && selectedBusiness === 'All') {
      setSelectedBusiness(businesses[0]);
    } else if (businesses.length > 1 && selectedBusiness !== 'All' && !businesses.find(b => b.id === (selectedBusiness as any)?.id)) {
      setSelectedBusiness('All');
    }
  }, [businesses, selectedBusiness]);

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
      case 'business':
        return <BusinessManagementView selectedBusiness={selectedBusiness} />;
      default:
        return <DashboardOverview selectedBusiness={selectedBusiness} />;
    }
  };

  // If no businesses exist, show welcome screen with option to create business
  if (businesses.length === 0) {
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
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Welcome to VentureHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <User size={16} />
                <span>{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-2">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
          <main className="flex-1 p-6 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <p className="text-sm text-slate-600 mt-2">
                  You haven't created any businesses yet. Create your first business to start managing your operations.
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowBusinessOnboarding(true)}
                  className="w-full flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Create Your First Business</span>
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

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
              <span>{user?.email}</span>
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
