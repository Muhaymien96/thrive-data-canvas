
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { Supplier } from '@/types/database';

interface SupplierSelectorProps {
  suppliers: Supplier[];
  selectedSupplierId: string | null;
  onSupplierSelect: (supplierId: string) => void;
  onAddNewClick: () => void;
}

export const SupplierSelector = ({ 
  suppliers, 
  selectedSupplierId, 
  onSupplierSelect, 
  onAddNewClick 
}: SupplierSelectorProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Supplier</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAddNewClick}>
          <Plus size={14} className="mr-1" />
          Add New
        </Button>
      </div>
      <Select value={selectedSupplierId || 'none'} onValueChange={onSupplierSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select supplier or add new" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No supplier selected</SelectItem>
          {suppliers.map((supplier) => (
            <SelectItem key={supplier.id} value={supplier.id}>
              {supplier.name} {supplier.category && `(${supplier.category})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
