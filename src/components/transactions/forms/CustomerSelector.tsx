
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { Customer } from '@/types/database';

interface CustomerSelectorProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onCustomerSelect: (customerId: string) => void;
  onAddNewClick: () => void;
}

export const CustomerSelector = ({ 
  customers, 
  selectedCustomerId, 
  onCustomerSelect, 
  onAddNewClick 
}: CustomerSelectorProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Customer</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAddNewClick}>
          <Plus size={14} className="mr-1" />
          Add New
        </Button>
      </div>
      <Select value={selectedCustomerId || 'none'} onValueChange={onCustomerSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select customer or add new" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No customer selected</SelectItem>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name} {customer.email && `(${customer.email})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
