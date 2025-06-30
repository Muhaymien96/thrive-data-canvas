
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBusinesses } from '@/hooks/useSupabaseData';
import type { Business, BusinessWithAll } from '@/types/database';
import type { ViewType } from '@/components/AdminDashboard';

interface HeaderProps {
  selectedBusiness: BusinessWithAll;
  onBusinessChange: (business: BusinessWithAll) => void;
  currentView: ViewType;
}

const viewTitles: Record<ViewType, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  suppliers: 'Suppliers',
  customers: 'Customers',
  products: 'Products',
  employees: 'Employees',
  events: 'Events',
  compliance: 'Compliance',
  business: 'Business Management',
};

export const Header = ({ selectedBusiness, onBusinessChange, currentView }: HeaderProps) => {
  const { data: businesses = [] } = useBusinesses();

  const getBusinessDisplayValue = (business: BusinessWithAll): string => {
    if (business === 'All') return 'All';
    return business.name;
  };

  const handleBusinessChange = (value: string) => {
    if (value === 'All') {
      onBusinessChange('All');
    } else {
      const business = businesses.find(b => b.id === value);
      if (business) {
        onBusinessChange(business);
      }
    }
  };

  const getCurrentValue = (): string => {
    if (selectedBusiness === 'All') return 'All';
    return selectedBusiness.id;
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        {viewTitles[currentView]}
      </h1>
      <div className="flex items-center space-x-4 mt-2">
        <p className="text-sm text-slate-600">
          Manage your business operations efficiently with VentureHub
        </p>
        <div className="flex items-center space-x-2">
          <label htmlFor="business-select" className="text-sm font-medium text-slate-700">
            Business:
          </label>
          <Select
            value={getCurrentValue()}
            onValueChange={handleBusinessChange}
          >
            <SelectTrigger id="business-select" className="w-32">
              <SelectValue>{getBusinessDisplayValue(selectedBusiness)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {businesses.map((business) => (
                <SelectItem key={business.id} value={business.id}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
