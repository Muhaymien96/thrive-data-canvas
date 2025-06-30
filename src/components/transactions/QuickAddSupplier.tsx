
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateSupplier } from '@/hooks/useSuppliers';
import { Loader2 } from 'lucide-react';

interface QuickAddSupplierProps {
  businessId: string;
  onSupplierCreated: (supplierId: string, supplierName: string) => void;
  onCancel: () => void;
}

export const QuickAddSupplier = ({ businessId, onSupplierCreated, onCancel }: QuickAddSupplierProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: ''
  });

  const createSupplier = useCreateSupplier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    try {
      const supplierData = {
        business_id: businessId,
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        category: formData.category.trim() || null,
        address: null,
        rating: 0,
        total_spent: 0,
        outstanding_balance: 0,
        payment_details: null
      };

      const newSupplier = await createSupplier.mutateAsync(supplierData);
      onSupplierCreated(newSupplier.id, newSupplier.name);
    } catch (error) {
      console.error('Failed to create supplier:', error);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="font-medium mb-3">Quick Add Supplier</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="supplier-name">Supplier Name *</Label>
          <Input
            id="supplier-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter supplier name"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="supplier-email">Email</Label>
            <Input
              id="supplier-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Optional"
            />
          </div>
          <div>
            <Label htmlFor="supplier-phone">Phone</Label>
            <Input
              id="supplier-phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="supplier-category">Category</Label>
          <Input
            id="supplier-category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="e.g., Food, Office Supplies"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={createSupplier.isPending || !formData.name.trim()}>
            {createSupplier.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1" />
                Adding...
              </>
            ) : (
              'Add Supplier'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
