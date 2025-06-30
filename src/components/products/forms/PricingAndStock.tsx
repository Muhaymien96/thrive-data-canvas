
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProductFormData } from '@/types/product';

interface PricingAndStockProps {
  formData: ProductFormData;
  onInputChange: (field: string, value: string) => void;
}

export const PricingAndStock = ({ formData, onInputChange }: PricingAndStockProps) => {
  const calculateMarkup = (cost: number, price: number): number => {
    return cost > 0 ? ((price - cost) / cost) * 100 : 0;
  };

  const cost = parseFloat(formData.cost) || 0;
  const price = parseFloat(formData.price) || 0;
  const markup = calculateMarkup(cost, price);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pricing & Stock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cost">Cost Price (R) *</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => onInputChange('cost', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Selling Price (R) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => onInputChange('price', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="currentStock">Current Stock</Label>
            <Input
              id="currentStock"
              type="number"
              value={formData.currentStock}
              onChange={(e) => onInputChange('currentStock', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
            <Input
              id="minStockLevel"
              type="number"
              value={formData.minStockLevel}
              onChange={(e) => onInputChange('minStockLevel', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="maxStock">Maximum Stock</Label>
            <Input
              id="maxStock"
              type="number"
              value={formData.maxStock}
              onChange={(e) => onInputChange('maxStock', e.target.value)}
            />
          </div>
        </div>

        {cost > 0 && price > 0 && (
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600">
              Markup: <span className="font-medium">{markup.toFixed(1)}%</span>
            </p>
            <p className="text-sm text-slate-600">
              Profit per unit: <span className="font-medium">R{(price - cost).toFixed(2)}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
