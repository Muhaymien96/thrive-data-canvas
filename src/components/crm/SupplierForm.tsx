
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import type { Business, BusinessWithAll } from '@/types/transaction';

interface SupplierFormProps {
  onClose: () => void;
  selectedBusiness: BusinessWithAll;
}

export const SupplierForm = ({ onClose, selectedBusiness }: SupplierFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    business: (selectedBusiness === 'All' ? 'Fish' : selectedBusiness) as Business,
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Supplier data:', formData);
    onClose();
  };

  const getCategoriesForBusiness = (business: string) => {
    switch (business) {
      case 'Fish':
        return ['Seafood Supplier', 'Packaging', 'Equipment', 'Logistics'];
      case 'Honey':
        return ['Beekeeping Supplies', 'Packaging', 'Equipment', 'Processing'];
      case 'Mushrooms':
        return ['Growing Supplies', 'Packaging', 'Equipment', 'Seeds/Spores'];
      default:
        return ['General', 'Equipment', 'Packaging', 'Services'];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add New Supplier</h2>
        <Button variant="outline" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Supplier Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="business">Business *</Label>
            <Select
              value={formData.business}
              onValueChange={(value) => setFormData(prev => ({ ...prev, business: value as Business }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fish">Fish</SelectItem>
                <SelectItem value="Honey">Honey</SelectItem>
                <SelectItem value="Mushrooms">Mushrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {getCategoriesForBusiness(formData.business).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add Supplier
          </Button>
        </div>
      </form>
    </div>
  );
};
