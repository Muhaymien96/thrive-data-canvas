
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { X, CreditCard } from 'lucide-react';
import { useCreateSupplier, useUpdateSupplier } from '@/hooks/useSuppliers';
import type { Supplier, SupplierPaymentDetails } from '@/types/database';

interface SupplierFormProps {
  supplier?: Supplier | null;
  businessId: string;
  onClose: () => void;
}

export const SupplierForm = ({ supplier, businessId, onClose }: SupplierFormProps) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    category: supplier?.category || '',
    rating: supplier?.rating || 0,
    total_spent: supplier?.total_spent || 0,
    outstanding_balance: supplier?.outstanding_balance || 0
  });

  const [paymentDetails, setPaymentDetails] = useState<SupplierPaymentDetails>(
    (supplier?.payment_details as SupplierPaymentDetails) || {}
  );

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId) {
      return;
    }

    try {
      const supplierData = {
        ...formData,
        payment_details: Object.keys(paymentDetails).some(key => paymentDetails[key as keyof SupplierPaymentDetails]) 
          ? paymentDetails as any // Cast to any to satisfy Json type
          : null
      };

      if (supplier) {
        await updateSupplier.mutateAsync({
          id: supplier.id,
          ...supplierData
        });
      } else {
        await createSupplier.mutateAsync({
          ...supplierData,
          business_id: businessId
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const isLoading = createSupplier.isPending || updateSupplier.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Basic Information</h3>
              
              <div>
                <Label htmlFor="name">Supplier Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="outstanding_balance">Outstanding Balance</Label>
                  <Input
                    id="outstanding_balance"
                    type="number"
                    step="0.01"
                    value={formData.outstanding_balance || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, outstanding_balance: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center space-x-2">
                <CreditCard size={18} />
                <span>Payment Details (Optional)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Input
                    id="bank_name"
                    value={paymentDetails.bank_name || ''}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, bank_name: e.target.value }))}
                    placeholder="e.g., Standard Bank"
                  />
                </div>
                <div>
                  <Label htmlFor="account_holder">Account Holder</Label>
                  <Input
                    id="account_holder"
                    value={paymentDetails.account_holder || ''}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, account_holder: e.target.value }))}
                    placeholder="Account holder name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    id="account_number"
                    value={paymentDetails.account_number || ''}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, account_number: e.target.value }))}
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <Label htmlFor="swift_code">SWIFT Code</Label>
                  <Input
                    id="swift_code"
                    value={paymentDetails.swift_code || ''}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, swift_code: e.target.value }))}
                    placeholder="SWIFT/BIC code"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reference">Payment Reference</Label>
                <Input
                  id="reference"
                  value={paymentDetails.reference || ''}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, reference: e.target.value }))}
                  placeholder="Payment reference or note"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (supplier ? 'Update Supplier' : 'Add Supplier')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
