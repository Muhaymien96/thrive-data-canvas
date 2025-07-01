
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  TrendingUp,
  FileText,
  LogOut,
  User,
  ArrowLeft,
  ArrowRight,
  PieChart,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type OwnerViewType = 'portfolio' | 'analytics' | 'reports' | 'insights';

interface OwnerLayoutProps {
  currentView: OwnerViewType;
  onViewChange: (view: OwnerViewType) => void;
  children: React.ReactNode;
}

const ownerNavigationItems = [
  { id: 'portfolio' as OwnerViewType, label: 'Portfolio Overview', icon: LayoutDashboard },
  { id: 'analytics' as OwnerViewType, label: 'Cross-Business Analytics', icon: BarChart3 },
  { id: 'reports' as OwnerViewType, label: 'Executive Reports', icon: FileText },
  { id: 'insights' as OwnerViewType, label: 'Business Insights', icon: TrendingUp },
];

const viewTitles: Record<OwnerViewType, string> = {
  portfolio: 'Business Portfolio Overview',
  analytics: 'Cross-Business Analytics',
  reports: 'Executive Reports',
  insights: 'Business Insights',
};

export const OwnerLayout = ({ currentView, onViewChange, children }: OwnerLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout, currentBusinessUser } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 shadow-sm transition-all duration-300 z-40",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
        role="navigation"
        aria-label="Owner navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h1 className="text-xl font-bold text-slate-900">VentureHub Executive</h1>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="text-slate-600 hover:text-slate-900"
              >
                {sidebarCollapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2" role="list">
              {ownerNavigationItems.map((item) => (
                <li key={item.id}>
                  <Button
                    variant={currentView === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left",
                      sidebarCollapsed ? "px-2" : "px-4",
                      currentView === item.id && "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                    onClick={() => onViewChange(item.id)}
                    aria-current={currentView === item.id ? "page" : undefined}
                  >
                    <item.icon size={20} className={cn(sidebarCollapsed ? "mx-auto" : "mr-3")} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {viewTitles[currentView]}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              VentureHub executive dashboard for business performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <User size={16} />
              <span>{currentBusinessUser?.full_name || user?.email} ({currentBusinessUser?.role || 'user'})</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-2">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
