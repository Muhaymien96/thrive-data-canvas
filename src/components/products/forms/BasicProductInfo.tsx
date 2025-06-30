
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProductFormData } from '@/types/product';
import type { Supplier } from '@/types/database';

interface BasicProductInfoProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: string) => void;
  suppliers: Supplier[];
  suppliersLoading: boolean;
}

export const BasicProductInfo = ({ 
  formData, 
  onInputChange, 
  suppliers, 
  suppliersLoading 
}: BasicProductInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => onInputChange('sku', e.target.value)}
              placeholder="Auto-generated if empty"
            />
          </div>

          <div>
            <Label htmlFor="supplier">Supplier *</Label>
            <Select 
              value={formData.supplierId} 
              onValueChange={(value) => onInputChange('supplierId', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliersLoading ? (
                  <SelectItem value="loading" disabled>Loading suppliers...</SelectItem>
                ) : suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                      {supplier.name === 'Self-Produced' && ' (Own Production)'}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-suppliers" disabled>No suppliers available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => onInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Seafood">Seafood</SelectItem>
                <SelectItem value="Fresh Fish">Fresh Fish</SelectItem>
                <SelectItem value="Premium Fish">Premium Fish</SelectItem>
                <SelectItem value="Shellfish">Shellfish</SelectItem>
                <SelectItem value="Raw Honey">Raw Honey</SelectItem>
                <SelectItem value="Premium Honey">Premium Honey</SelectItem>
                <SelectItem value="Flavored Honey">Flavored Honey</SelectItem>
                <SelectItem value="Comb Honey">Comb Honey</SelectItem>
                <SelectItem value="Fresh Mushrooms">Fresh Mushrooms</SelectItem>
                <SelectItem value="Exotic Mushrooms">Exotic Mushrooms</SelectItem>
                <SelectItem value="Dried Mushrooms">Dried Mushrooms</SelectItem>
                <SelectItem value="Organic Mushrooms">Organic Mushrooms</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                <SelectItem value="Natural Products">Natural Products</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select value={formData.unit} onValueChange={(value) => onInputChange('unit', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="piece">piece</SelectItem>
                <SelectItem value="box">box</SelectItem>
                <SelectItem value="jar">jar</SelectItem>
                <SelectItem value="punnet">punnet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => onInputChange('expiryDate', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
