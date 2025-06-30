import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useSuppliers, useCreateSupplier } from '@/hooks/useSuppliers';
import { useCreateProduct } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProductFormProps {
  onClose: () => void;
  defaultBusiness?: string;
}

export const ProductForm = ({ onClose, defaultBusiness }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    price: '',
    category: '',
    unit: '',
    currentStock: '',
    minStockLevel: '',
    maxStock: '',
    supplierId: '',
    expiryDate: ''
  });

  const { data: suppliers = [], isLoading: suppliersLoading, refetch: refetchSuppliers } = useSuppliers(defaultBusiness);
  const createProduct = useCreateProduct();
  const createSupplier = useCreateSupplier();

  // Ensure self-supplier exists when component mounts
  useEffect(() => {
    const ensureSelfSupplier = async () => {
      if (!defaultBusiness || !suppliers) return;
      
      console.log('Checking for self-supplier. Current suppliers:', suppliers);
      
      const selfSupplier = suppliers.find(s => s.name === 'Self-Produced');
      if (!selfSupplier) {
        console.log('Self-supplier not found, creating one...');
        try {
          await createSupplier.mutateAsync({
            business_id: defaultBusiness,
            name: 'Self-Produced',
            category: 'Internal Production',
            rating: 5,
            total_spent: 0,
            outstanding_balance: 0
          });
          // Refetch suppliers after creating self-supplier
          refetchSuppliers();
        } catch (error) {
          console.error('Failed to create self-supplier:', error);
        }
      }
    };

    if (suppliers.length >= 0 && !suppliersLoading) {
      ensureSelfSupplier();
    }
  }, [suppliers, suppliersLoading, defaultBusiness, createSupplier, refetchSuppliers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!defaultBusiness) {
      toast({
        title: "Error",
        description: "Business ID is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.supplierId) {
      toast({
        title: "Error",
        description: "Please select a supplier",
        variant: "destructive",
      });
      return;
    }

    try {
      const productData = {
        business_id: defaultBusiness,
        name: formData.name,
        description: formData.description || null,
        cost: parseFloat(formData.cost) || 0,
        price: parseFloat(formData.price) || 0,
        category: formData.category || null,
        unit: formData.unit || null,
        current_stock: parseInt(formData.currentStock) || 0,
        min_stock_level: parseInt(formData.minStockLevel) || 0,
        max_stock: parseInt(formData.maxStock) || null,
        supplier_id: formData.supplierId,
        supplier_name: suppliers.find(s => s.id === formData.supplierId)?.name || null,
        expiry_date: formData.expiryDate || null,
        markup_percentage: formData.cost && formData.price ? 
          ((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.cost) * 100) : null
      };

      console.log('Creating product with data:', productData);
      await createProduct.mutateAsync(productData);
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateMarkup = (cost: number, price: number): number => {
    return cost > 0 ? ((price - cost) / cost) * 100 : 0;
  };

  const cost = parseFloat(formData.cost) || 0;
  const price = parseFloat(formData.price) || 0;
  const markup = calculateMarkup(cost, price);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Add New Product
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="supplier">Supplier *</Label>
              <Select 
                value={formData.supplierId} 
                onValueChange={(value) => handleInputChange('supplierId', value)}
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
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
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
              <Label htmlFor="cost">Cost Price (R) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
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
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="currentStock">Current Stock</Label>
              <Input
                id="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => handleInputChange('currentStock', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
              <Input
                id="minStockLevel"
                type="number"
                value={formData.minStockLevel}
                onChange={(e) => handleInputChange('minStockLevel', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="maxStock">Maximum Stock</Label>
              <Input
                id="maxStock"
                type="number"
                value={formData.maxStock}
                onChange={(e) => handleInputChange('maxStock', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
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

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
