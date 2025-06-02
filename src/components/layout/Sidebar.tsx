
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard,
  Receipt,
  Truck,
  Users,
  Package,
  Calendar,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import type { ViewType } from '@/components/AdminDashboard';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions' as ViewType, label: 'Transactions', icon: Receipt },
  { id: 'suppliers' as ViewType, label: 'Suppliers', icon: Truck },
  { id: 'customers' as ViewType, label: 'Customers', icon: Users },
  { id: 'products' as ViewType, label: 'Products', icon: Package },
  { id: 'events' as ViewType, label: 'Events', icon: Calendar },
];

export const Sidebar = ({ currentView, onViewChange, collapsed, onToggleCollapse }: SidebarProps) => {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 shadow-sm transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h1 className="text-xl font-bold text-slate-900">BusinessHub</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="text-slate-600 hover:text-slate-900"
            >
              {collapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2" role="list">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant={currentView === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left",
                    collapsed ? "px-2" : "px-4",
                    currentView === item.id && "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                  onClick={() => onViewChange(item.id)}
                  aria-current={currentView === item.id ? "page" : undefined}
                >
                  <item.icon size={20} className={cn(collapsed ? "mx-auto" : "mr-3")} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
