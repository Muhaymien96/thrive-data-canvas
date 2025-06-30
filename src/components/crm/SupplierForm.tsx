
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useCreateSupplier, useUpdateSupplier } from '@/hooks/useSuppliers';
import type { Supplier } from '@/types/database';

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
    total_spent: supplier?.total_spent || 0
  });

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessId) {
      return;
    }

    try {
      if (supplier) {
        await updateSupplier.mutateAsync({
          id: supplier.id,
          ...formData
        });
      } else {
        await createSupplier.mutateAsync({
          ...formData,
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
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
