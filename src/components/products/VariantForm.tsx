
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Plus } from 'lucide-react';
import type { ProductType } from '@/types/database';

interface VariantData {
  variant_type: string;
  variant_value: string;
  sku: string;
  cost: string;
  price: string;
  currentStock: string;
  minStockLevel: string;
  maxStock: string;
  conversionFactor: string;
}

interface VariantFormProps {
  productType: ProductType;
  onProductTypeChange: (type: ProductType) => void;
  parentProductId?: string;
  onParentProductChange: (id: string) => void;
  variants: VariantData[];
  onVariantsChange: (variants: VariantData[]) => void;
  availableParents: Array<{ id: string; name: string }>;
  baseProductName: string;
}

export const VariantForm = ({
  productType,
  onProductTypeChange,
  parentProductId,
  onParentProductChange,
  variants,
  onVariantsChange,
  availableParents,
  baseProductName
}: VariantFormProps) => {
  const addVariant = () => {
    const newVariant: VariantData = {
      variant_type: 'weight',
      variant_value: '',
      sku: '',
      cost: '',
      price: '',
      currentStock: '',
      minStockLevel: '',
      maxStock: '',
      conversionFactor: '1'
    };
    onVariantsChange([...variants, newVariant]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onVariantsChange(newVariants);
  };

  const updateVariant = (index: number, field: keyof VariantData, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onVariantsChange(newVariants);
  };

  const generateSKU = (index: number) => {
    const variant = variants[index];
    if (baseProductName && variant.variant_value) {
      const baseSKU = baseProductName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 6);
      const variantSKU = variant.variant_value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
      const sku = `${baseSKU}-${variantSKU}`;
      updateVariant(index, 'sku', sku);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Type & Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="productType">Product Type</Label>
          <Select value={productType} onValueChange={(value: ProductType) => onProductTypeChange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standalone">Standalone Product</SelectItem>
              <SelectItem value="parent">Parent Product (with variants)</SelectItem>
              <SelectItem value="variant">Product Variant</SelectItem>
              <SelectItem value="bulk">Bulk Stock Item</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {productType === 'variant' && (
          <div>
            <Label htmlFor="parentProduct">Parent Product</Label>
            <Select value={parentProductId} onValueChange={onParentProductChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent product" />
              </SelectTrigger>
              <SelectContent>
                {availableParents.map((parent) => (
                  <SelectItem key={parent.id} value={parent.id}>
                    {parent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {productType === 'parent' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Product Variants</h4>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus size={16} className="mr-1" />
                Add Variant
              </Button>
            </div>

            {variants.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add variants for this product (e.g., different sizes, weights, or flavors)
              </p>
            )}

            {variants.map((variant, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium">Variant {index + 1}</h5>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <Label>Variant Type</Label>
                    <Select
                      value={variant.variant_type}
                      onValueChange={(value) => updateVariant(index, 'variant_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight">Weight</SelectItem>
                        <SelectItem value="size">Size</SelectItem>
                        <SelectItem value="volume">Volume</SelectItem>
                        <SelectItem value="flavor">Flavor</SelectItem>
                        <SelectItem value="color">Color</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Variant Value</Label>
                    <Input
                      placeholder="e.g., 500g, 1kg, Large"
                      value={variant.variant_value}
                      onChange={(e) => updateVariant(index, 'variant_value', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>SKU</Label>
                    <div className="flex gap-1">
                      <Input
                        placeholder="Auto-generated or custom"
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => generateSKU(index)}
                      >
                        Gen
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Cost Price (R)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.cost}
                      onChange={(e) => updateVariant(index, 'cost', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Selling Price (R)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Current Stock</Label>
                    <Input
                      type="number"
                      value={variant.currentStock}
                      onChange={(e) => updateVariant(index, 'currentStock', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Min Stock Level</Label>
                    <Input
                      type="number"
                      value={variant.minStockLevel}
                      onChange={(e) => updateVariant(index, 'minStockLevel', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Max Stock</Label>
                    <Input
                      type="number"
                      value={variant.maxStock}
                      onChange={(e) => updateVariant(index, 'maxStock', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Conversion Factor</Label>
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="1.0"
                      value={variant.conversionFactor}
                      onChange={(e) => updateVariant(index, 'conversionFactor', e.target.value)}
                      title="For bulk conversions (e.g., 0.5 for 500g from 1kg bulk)"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {productType === 'bulk' && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Bulk Stock Item:</strong> This product will be used for internal stock management and packaging into retail units. 
              Set the conversion factor to indicate how this bulk item relates to retail units.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
