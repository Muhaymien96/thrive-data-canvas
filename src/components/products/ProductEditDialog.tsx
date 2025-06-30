
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useUpdateProduct } from '@/hooks/useProducts';
import type { ProductWithSupplier } from '@/types/database';

interface ProductEditDialogProps {
  product: ProductWithSupplier | null;
  open: boolean;
  onClose: () => void;
}

export const ProductEditDialog = ({ product, open, onClose }: ProductEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    cost: 0,
    price: 0,
    current_stock: 0,
    min_stock_level: 0,
    supplier_id: '',
    expiry_date: '',
  });

  const { data: suppliers = [] } = useSuppliers(product?.business_id);
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category || '',
        unit: product.unit || '',
        cost: product.cost,
        price: product.price,
        current_stock: product.current_stock || 0,
        min_stock_level: product.min_stock_level || 0,
        supplier_id: product.supplier_id || '',
        expiry_date: product.expiry_date || '',
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateMarkup = (cost: number, price: number): number => {
    return cost > 0 ? ((price - cost) / cost) * 100 : 0;
  };

  const calculateSellingPrice = (cost: number, markupPercentage: number): number => {
    return cost * (1 + markupPercentage / 100);
  };

  const handleMarkupChange = (markupPercentage: number) => {
    if (formData.cost) {
      const newSellingPrice = calculateSellingPrice(formData.cost, markupPercentage);
      setFormData(prev => ({ ...prev, price: Math.round(newSellingPrice * 100) / 100 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const updateData = {
        ...formData,
        supplier_name: suppliers.find(s => s.id === formData.supplier_id)?.name || null,
        markup_percentage: calculateMarkup(formData.cost, formData.price)
      };

      await updateProduct.mutateAsync({
        id: product.id,
        ...updateData
      });
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const categories = [
    'Seafood', 'Fresh Fish', 'Premium Fish', 'Shellfish',
    'Raw Honey', 'Premium Honey', 'Flavored Honey', 'Comb Honey',
    'Fresh Mushrooms', 'Exotic Mushrooms', 'Dried Mushrooms', 'Organic Mushrooms',
    'Vegetables', 'Natural Products', 'Other'
  ];

  const units = ['kg', 'L', 'piece', 'box', 'jar', 'punnet'];

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select 
                value={formData.supplier_id}
                onValueChange={(value) => handleInputChange('supplier_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                      {supplier.name === 'Self-Produced' && ' (Own Production)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select 
                value={formData.unit}
                onValueChange={(value) => handleInputChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost Price (R) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Selling Price (R) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Quick Markup</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkupChange(25)}
                >
                  +25%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkupChange(50)}
                >
                  +50%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkupChange(75)}
                >
                  +75%
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleInputChange('expiry_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_stock">Current Stock *</Label>
              <Input
                id="current_stock"
                type="number"
                min="0"
                value={formData.current_stock}
                onChange={(e) => handleInputChange('current_stock', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_stock_level">Minimum Stock Level *</Label>
              <Input
                id="min_stock_level"
                type="number"
                min="0"
                value={formData.min_stock_level}
                onChange={(e) => handleInputChange('min_stock_level', parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          {formData.cost && formData.price && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">
                Markup: <span className="font-medium">{calculateMarkup(formData.cost, formData.price).toFixed(1)}%</span>
              </p>
              <p className="text-sm text-slate-600">
                Profit per unit: <span className="font-medium">R{(formData.price - formData.cost).toFixed(2)}</span>
              </p>
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={updateProduct.isPending}>
              {updateProduct.isPending ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
