
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { Product } from '@/types/database';

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: string;
  quantity: number;
  onProductSelect: (productId: string) => void;
  onQuantityChange: (quantity: number) => void;
  showQuantity: boolean;
}

export const ProductSelector = ({ 
  products, 
  selectedProductId, 
  quantity, 
  onProductSelect, 
  onQuantityChange, 
  showQuantity 
}: ProductSelectorProps) => {
  return (
    <>
      <div>
        <Label htmlFor="product">Product (Optional)</Label>
        <Select value={selectedProductId || 'none'} onValueChange={onProductSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No product selected</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} - R{product.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showQuantity && (
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            min="1"
            step="1"
          />
        </div>
      )}
    </>
  );
};
