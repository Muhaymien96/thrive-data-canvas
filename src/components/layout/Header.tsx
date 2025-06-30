
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Business, ViewType } from '@/components/AdminDashboard';

interface HeaderProps {
  selectedBusiness: Business | 'All';
  onBusinessChange: (business: Business) => void;
  currentView: ViewType;
}

const businesses: (Business | 'All')[] = ['All', 'Fish', 'Honey', 'Mushrooms'];

const viewTitles: Record<ViewType, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  suppliers: 'Suppliers',
  customers: 'Customers',
  products: 'Products',
  employees: 'Employees',
  events: 'Events',
  compliance: 'Compliance',
};

export const Header = ({ selectedBusiness, onBusinessChange, currentView }: HeaderProps) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        {viewTitles[currentView]}
      </h1>
      <div className="flex items-center space-x-4 mt-2">
        <p className="text-sm text-slate-600">
          Manage your business operations efficiently
        </p>
        <div className="flex items-center space-x-2">
          <label htmlFor="business-select" className="text-sm font-medium text-slate-700">
            Business:
          </label>
          <Select
            value={selectedBusiness}
            onValueChange={(value) => onBusinessChange(value as Business)}
          >
            <SelectTrigger id="business-select" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {businesses.map((business) => (
                <SelectItem key={business} value={business}>
                  {business}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
