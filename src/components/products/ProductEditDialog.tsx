
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { calculateMarkup, calculateSellingPrice } from '@/lib/mockData';
import type { Product } from '@/lib/mockData';

interface ProductEditDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export const ProductEditDialog = ({ product, open, onClose }: ProductEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    costPrice: 0,
    sellingPrice: 0,
    currentStock: 0,
    minStockLevel: 0,
    supplier: '',
    expiryDate: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        unit: product.unit,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        currentStock: product.currentStock,
        minStockLevel: product.minStockLevel,
        supplier: product.supplier,
        expiryDate: product.expiryDate || '',
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMarkupChange = (markupPercentage: number) => {
    if (formData.costPrice) {
      const newSellingPrice = calculateSellingPrice(formData.costPrice, markupPercentage);
      setFormData(prev => ({ ...prev, sellingPrice: Math.round(newSellingPrice * 100) / 100 }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product updated:', formData);
    
    toast({
      title: "Product Updated",
      description: `Successfully updated ${formData.name}`,
    });
    onClose();
  };

  const getUnitsForBusiness = (business: string) => {
    switch (business) {
      case 'Fish':
        return ['kg', 'piece', 'box'];
      case 'Honey':
        return ['L', 'kg', 'jar'];
      case 'Mushrooms':
        return ['kg', 'box', 'punnet'];
      default:
        return ['kg', 'L', 'piece', 'box'];
    }
  };

  const getCategoriesForBusiness = (business: string) => {
    switch (business) {
      case 'Fish':
        return ['Fresh Fish', 'Premium Fish', 'Seafood', 'Shellfish'];
      case 'Honey':
        return ['Raw Honey', 'Premium Honey', 'Flavored Honey', 'Comb Honey'];
      case 'Mushrooms':
        return ['Fresh Mushrooms', 'Exotic Mushrooms', 'Dried Mushrooms', 'Organic Mushrooms'];
      default:
        return ['General'];
    }
  };

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
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getCategoriesForBusiness(product.business).map((category) => (
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
                  {getUnitsForBusiness(product.business).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price (R) *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (R) *</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.sellingPrice}
                onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
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
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock *</Label>
              <Input
                id="currentStock"
                type="number"
                min="0"
                value={formData.currentStock}
                onChange={(e) => handleInputChange('currentStock', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStockLevel">Minimum Stock Level *</Label>
              <Input
                id="minStockLevel"
                type="number"
                min="0"
                value={formData.minStockLevel}
                onChange={(e) => handleInputChange('minStockLevel', parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          {formData.costPrice && formData.sellingPrice && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">
                Markup: <span className="font-medium">{calculateMarkup(formData.costPrice, formData.sellingPrice).toFixed(1)}%</span>
              </p>
              <p className="text-sm text-slate-600">
                Profit per unit: <span className="font-medium">R{(formData.sellingPrice - formData.costPrice).toFixed(2)}</span>
              </p>
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
