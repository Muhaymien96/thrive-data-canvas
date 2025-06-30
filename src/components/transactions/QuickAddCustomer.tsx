
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateCustomer } from '@/hooks/useCustomers';
import { Loader2 } from 'lucide-react';

interface QuickAddCustomerProps {
  businessId: string;
  onCustomerCreated: (customerId: string, customerName: string) => void;
  onCancel: () => void;
}

export const QuickAddCustomer = ({ businessId, onCustomerCreated, onCancel }: QuickAddCustomerProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const createCustomer = useCreateCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    try {
      const customerData = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        business_id: businessId,
        address: null,
        credit_limit: 0,
        payment_terms: 30,
        tags: [],
        total_spent: 0,
        total_purchases: 0,
        outstanding_balance: 0,
        invoice_preference: 'email' as const,
        last_purchase: null,
      };

      const newCustomer = await createCustomer.mutateAsync(customerData);
      onCustomerCreated(newCustomer.id, newCustomer.name);
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="font-medium mb-3">Quick Add Customer</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="customer-name">Customer Name *</Label>
          <Input
            id="customer-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter customer name"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Optional"
            />
          </div>
          <div>
            <Label htmlFor="customer-phone">Phone</Label>
            <Input
              id="customer-phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={createCustomer.isPending || !formData.name.trim()}>
            {createCustomer.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1" />
                Adding...
              </>
            ) : (
              'Add Customer'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
